import { Outlet,  useLocation  } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "../components/Header";
import Navbar from "../components/Navbar";

import { FaRegUser } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { CiViewList } from "react-icons/ci";
import { TbLogs } from "react-icons/tb";
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
        { label: 'History Logs', path: '/admin/historylogs', icon: <TbLogs size={18} /> },
        { label: 'User Management', path: '/admin/usermanagement', icon: <FaRegUser size={15}/> },
    ];

    useEffect(() => {
        if(page.pathname === "/admin/dashboard"){
            setLocation('Dashboard')
        }else if(page.pathname === "/admin/usermanagement"){
            setLocation('User Management')
        }else if(page.pathname === "/admin/disbursementrecords"){
            setLocation('Disbursement Records')
        }else if(page.pathname === "/admin/historylogs"){
            setLocation('History Logs')
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
                        console.log(docu)
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
        const q = query(collection(firestore, 'records'), where('status', '==', 'Approved'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
        const newDocuments = snapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = {data: {...doc.data()}};
            return acc;
        }, {});
        console.log(newDocuments)
        dispatch({ type: 'SET_ADMINDOCUMENTS', payload: newDocuments });
        })

        return () => unsubscribe()
      }, [documents, user, dispatch])

    return(
        <main className="h-screen w-full flex p-3 bg-gray-100">
            <aside className="h-full w-1/6">
                <Navbar items={navItems}/>
            </aside>
            <section className="h-full w-5/6 ml-3">
                <section className="h-1/6 w-full">
                    <Header currentPage={location}/>
                </section>
                <section className="h-5/6 w-full">
                    <Outlet/>
                </section>
            </section>
        </main>
    )
}

export default AdminPage;