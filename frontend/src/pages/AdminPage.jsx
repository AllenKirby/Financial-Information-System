import { Outlet,  useLocation  } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "../components/Header";
import Navbar from "../components/Navbar";

import { TiDocumentText } from "react-icons/ti";
import { TbLayoutDashboard, TbEdit } from "react-icons/tb";
import { BiGitCompare } from "react-icons/bi";
import { BsTable } from "react-icons/bs";

import { useAuthContext } from "../hooks/useAuthContext";
import { useAdminDisbursementContext } from '../hooks/useAdminDisbursementContext'
import { firestore } from "../config/firebase-config"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { useApproverHook } from "../hooks/useApproverHook";
import { useDispatch } from "react-redux";

const AdminPage = () => {
    const page = useLocation()
    const [location, setLocation] = useState('')
    const [navbarExpand, setNavbarExpand] = useState(true)
    const { user } = useAuthContext()
    const {documents, dispatch } = useAdminDisbursementContext()
    const apiURL = import.meta.env.VITE_API_URL
    const { getRecords } = useApproverHook()
    const dispatchVouchers = useDispatch() 

    const navItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: <TbLayoutDashboard size={22} /> },
        { label: 'Disbursement Records', path: '/admin/disbursementrecords', icon: <TiDocumentText size={22} /> },
        { label: 'Disbursement Logs', path: '/admin/disbursementlogs', icon: <BsTable size={18} /> },
        { label: 'Edit Form', path: '/admin/editform', icon: <TbEdit size={22}/>},
        { label: 'Comparison', path:'/admin/comparison', icon: <BiGitCompare size={22}/>}
    ];

    useEffect(() => {
        const unsubscribe = getRecords(dispatchVouchers)
        return () => unsubscribe
    })

    useEffect(() => {
        if(page.pathname === "/admin/dashboard"){
            setLocation('Dashboard')
        }else if(page.pathname === "/admin/disbursementrecords"){
            setLocation('Disbursement Records')
        }else if(page.pathname === "/admin/historylogs"){
            setLocation('History Logs')
        }else if(page.pathname === "/admin/editform"){
            setLocation('Edit Form')
        }else if(page.pathname === "/admin/comparison"){
            setLocation('Comparison')
        }
    }, [page.pathname])

    useEffect(() => {
        const q = query(collection(firestore, 'records'), where('status', 'in', ['Approved', 'For Approval']));
        const unsubscribe = onSnapshot(q, (snapshot) => {
        const newDocuments = snapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = {data: {...doc.data()}};
            return acc;
        }, {});
            dispatch({ type: 'SET_ADMINDOCUMENTS', payload: newDocuments });
        })

        return () => unsubscribe()
    }, [documents, user, apiURL, dispatch])

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

export default AdminPage;