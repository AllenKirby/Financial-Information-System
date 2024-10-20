import Navbar from "../components/Navbar"
import Header from "../components/Header"
import { Outlet, useLocation } from "react-router-dom"
import { CiViewList } from "react-icons/ci"
import { useEffect, useState } from "react"
import { useAuthContext } from "../hooks/useAuthContext"
import axios from "axios"
import { useHeadDisbursementContext } from "../hooks/useHeadDisbursementContext"
import { firestore } from "../config/firebase-config"
import { collection, query, where, onSnapshot } from "firebase/firestore"

const HeadPage = () => {
    const page = useLocation()
    const [location, setLocation] = useState('')
    const { user } = useAuthContext() 
    const { dispatch, documents } = useHeadDisbursementContext()


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
            if(!documents){ try {
                const res = await axios.get('http://localhost:4000/head/read_records', {
                    withCredentials: true
                })
                if(res.status === 200){
                    const docu = res.data
                    dispatch({type: 'SET_HEADDOCUMENTS', payload: docu})
                }
            } catch (error) {
                console.log(error)
            }}
        }
        if(user){
            retrieveDV()
        }

        const q = query(collection(firestore, 'records'), where('status', '==', 'Under Review'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
        const newDocuments = snapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = {data: {...doc.data()}};
            return acc;
        }, {});
        dispatch({ type: 'SET_HEADDOCUMENTS', payload: newDocuments });
        })

        return () => unsubscribe()
    }, [user, dispatch, documents])

  return (
    <main className="h-screen w-full flex bg-slate-100">
        <aside className="h-full w-1/6 mr-3">
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

export default HeadPage