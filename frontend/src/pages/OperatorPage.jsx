import { Outlet, useLocation } from "react-router-dom"
import { useOpDisbursementContext } from '../hooks/useOpDisbursementContext'

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
            console.log(`from set op docu ${documents}`)
            dispatch({type: 'SET_OPDOCUMENTS', payload: documents})
          }
        }catch(error){
          console.log(`fetching docu in op: ${error}`)
        }
      }
    };
    retriveData();
  }, [user, dispatch, documents])

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