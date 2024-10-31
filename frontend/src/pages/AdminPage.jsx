import { Outlet,  useLocation  } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "../components/Header";
import Navbar from "../components/Navbar";

import { TiDocumentText } from "react-icons/ti";
import { TbLayoutDashboard, TbEdit } from "react-icons/tb";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
//import { TbLogs } from "react-icons/tb";
import { useAuthContext } from "../hooks/useAuthContext";
import { useAdminDisbursementContext } from '../hooks/useAdminDisbursementContext'
import { firestore } from "../config/firebase-config"
import { collection, query, where, onSnapshot } from "firebase/firestore"

const AdminPage = () => {
    const page = useLocation()
    const [location, setLocation] = useState('')
    const [navbarExpand, setNavbarExpand] = useState(true)
    const [navbarSize, setNavbarSize] = useState('')
    const [mainSize, setMainSize] = useState('')
    const { user } = useAuthContext()
    const {documents, dispatch } = useAdminDisbursementContext()
    const apiURL = import.meta.env.VITE_API_URL

    const navItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: <TbLayoutDashboard size={18} /> },
        { label: 'Disbursement Records', path: '/admin/disbursementrecords', icon: <TiDocumentText size={18} /> },
        // { label: 'History Logs', path: '/admin/historylogs', icon: <TbLogs size={18} /> },
        { label: 'Edit Form', path: '/admin/editform', icon: <TbEdit size={18}/>}
    ];

    useEffect(() => {
        if(page.pathname === "/admin/dashboard"){
            setLocation('Dashboard')
        }else if(page.pathname === "/admin/disbursementrecords"){
            setLocation('Disbursement Records')
        }else if(page.pathname === "/admin/historylogs"){
            setLocation('History Logs')
        }else if(page.pathname === "/admin/editform"){
            setLocation('Edit Form')
        }
    }, [page.pathname])

    useEffect(() => {
        if(!navbarExpand) {
            setNavbarSize('w-[70px]')
            setMainSize('w-full')
        }else {
            setNavbarSize('w-1/6')
            setMainSize('w-5/6')
        }
    }, [navbarExpand])

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

    return(
        <main className="h-screen w-full flex bg-slate-100">
           <aside className={`h-full ${navbarSize} relative transition-all duration-100`}>
                <MdOutlineKeyboardArrowLeft 
                    size={25}
                    className='absolute top-6 z-10 -right-3 bg-white cursor-pointer rounded-full border-[1px]'
                    onClick={() => setNavbarExpand(!navbarExpand)}/>
                <Navbar items={navItems} flag={navbarExpand}/>
            </aside>
            <section className={`h-full ${mainSize} ml-3`}>
                <section className="h-[13%] w-full">
                    <Header currentPage={location}/>
                </section>
                <section className="h-[87%] w-full pr-3">
                    <Outlet/>
                </section>
            </section>
        </main>
    )
}

export default AdminPage;