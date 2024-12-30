import Navbar from "../components/Navbar"
import Header from "../components/Header"

import { Outlet, useLocation } from "react-router-dom"
import axios from "axios"
import { useHeadDisbursementContext } from "../hooks/useHeadDisbursementContext"
import { firestore } from "../config/firebase-config"
import { collection, query, doc, where, onSnapshot } from "firebase/firestore"
import { useDispatch, useSelector } from 'react-redux'
import { setPermission } from "../redux/PermissionRedux" 
import { useEffect, useState } from "react"

import { TbLayoutDashboard } from "react-icons/tb";
import { TbLogs, TbEdit } from "react-icons/tb";
import { PiFileThin, PiTableThin } from "react-icons/pi";

import { useAuthContext } from "../hooks/useAuthContext"
import {initializeSocket } from "../socketService/socketService";


const HeadPage = () => {
  const page = useLocation()
  const [location, setLocation] = useState('')
  const [navbarExpand, setNavbarExpand] = useState(true)
  const { user } = useAuthContext() 
  const { dispatch: dispatchContext, documents } = useHeadDisbursementContext()
  const dispatch = useDispatch()
  const permission = useSelector((state) => state.permission)
  // const [status, setStatus] = useState([])
  const apiURL = import.meta.env.VITE_API_URL

  const navItems = [
      { label: 'Dashboard', path: '/head/dashboard', icon: <TbLayoutDashboard size={22} /> },
      { label: 'Disbursement Records', path: '/head/disbursementrecords', icon: <PiFileThin size={22} /> }, 
      ...(permission?.data?.permission 
        ? [{label: 'History Logs', path: '/head/historylogs', icon: <TbLogs size={22} /> } , {label: 'Edit Form', path: '/head/editform', icon: <TbEdit size={22}/>}] 
        : []),
      { label: 'Disbursement Logs', path: '/head/disbursementlogs', icon: <PiTableThin size={20} /> }
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
        setLocation('Disbursement Records')
      } else if(page.pathname === "/head/dashboard") {
        setLocation('Dashboard')
      }else if(page.pathname === "/head/disbursementlogs") {
        setLocation('Disbursement Logs')
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
        dispatchContext({ type: 'SET_HEADDOCUMENTS', payload: doc });
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

export default HeadPage
