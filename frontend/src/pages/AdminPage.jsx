import { Outlet,  useLocation  } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "../components/Shared/Header";
import Navbar from "../components/Shared/Navbar";

import { TbLayoutDashboard, TbEdit } from "react-icons/tb";
import { FaRegFile } from "react-icons/fa";
import { MdOutlineHistory } from "react-icons/md";

//import { useAuthContext } from "../hooks/useAuthContext";
import { useAdminDisbursementContext } from '../hooks/useAdminDisbursementContext'
// import { firestore } from "../config/firebase-config"
// import { collection, query, where, onSnapshot } from "firebase/firestore"
import { useApproverHook } from "../hooks/useApproverHook";
import { useDispatch, useSelector } from "react-redux";
import { setVouchers } from "../redux/AllVouchersRedux";

import {initializeSocket } from "../socketService/socketService";

const AdminPage = () => {
  const page = useLocation()
  const [location, setLocation] = useState('')
  const [navbarExpand, setNavbarExpand] = useState(true)
  const [mobileSidebar, setMobileSidebar] = useState(false)
  //const { user } = useAuthContext()
  const { dispatch: contextDispatch  } = useAdminDisbursementContext()
  //const apiURL = import.meta.env.VITE_API_URL
  const { getRecords } = useApproverHook()
  const dispatch = useDispatch() 

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <TbLayoutDashboard size={22} /> },
    { label: 'Records', path: '/admin/disbursementrecords', icon: <FaRegFile size={20} /> },
    { label: 'Logs', path: '/admin/disbursementlogs', icon: <MdOutlineHistory size={22} /> },
    { label: 'Edit Form', path: '/admin/editform', icon: <TbEdit size={22}/>}
  ];

  // useEffect(() => {
  //     const unsubscribe = getRecords(dispatch)
  //     return () => unsubscribe
  // })

  useEffect(() => {
      if(page.pathname === "/admin/dashboard"){
          setLocation('Dashboard')
      }else if(page.pathname === "/admin/disbursementrecords"){
          setLocation('Records')
      }else if(page.pathname === "/admin/historylogs"){
          setLocation('Logs')
      }else if(page.pathname === "/admin/editform"){
          setLocation('Edit Form')
      }
  }, [page.pathname])

  const [documents, setDocuments] = useState({})
  useEffect(() => {
    const {socket, isInitialized} = initializeSocket()
    if(isInitialized){
      socket.on('admin:firestore:update', (doc) => {
        console.log(doc)
        const updatedDocuments = {...documents, ...doc};
        const filteredDV = filterApproverDocu(updatedDocuments)
        dispatch(setVouchers(doc))
        contextDispatch({ type: 'SET_ADMINDOCUMENTS', payload: filteredDV });
        setDocuments(updatedDocuments);
      })
      return () => {
        socket.off('admin:firestore:update');
      };
    }
  }, [documents])//[documents, user, apiURL, dispatch]

  const filterApproverDocu = (doc) => {
    const filteredData = Object.entries(doc).filter(([, value]) => ['Approved', 'For Approval'].includes(value.data.status))
    return Object.fromEntries(filteredData)
  }

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

export default AdminPage;