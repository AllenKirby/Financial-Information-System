import { Outlet, useLocation } from "react-router-dom";
import { useDisbursementContext } from '../hooks/useDisbursementContext'

//Components
import Navbar from "../components/Navbar"
import Header from "../components/Header";

//Icons
import { IoDocumentOutline } from "react-icons/io5";
import { CiViewList } from "react-icons/ci";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "axios";

const EditorPage = () => {
  const page = useLocation()
  const [location, setLocation] = useState('')
  const { user } = useAuthContext()
  const { dispatch, documents } = useDisbursementContext()
  
  const navItems = [
    { label: 'Disbursement Records', path: '/editor/disbursementrecords', icon: <CiViewList size={18} /> },
    { label: 'Disbursement Voucher', path: '/editor/disbursementvoucher', icon: <IoDocumentOutline size={18} /> }
  ];

  useEffect(() => {
    if(page.pathname === "/editor/disbursementvoucher"){
      setLocation('Disbursement Voucher')
    }else if(page.pathname === "/editor/disbursementrecords"){
      setLocation('Disbursement Records')
    }
  }, [page.pathname])


  useEffect(() => {
    const retrieveDV = async() => {
      if(documents){
        console.log('Disbursement Records has been retrieved')
        
      }else{
        try{
          console.log('start')
          const getDocu = await axios.get('http://localhost:4000/editor/getDV', {
            withCredentials: true
          })
          
          if(getDocu.status === 200){
            const documents = getDocu.data
            console.log('end')
            console.log(documents)
            dispatch({type: 'SET_DOCUMENTS', payload: documents})
          }
        }
        catch(error){
          console.log(error)
        }
      }
    }

    if(user){
      retrieveDV()
    }
  }, [user, dispatch, documents])

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

export default EditorPage