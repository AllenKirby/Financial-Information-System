import { Outlet, useLocation } from "react-router-dom";

//Components
import Navbar from "../components/Navbar"
import Header from "../components/Header";

//Icons
import { IoDocumentOutline } from "react-icons/io5";
import { CiViewList } from "react-icons/ci";
import { useEffect, useState } from "react";

const EditorPage = () => {
  const page = useLocation()
  const [location, setLocation] = useState('')
  
  const navItems = [
    { label: 'Disbursement Voucher', path: '/editor/disbursementvoucher', icon: <IoDocumentOutline size={18} /> },
    { label: 'Disbursement Records', path: '/editor/disbursementrecords', icon: <CiViewList size={18} /> }
  ];
  useEffect(() => {
    if(page.pathname === "/editor/disbursementvoucher"){
      setLocation('Disbursement Voucher')
    }else if(page.pathname === "/editor/disbursementrecords"){
      setLocation('Disbursement Records')
    }
  }, [page.pathname])

  return (
    <main className="h-screen w-full flex bg-gray-100 p-3">
      <aside className="h-full w-1/6 mr-3">
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

export default EditorPage