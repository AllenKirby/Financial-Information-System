import { Outlet, useLocation } from "react-router-dom";
import { useDisbursementContext } from '../hooks/useDisbursementContext'
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "axios";
import { firestore } from "../config/firebase-config"
import { collection, query, doc, onSnapshot, where } from "firebase/firestore"
import {useDispatch} from 'react-redux'
import {setPermission} from '../redux/PermissionRedux' 

//Components
import Navbar from "../components/Navbar"
import Header from "../components/Header";

//Icons
import { CiViewList } from "react-icons/ci";
import { LuLayoutDashboard } from "react-icons/lu";


const EditorPage = () => {
  const page = useLocation()
  const [location, setLocation] = useState('')
  const { user } = useAuthContext()
  const { dispatch: dispatchContext, documents } = useDisbursementContext()
  //const prevDocumentsRef = useRef();
  const dispatch = useDispatch()
  const apiURL = import.meta.env.VITE_API_URL
  
  const navItems = [
    { label: 'Dashboard', path: '/editor/dashboard', icon: <LuLayoutDashboard size={18} /> },
    { label: 'Disbursement Records', path: '/editor/disbursementrecords', icon: <CiViewList size={18} /> } 
  ];

  useEffect(() => {
    if(page.pathname === "/editor/disbursementrecords"){
      setLocation('Disbursement Records')
    }else if(page.pathname === "/editor/dashboard"){
      setLocation('Dashboard')
    }
  }, [page.pathname])


  useEffect(() => {
    const retrieveDV = async() => {
        if(!documents){
          try{
            const getDocu = await axios.get(`${apiURL}/editor/getDV`, {
              withCredentials: true
            })
            
            if(getDocu.status === 200){
              const documents = getDocu.data
              dispatchContext({type: 'SET_DOCUMENTS', payload: documents})
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

      dispatchContext({ type: 'SET_DOCUMENTS', payload: updatedDocuments });
    })

    return () => unsubscribe()   
  }, [dispatchContext])

  useEffect(() => {
    const getPermission = async() => {
      try{
        const res = await axios.get(`${apiURL}/editor/getPermission`, {
          withCredentials: true
        })
        if(res.status === 200){
          const data = res.data
          console.log(data)
          dispatch(setPermission(data))
        }
      }catch(error){
        console.log(error)
      }
    }
    getPermission()

    const docRef = doc(firestore, 'Roles', 'Preparer'); 
    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const documentData = { data: { ...docSnapshot.data() } };

      console.log('Document Data:', documentData);

      dispatch(setPermission(documentData));
    } else {
      console.log('No such document!');
    }
  });

    return () => unsubscribe()   
  }, [dispatch])

  return (
    <main className="h-screen w-full flex bg-slate-100">
      <aside className="h-full w-1/6">
          <Navbar items={navItems}/>
      </aside>
      <section className="h-full w-5/6 ml-3">
          <section className="h-[13%] w-full">
              <Header currentPage={location}/>
          </section>
          <section className="h-[87%] w-full flex pr-3">
              <Outlet/>
          </section>
      </section>
    </main>
  )
}

export default EditorPage