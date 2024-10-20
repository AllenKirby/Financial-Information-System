import { Outlet,  useLocation  } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "../components/Header";
import Navbar from "../components/Navbar";

import { RxDashboard } from "react-icons/rx";
import { CiViewList } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
//import { TbLogs } from "react-icons/tb";
import { useAuthContext } from "../hooks/useAuthContext";
import { useAdminDisbursementContext } from '../hooks/useAdminDisbursementContext'
import axios from "axios";
import { firestore } from "../config/firebase-config"
import { collection, query, where, onSnapshot } from "firebase/firestore"

const AdminPage = () => {
    const page = useLocation()
    const [location, setLocation] = useState('')
    const { user } = useAuthContext()
    const {documents, dispatch } = useAdminDisbursementContext()

    const navItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: <RxDashboard size={18} /> },
        { label: 'Disbursement Records', path: '/admin/disbursementrecords', icon: <CiViewList size={18} /> },
        // { label: 'History Logs', path: '/admin/historylogs', icon: <TbLogs size={18} /> },
        { label: 'Edit Form', path: '/admin/editform', icon: <FaRegEdit size={18}/>}
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
        const retrieveDV = async () => {
            if(!documents){
                try {
                    const res = await axios.get('http://localhost:4000/admin/approvedDV', {
                        withCredentials: true
                    })  
                    if(res.status === 200){
                        const docu = res.data
                        dispatch({ type: 'SET_ADMINDOCUMENTS', payload: docu });
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }
        if(user){
            retrieveDV()
        }
        const q = query(collection(firestore, 'records'), where('status', 'in', ['Approved', 'For Approval']));
        const unsubscribe = onSnapshot(q, (snapshot) => {
        const newDocuments = snapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = {data: {...doc.data()}};
            return acc;
        }, {});
        dispatch({ type: 'SET_ADMINDOCUMENTS', payload: newDocuments });
        })

        return () => unsubscribe()
      }, [documents, user, dispatch])

    return(
        <main className="h-screen w-full flex bg-slate-100">
            <aside className="h-full w-1/6">
                <Navbar items={navItems}/>
            </aside>
            <section className="h-full w-5/6 ml-3">
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