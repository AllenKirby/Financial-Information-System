import Navbar from "../components/Shared/Navbar"
import Header from "../components/Shared/Header"

import { Outlet, useLocation } from "react-router-dom"
//import axios from "axios"
//import { firestore } from "../config/firebase-config"
//import { collection, query, doc, where, onSnapshot } from "firebase/firestore"
import { useDispatch, useSelector } from 'react-redux'
import { setPermission } from "../redux/PermissionRedux" 
import { setDVRecords } from '../redux/DVUsersRedux'
import { useEffect, useState } from "react"

import { TbLayoutDashboard } from "react-icons/tb";
import { TbLogs, TbEdit } from "react-icons/tb";
import { FaRegFile } from "react-icons/fa";
import { MdOutlineHistory } from "react-icons/md";

//import { useAuthContext } from "../hooks/useAuthContext"
import {initializeSocket } from "../socketService/socketService";


const HeadPage = () => {
  const page = useLocation()
  const [location, setLocation] = useState('')
  const [navbarExpand, setNavbarExpand] = useState(true)
  const [mobileSidebar, setMobileSidebar] = useState(false)
  //const { user } = useAuthContext() 
  const dispatch = useDispatch()
  const permission = useSelector((state) => state.permission)
  // const [status, setStatus] = useState([])
  //const apiURL = import.meta.env.VITE_API_URL

  const navItems = [
      { label: 'Dashboard', path: '/head/dashboard', icon: <TbLayoutDashboard size={22} /> },
      { label: 'Records', path: '/head/disbursementrecords', icon: <FaRegFile size={20} /> }, 
      ...(permission?.data?.permission 
        ? [{label: 'Edit Form', path: '/head/editform', icon: <TbEdit size={22}/>}] 
        : []),
      { label: 'Logs', path: '/head/disbursementlogs', icon: <MdOutlineHistory size={22} /> }
    ];

  // useEffect(() => {
  //     const getPermission = async() => {
  //       try{
  //         const res = await axios.get(`${apiURL}/head/getPermission`, {
  //           withCredentials: true
  //         })
  //         if(res.status === 200){
  //           const data = res.data
  //           dispatch(setPermission(data))
  //         }
  //       } catch(error) {
  //         console.log(error)
  //       }
  //     }
  //     getPermission()

  //     const docRef = doc(firestore, 'Roles', 'Budget Officer'); 
  //     const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
  //     if (docSnapshot.exists()) {
  //       const documentData = { data: { ...docSnapshot.data() } };
  //       dispatch(setPermission(documentData));
  //     } else {
  //       console.log('No such document!');
  //     }
  //   });

  //     return () => unsubscribe()   
  // }, [dispatch, apiURL])

  useEffect(() => {
      if(page.pathname === "/head/disbursementrecords") {
        setLocation('Records')
      } else if(page.pathname === "/head/dashboard") {
        setLocation('Dashboard')
      }else if(page.pathname === "/head/disbursementlogs") {
        setLocation('Logs')
      }
  }, [page.pathname])

  // useEffect(() => {
  //     if(permission?.data?.permission) {
  //       setStatus(['Approved', 'Under Review', 'For Approval'])
  //     } else {
  //       setStatus(['Under Review'])
  //     }
  // }, [permission])

  // useEffect(() => {
  //   // if (!status.length) return;  
  //   const status = permission?.data?.permission ? ['Approved', 'Under Review', 'For Approval'] : ['Under Review']
  //   const q = query(collection(firestore, 'records'), where('status', 'in', status ? status : ['Under Review']));
  //   const unsubscribe = onSnapshot(q, (snapshot) => {
  //     const newDocuments = snapshot.docs.reduce((acc, doc) => {
  //       acc[doc.id] = { data: { ...doc.data() } };
  //       return acc;
  //     }, {});
  //     dispatchContext({ type: 'SET_HEADDOCUMENTS', payload: newDocuments });
  //   })

  //   return () => unsubscribe()
  // }, [user, dispatchContext, apiURL, status, documents, permission])

  useEffect(() => {
    const {socket, isInitialized} = initializeSocket()
    if(isInitialized){
      socket.on('head:firestore:update', (doc) => {
        //dispatchContext({ type: 'SET_HEADDOCUMENTS', payload: doc });
        dispatch(setDVRecords(doc))
      })
      socket.on('headPermission:firestore:update', (doc) => {
        dispatch(setPermission(doc));
      })
      return () => {
        socket.off('head:firestore:update');
        socket.off('headPermission:firestore:update');
      };
    }
  }, []) //[user, dispatchContext, apiURL, status, documents, permission]

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

export default HeadPage
