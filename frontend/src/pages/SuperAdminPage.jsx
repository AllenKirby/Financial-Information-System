import Navbar from "../components/Navbar"
import Header from "../components/Header"

import { Outlet, useLocation } from "react-router-dom"
import { useEffect, useState } from "react";

import { PiUsersThreeBold } from "react-icons/pi";
import { TbUserShield } from "react-icons/tb";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { useSuperAdminHook } from "../hooks/useSuperAdminHook";
import { useDispatch } from "react-redux";

const SuperAdminPage = () => {
    const page = useLocation()
    const [location, setLocation] = useState('')
    const [navbarExpand, setNavbarExpand] = useState(true)
    const [navbarSize, setNavbarSize] = useState('')
    const [mainSize, setMainSize] = useState('')
    const { getRequest } = useSuperAdminHook()
    const dispatch = useDispatch()

    const navItems = [
      {label: 'User Management', path: '/superadmin/usermanagement', icon: <PiUsersThreeBold size={22} />},
      {label: 'Access Control', path: '/superadmin/accesscontrol', icon: <TbUserShield size={22} />},
      {label: 'Reset Password', path: '/superadmin/resetpasswordrequest', icon: <RiLockPasswordLine size={22} />}
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
      
  return (
    <main className="w-full h-screen flex bg-white">
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

export default SuperAdminPage