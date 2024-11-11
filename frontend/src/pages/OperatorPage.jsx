import { Outlet, useLocation } from "react-router-dom"
import { useOpDisbursementContext } from '../hooks/useOpDisbursementContext'
import { firestore } from "../config/firebase-config"
import { collection, doc, query, where, onSnapshot } from "firebase/firestore"

import Navbar from "../components/Navbar"
import Header from "../components/Header"

import { TiDocumentText } from "react-icons/ti";
import { TbLayoutDashboard } from "react-icons/tb";
import { useState, useEffect } from "react"
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { FiBook } from "react-icons/fi";

import { useAuthContext } from "../hooks/useAuthContext";
import { useFundingHook } from "../hooks/useFundingHook"

import {useDispatch, useSelector} from 'react-redux'
import { setPermission } from '../redux/PermissionRedux'

const OperatorPage = () => {
  const page = useLocation()
  const [location, setLocation] = useState('')
  const [navbarExpand, setNavbarExpand] = useState(true)
  const [navbarSize, setNavbarSize] = useState('')
  const [mainSize, setMainSize] = useState('')
  const { user } = useAuthContext()
  const { dispatch: dispatchContext, documents } = useOpDisbursementContext()
  const { retrieveControlBooks } = useFundingHook()
  const [status, setStatus] = useState([])
  const dispatch = useDispatch()
  const permission = useSelector((state) => state.permission)
  const apiURL = import.meta.env.VITE_API_URL

  const navItems = [
    { label: 'Dashboard', path: '/operator/dashboard', icon: <TbLayoutDashboard size={22} /> },
    { label: 'Disbursement Records', path: '/operator/disbursementrecords', icon: <TiDocumentText size={22} /> },
    { label: 'Control Book', path: '/operator/controlbook', icon: <FiBook size={20 } /> }
  ]

  useEffect(() => {
    if(page.pathname === "/operator/disbursementrecords"){
      setLocation('Disbursement Records')
    }else if(page.pathname === "/operator/dashboard"){
      setLocation('Dashboard')
    }else if(page.pathname === "/operator/controlbook"){
      setLocation('Control Book')
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
    const unsubscribe = retrieveControlBooks(dispatch)
    return () => unsubscribe;
  }, []) 

  useEffect(() => {
    const docRef = doc(firestore, 'Roles', 'Funding'); 
    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const documentData = { data: { ...docSnapshot.data() } };

      dispatch(setPermission(documentData));
    } else {
      console.log('No such document!');
    }
    });

    return () => unsubscribe()   
  }, [dispatch])

  useEffect(() => {
    if(permission?.data?.permission){
      setStatus(['Drafting', 'In Review', 'Returned|3', 'Returned|4'])
    }
    else{
      setStatus(['In Review', 'Returned|3'])
    }
  }, [permission])

  useEffect(() => {
    if (!status.length) return;  
    const q = query(collection(firestore, 'records'), where('status', 'in', status));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newDocuments = {documents: snapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = {data: {...doc.data()}};
        return acc;
      }, {})};
      
      dispatchContext({type: 'SET_OPDOCUMENTS', payload: newDocuments})
    })

    return () => unsubscribe()

  }, [user, dispatchContext, apiURL, documents, permission?.data?.permission, status])
  // permission.data.permission 


  return (
    <main className="w-full h-screen flex bg-white">
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
          <section className="h-[87%] w-full pr-3">
              <Outlet/>
          </section>
      </section>
    </main>
  )
}

export default OperatorPage