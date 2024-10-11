import Navbar from "../components/Navbar"
import Header from "../components/Header"
import { Outlet, useLocation } from "react-router-dom"
import { CiViewList } from "react-icons/ci"
import { useEffect, useState } from "react"
import { useAuthContext } from "../hooks/useAuthContext"
import axios from "axios"
import { useHeadDisbursementContext } from "../hooks/useHeadDisbursementContext"

const HeadPage = () => {
    const page = useLocation()
    const [location, setLocation] = useState('')
    const { user } = useAuthContext() 
    const { dispatch, HeadDocuments } = useHeadDisbursementContext()


    const navItems = [
        { label: 'Disbursement Records', path: '/head/disbursementrecords', icon: <CiViewList size={18} /> } 
    ]

    useEffect(() => {
        if(page.pathname === "/head/disbursementrecords"){
          setLocation('Disbursement Records')
        }
      }, [page.pathname])

    useEffect(() => {
        const retrieveDV = async() => {
            try {
                const res = await axios.get('http://localhost:4000/head/read_records', {
                    withCredentials: true
                })
                if(res.status === 200){
                    const docu = res.data
                    console.log(docu)
                    dispatch({type: 'SET_HEADDOCUMENTS', payload: docu})
                }
            } catch (error) {
                console.log(error)
            }
        }
        if(user){
            if(!HeadDocuments){
                retrieveDV()
            }
            else {
                console.log('Head Documents has been retrieved')
            }
        }
    }, [user, dispatch, HeadDocuments])

  return (
    <main className="h-screen w-full flex bg-gray-100 p-3">
        <aside className="h-full w-1/6 mr-3">
          <Navbar items={navItems}/>
      </aside>
      <section className="h-full w-5/6 ml-3">
          <section className="h-1/6 w-full">
              <Header currentPage={location}/>
          </section>
          <section className="h-5/6 w-full flex">
              <Outlet/>
          </section>
      </section>
    </main>
  )
}

export default HeadPage