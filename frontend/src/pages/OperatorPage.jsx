import Navbar from "../components/Navbar"
import Header from "../components/Header"
import { Outlet, useLocation } from "react-router-dom"
import { CiViewList } from "react-icons/ci"
import { useState, useEffect } from "react"

const OperatorPage = () => {
  const page = useLocation()
  const [location, setLocation] = useState('')

  const navItems = [
    { label: 'Disbursement Records', path: '/editor/disbursementrecords', icon: <CiViewList size={18} /> },
  ]

  useEffect(() => {
    if(page.pathname === "/operator/disbursementrecords"){
      setLocation('Disbursement Records')
    }
  }, [page.pathname])

  return (
    <main className="w-full h-screen flex p-3 bg-gray-100">
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

export default OperatorPage