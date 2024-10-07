import { Outlet,  useLocation  } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

import Header from "../components/Header";
import Navbar from "../components/Navbar";

import { FaRegUser } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";

const AdminPage = () => {
    const page = useLocation()
    const [location, setLocation] = useState('')
    const { user } = useAuthContext()

    const navItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: <RxDashboard size={18} /> },
        { label: 'User Management', path: '/admin/usermanagement', icon: <FaRegUser size={15}/> },
    ];

    useEffect(() => {
        if(page.pathname === "/admin/dashboard"){
          setLocation('Dashboard')
        }else if(page.pathname === "/admin/usermanagement"){
          setLocation('User Management')
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