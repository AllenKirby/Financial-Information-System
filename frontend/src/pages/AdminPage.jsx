import { Outlet,  useLocation  } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "../components/Header";
import Navbar from "../components/Navbar";

import { FaRegUser } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { CiViewList } from "react-icons/ci";
import { TbLogs } from "react-icons/tb";

const AdminPage = () => {
    const page = useLocation()
    const [location, setLocation] = useState('')

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