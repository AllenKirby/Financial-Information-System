import { Outlet, useLocation } from "react-router-dom"
import { useOpDisbursementContext } from '../hooks/useOpDisbursementContext'
import { firestore } from "../config/firebase-config"
import { collection, doc, query, where, onSnapshot } from "firebase/firestore"

import Navbar from "../components/Navbar"
import Header from "../components/Header"

import { TiDocumentText } from "react-icons/ti";
import { TbLayoutDashboard } from "react-icons/tb";
import { BsTable } from "react-icons/bs";
import { useState, useEffect } from "react"
import { FiBook } from "react-icons/fi";

import { useAuthContext } from "../hooks/useAuthContext";
import { useFundingHook } from "../hooks/useFundingHook"

import {useDispatch, useSelector} from 'react-redux'
import { setPermission } from '../redux/PermissionRedux'

const OperatorPage = () => {
  const page = useLocation()
  const [location, setLocation] = useState('')
  const [navbarExpand, setNavbarExpand] = useState(true)
  const { user } = useAuthContext()
  const { dispatch: dispatchContext, documents } = useOpDisbursementContext()
  const { retrieveControlBooks } = useFundingHook()
  // const [status, setStatus] = useState([])
  const dispatch = useDispatch()
  const permission = useSelector((state) => state.permission)
  const apiURL = import.meta.env.VITE_API_URL

  const navItems = [
    { label: 'Dashboard', path: '/operator/dashboard', icon: <TbLayoutDashboard size={22} /> },
    { label: 'Disbursement Records', path: '/operator/disbursementrecords', icon: <TiDocumentText size={22} /> },
    { label: 'Control Book', path: '/operator/controlbook', icon: <FiBook size={20 } /> },
    { label: 'Disbursement Logs', path: '/operator/disbursementlogs', icon: <BsTable size={18} /> }
  ]

  useEffect(() => {
    if(page.pathname === "/operator/disbursementrecords"){
      setLocation('Disbursement Records')
    }else if(page.pathname === "/operator/dashboard"){
      setLocation('Dashboard')
    }else if(page.pathname === "/operator/controlbook"){
      setLocation('Control Book')
    } else if(page.pathname === "/operator/disbursementlogs"){
      setLocation('Disbursement Logs')
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

  useEffect(() => {
    // if (!status.length) return;  
    const status = permission?.data?.permission ? ['Drafting', 'In Review', 'Returned|3', 'Returned|4'] : ['In Review', 'Returned|3']
    const q = query(collection(firestore, 'records'), where('status', 'in', status ? status : ['In Review', 'Returned|3']));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newDocuments = {documents: snapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = {data: {...doc.data()}};
        return acc;
      }, {})};
      
      dispatchContext({type: 'SET_OPDOCUMENTS', payload: newDocuments})
    })

    return () => unsubscribe()

  }, [user, dispatchContext, apiURL, documents, permission?.data?.permission])
  // permission.data.permission 

  const collapseSideBar = () => {
    setNavbarExpand(!navbarExpand)
  }

  return (
    <main className="relative h-screen w-full flex bg-coolSteel">
      {navbarExpand && (
        <aside className={`${navbarExpand ? 'w-full' : 'w-0'} z-30 block lg:hidden absolute top-0 left-0 h-full transition-all duration-100`}>
          <div className="relative w-3/4 h-full z-40">
            <Navbar items={navItems} flag={navbarExpand} sidebar={collapseSideBar}/>
          </div>
        </aside>
      )}
      <aside className={`${navbarExpand ? 'absolute lg:relative hidden lg:w-1/6' : 'w-[78px]'} hidden lg:block h-full transition-all duration-100`}>
        <Navbar items={navItems} flag={navbarExpand}/>
      </aside>
      <section className={`h-full ${navbarExpand ? 'w-full sm:w-full md:w-full lg:w-5/6 xl:w-5/6 2xl:w-5/6' : 'w-full'}`}>
        <section className="h-[8%] lg:h-[10%] w-full flex items-center justify-center border-b-2">
          <Header currentPage={location} sidebar={collapseSideBar}/>
        </section>
        <section className="h-[92%] lg:h-[90%] w-full flex">
            <Outlet/>
        </section>
      </section>
    </main>
  )
}

export default OperatorPage