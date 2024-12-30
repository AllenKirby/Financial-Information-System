import { Outlet, useLocation } from "react-router-dom"
import { useOpDisbursementContext } from '../hooks/useOpDisbursementContext'
import { firestore } from "../config/firebase-config"
import { doc, onSnapshot } from "firebase/firestore"

import Navbar from "../components/Navbar"
import Header from "../components/Header"

import { TbLayoutDashboard } from "react-icons/tb";
import { useState, useEffect } from "react"
import { FiBook } from "react-icons/fi";
import { FaRegFile } from "react-icons/fa";
import { MdOutlineHistory } from "react-icons/md";

import { useFundingHook } from "../hooks/useFundingHook"

import {useDispatch} from 'react-redux'
import { setPermission } from '../redux/PermissionRedux'

import {initializeSocket } from "../socketService/socketService";

const OperatorPage = () => {
  const page = useLocation()
  const [location, setLocation] = useState('')
  const [navbarExpand, setNavbarExpand] = useState(true)
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const { dispatch: dispatchContext } = useOpDisbursementContext()
  const { retrieveControlBooks } = useFundingHook()
  // const [status, setStatus] = useState([])
  const dispatch = useDispatch()
  //const permission = useSelector((state) => state.permission)
  //const apiURL = import.meta.env.VITE_API_URL

  const navItems = [
    { label: 'Dashboard', path: '/operator/dashboard', icon: <TbLayoutDashboard size={22} /> },
    { label: 'Records', path: '/operator/disbursementrecords', icon: <FaRegFile size={20} /> },
    { label: 'Control Book', path: '/operator/controlbook', icon: <FiBook size={20 } /> },
    { label: 'Logs', path: '/operator/disbursementlogs', icon: <MdOutlineHistory size={22} /> }
  ]

  useEffect(() => {
    if(page.pathname === "/operator/disbursementrecords"){
      setLocation('Records')
    }else if(page.pathname === "/operator/dashboard"){
      setLocation('Dashboard')
    }else if(page.pathname === "/operator/controlbook"){
      setLocation('Control Book')
    } else if(page.pathname === "/operator/disbursementlogs"){
      setLocation('Logs')
    } 
  }, [page.pathname])

  useEffect(() => {
    const fetch = async() => {
      const unsubscribe = retrieveControlBooks(dispatch)
      return () => unsubscribe;
    }
    fetch()
  }, []) 

  useEffect(() => {
    const docRef = doc(firestore, 'Roles', 'Funding'); 
    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const documentData = { data: { ...docSnapshot.data() } };

      dispatch(setPermission(documentData));
    } else {
      console.log('No such document!');
    }
    });

    return () => unsubscribe()   
  }, [dispatch])

  // useEffect(() => {
  //   if(permission?.data?.permission){
  //     setStatus(['Drafting', 'In Review', 'Returned|3', 'Returned|4'])
  //   }
  //   else{
  //     setStatus(['In Review', 'Returned|3'])
  //   }
  // }, [permission])

  // useEffect(() => {
  //   // if (!status.length) return;  
  //   const status = permission?.data?.permission ? ['Drafting', 'In Review', 'Returned|3', 'Returned|4'] : ['In Review', 'Returned|3']
  //   const q = query(collection(firestore, 'records'), where('status', 'in', status ? status : ['In Review', 'Returned|3']));
  //   const unsubscribe = onSnapshot(q, (snapshot) => {
  //     const newDocuments = {documents: snapshot.docs.reduce((acc, doc) => {
  //       acc[doc.id] = {data: {...doc.data()}};
  //       return acc;
  //     }, {})};
      
  //     dispatchContext({type: 'SET_OPDOCUMENTS', payload: newDocuments})
  //   })

  //   return () => unsubscribe()

  // }, [user, dispatchContext, apiURL, documents, permission?.data?.permission])
  // permission.data.permission 


  useEffect(() => {
    const {socket, isInitialized} = initializeSocket()
      if(isInitialized){
        socket.on('operator:firestore:update', (doc) => {
          console.log('hit')
          console.log(doc)
          dispatchContext({type: 'SET_OPDOCUMENTS', payload: doc})
        })
        return () => {
          socket.off('operator:firestore:update');
        };
      }
  }, []) //[user, dispatchContext, apiURL, documents, permission?.data?.permission]

  const collapseSideBar = () => {
    setNavbarExpand(!navbarExpand)
  }

  const collapseMobileSidebar = () => {
    setMobileSidebar(!mobileSidebar)
  }

  return (
    <main className="relative h-screen w-full flex bg-white">
      {mobileSidebar && (
        <aside className={`${mobileSidebar ? 'w-full' : 'w-0'} z-30 block lg:hidden absolute top-0 left-0 h-full transition-all duration-100`}>
          <div className="relative w-3/4 h-full z-40 bg-white">
            <Navbar items={navItems} flag={navbarExpand} sidebarMobile={collapseMobileSidebar}/>
          </div>
        </aside>
      )}
      <aside className={`${navbarExpand ? 'absolute lg:relative hidden lg:w-1/6' : 'w-[78px]'} hidden lg:block h-full transition-all duration-100`}>
        <Navbar items={navItems} flag={navbarExpand} sidebar={collapseSideBar}/>
      </aside>
      <section className={`h-full ${navbarExpand ? 'w-full sm:w-full md:w-full lg:w-5/6 xl:w-5/6 2xl:w-5/6' : 'w-full'}`}>
        <section className="h-[8%] lg:h-[10%] w-full flex items-center justify-center border-b-2">
          <Header currentPage={location} sidebar={collapseMobileSidebar}/>
        </section>
        <section className="h-[92%] lg:h-[90%] w-full flex">
            <Outlet/>
        </section>
      </section>
    </main>
  )
}

export default OperatorPage