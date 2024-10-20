import { Outlet, useLocation } from "react-router-dom"
import { useOpDisbursementContext } from '../hooks/useOpDisbursementContext'
import { firestore } from "../config/firebase-config"
import { collection, query, where, onSnapshot } from "firebase/firestore"

import Navbar from "../components/Navbar"
import Header from "../components/Header"

import { CiViewList } from "react-icons/ci"
import { useState, useEffect } from "react"
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "axios"

const OperatorPage = () => {
  const page = useLocation()
  const [location, setLocation] = useState('')
  const { user } = useAuthContext()
  const { dispatch, documents } = useOpDisbursementContext()

  const navItems = [
    { label: 'Disbursement Records', path: '/operator/disbursementrecords', icon: <CiViewList size={18} /> },
  ]

  useEffect(() => {
    if(page.pathname === "/operator/disbursementrecords"){
      setLocation('Disbursement Records')
    }
  }, [page.pathname])


  useEffect(() => {
    const retriveData = async() => {
      if(documents){
        console.log('Disbursement Records has been retrieved')
        console.log(documents)
      }else{
        try{
          console.log('fetching...')
          const getDocu = await axios.get('http://localhost:4000/operator/read_records', {
            withCredentials: true
          });
          if(getDocu.status === 200){
            const documents = getDocu.data
            dispatch({type: 'SET_OPDOCUMENTS', payload: documents})
          }
        }catch(error){
          console.log(`fetching docu in op: ${error}`)
        }
      }
    };
    retriveData();

    const q = query(collection(firestore, 'records'), where('status', 'in', ['In Review', 'Returned|3']));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newDocuments = {documents: snapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = {data: {...doc.data()}};
        return acc;
      }, {})};
      
      dispatch({type: 'SET_OPDOCUMENTS', payload: newDocuments})
    })

    return () => unsubscribe()
  }, [user, dispatch, documents])

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

export default OperatorPage