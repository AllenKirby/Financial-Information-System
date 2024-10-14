import { Outlet, useLocation } from "react-router-dom";
import { useDisbursementContext } from '../hooks/useDisbursementContext'
import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "axios";
import { firestore } from "../config/firebase-config"
import { collection, query, onSnapshot, where } from "firebase/firestore"

//Components
import Navbar from "../components/Navbar"
import Header from "../components/Header";

//Icons
import { CiViewList } from "react-icons/ci";


const EditorPage = () => {
  const page = useLocation()
  const [location, setLocation] = useState('')
  const { user } = useAuthContext()
  const { dispatch, documents } = useDisbursementContext()
  const prevDocumentsRef = useRef();
  
  const navItems = [
    { label: 'Disbursement Records', path: '/editor/disbursementrecords', icon: <CiViewList size={18} /> } 
  ];

  useEffect(() => {
    if(page.pathname === "/editor/disbursementrecords"){
      setLocation('Disbursement Records')
    }
  }, [page.pathname])


  useEffect(() => {
    const retrieveDV = async() => {
        if(!documents){
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
          }catch(error){
          console.log(error)
        }
      }
    }

    if(user){
      retrieveDV()
    }

    const q = query(collection(firestore, 'records'), where('status', 'in', ['Drafting', 'Returned|4']));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedDocuments = snapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = {...doc.data()}
        return acc;
      }, {});

      console.log(updatedDocuments);
      dispatch({ type: 'SET_DOCUMENTS', payload: updatedDocuments });
    })

    return () => unsubscribe()   
  }, [dispatch])

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