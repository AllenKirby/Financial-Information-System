import Navbar from "../components/Navbar"
import Header from "../components/Header"

import { Outlet, useLocation } from "react-router-dom"
import { useEffect, useState } from "react";

import { PiUsersThreeBold } from "react-icons/pi";
import { TbUserShield } from "react-icons/tb";

import { useSuperAdminHook } from "../hooks/useSuperAdminHook";
import { useDispatch } from "react-redux";

const SuperAdminPage = () => {
    const page = useLocation()
    const [location, setLocation] = useState('')
    const [navbarExpand, setNavbarExpand] = useState(true)
    const { getRequest } = useSuperAdminHook()
    const dispatch = useDispatch()

    const navItems = [
      {label: 'User Management', path: '/superadmin/usermanagement', icon: <PiUsersThreeBold size={20} />},
      {label: 'Access Control', path: '/superadmin/accesscontrol', icon: <TbUserShield size={22} />},
      {label: 'Logs', path: '/superadmin/logs', icon: <TbUserShield size={22} />}
    ]

    useEffect(() => {
      const getReq = async() => {
        const unsubscribe = await getRequest(dispatch)
        return () => unsubscribe
      }
      getReq()
    }, [])

    useEffect(() => {
        if(page.pathname === "/superadmin/usermanagement"){
          setLocation('User Management')
        } else if(page.pathname === "/superadmin/accesscontrol"){
          setLocation('Access Control')
        } else if(page.pathname === "/superadmin/resetpasswordrequest"){
          setLocation('Reset Password Requests')
        }else if(page.pathname === '/superadmin/logs'){
          setLocation('Access Logs')
        }
      }, [page.pathname])
      
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

export default SuperAdminPage