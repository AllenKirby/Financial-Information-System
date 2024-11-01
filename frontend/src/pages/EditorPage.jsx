import { Outlet, useLocation } from "react-router-dom";
import { useDisbursementContext } from '../hooks/useDisbursementContext'
import { useEffect, useState } from "react";
import axios from "axios";
import { firestore } from "../config/firebase-config"
import { collection, query, doc, onSnapshot, where } from "firebase/firestore"
import {useDispatch} from 'react-redux'
import {setPermission} from '../redux/PermissionRedux' 

//Components
import Navbar from "../components/Navbar"
import Header from "../components/Header";

//Icons
import { TiDocumentText } from "react-icons/ti";
import { TbLayoutDashboard } from "react-icons/tb";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";


const EditorPage = () => {
  const page = useLocation()
  const [location, setLocation] = useState('')
  const [navbarExpand, setNavbarExpand] = useState(true)
  const [navbarSize, setNavbarSize] = useState('')
  const [mainSize, setMainSize] = useState('')
  const { dispatch: dispatchContext } = useDisbursementContext()
  const dispatch = useDispatch()
  const apiURL = import.meta.env.VITE_API_URL
  
  const navItems = [
    { label: 'Dashboard', path: '/editor/dashboard', icon: <TbLayoutDashboard size={18} /> },
    { label: 'Disbursement Records', path: '/editor/disbursementrecords', icon: <TiDocumentText size={18} /> } 
  ];

  useEffect(() => {
    if(page.pathname === "/editor/disbursementrecords"){
      setLocation('Disbursement Records')
    }else if(page.pathname === "/editor/dashboard"){
      setLocation('Dashboard')
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

  useEffect(() => {
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
  }, [dispatch, apiURL])

  return (
    <main className="h-screen w-full flex bg-white">
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
        <section className="h-[87%] w-full flex pr-3">
            <Outlet/>
        </section>
      </section>
    </main>
  )
}

export default EditorPage