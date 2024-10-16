import Navbar from "../components/Navbar"
import Header from "../components/Header"

import { Outlet, useLocation } from "react-router-dom"
import { useEffect, useState } from "react";

import { PiUsersThree } from "react-icons/pi";

const SuperAdminPage = () => {
    const page = useLocation()
    const [location, setLocation] = useState('')

    const navItems = [
        {label: 'User Management', path: '/superadmin/usermanagement', icon: <PiUsersThree size={18} />}
    ]

    useEffect(() => {
        if(page.pathname === "/superadmin/usermanagement"){
          setLocation('User Management')
        }
      }, [page.pathname])
  return (
    <main className="w-full h-screen flex bg-slate-100">
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

export default SuperAdminPage