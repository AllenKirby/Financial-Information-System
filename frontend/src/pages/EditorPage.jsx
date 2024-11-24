import { Outlet, useLocation } from "react-router-dom";
import { useDisbursementContext } from '../hooks/useDisbursementContext'
import { useEffect, useState } from "react";
import { firestore } from "../config/firebase-config"
import { collection, query, doc, onSnapshot, where } from "firebase/firestore"
import {useDispatch, useSelector} from 'react-redux'
import {setPermission} from '../redux/PermissionRedux' 
import { useFundingHook } from "../hooks/useFundingHook";

//Components
import Navbar from "../components/Navbar"
import Header from "../components/Header";

//Icons
import { TiDocumentText } from "react-icons/ti";
import { TbLayoutDashboard} from "react-icons/tb";
import { BsTable } from "react-icons/bs";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { FiBook, FiUser } from "react-icons/fi";

const EditorPage = () => {
  const page = useLocation()
  const [location, setLocation] = useState('')
  const [navbarExpand, setNavbarExpand] = useState(true)
  const [navbarSize, setNavbarSize] = useState('')
  const [mainSize, setMainSize] = useState('')
  const { dispatch: dispatchContext } = useDisbursementContext()
  const dispatch = useDispatch()
  const apiURL = import.meta.env.VITE_API_URL
  const permission = useSelector((state) => state.permission)
  const { retrieveControlBooks } = useFundingHook()

  const navItems = [
    { label: 'Dashboard', path: '/editor/dashboard', icon: <TbLayoutDashboard size={22} /> },
    { label: 'Disbursement Records', path: '/editor/disbursementrecords', icon: <TiDocumentText size={22} /> } ,
    ...(permission?.data?.permission 
      ? [{ label: 'Control Book', path: '/editor/controlbook', icon: <FiBook size={20} /> }] 
      : []),
    { label: 'Disbursement Logs', path: '/editor/disbursementlogs', icon: <BsTable size={18} /> },
    { label: 'Profile', path: '/editor/profile', icon: <FiUser size={22} /> }
  ];

  useEffect(() => {
    if(page.pathname === "/editor/disbursementrecords"){
      setLocation('Disbursement Records')
    } else if(page.pathname === "/editor/dashboard"){
      setLocation('Dashboard')
    } else if(page.pathname === "/editor/controlbook"){
      setLocation('Control Book')
    } else if(page.pathname === "/editor/profile"){
      setLocation('Profile')
    } else if(page.pathname === "/editor/disbursementlogs"){
      setLocation('Disbursement Logs')
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
    const fetch = async() => {
      console.log('start getting control books')
      const unsubscribe = retrieveControlBooks(dispatch)
      return () => unsubscribe;
    }
    if(permission?.data?.permission) {
      fetch()
    }
  }, [permission]) 

  useEffect(() => {
    const status = permission?.data?.permission 
    ? ['Drafting', 'Returned|4', 'In Review', 'Returned|3'] 
    : ['Drafting', 'Returned|4'];

    const q = query(collection(firestore, 'records'),where('status', 'in', status ? status : ['Drafting', 'Returned|4'] ));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedDocuments = snapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = {...doc.data()}
        return acc;
      }, {});

      dispatchContext({ type: 'SET_DOCUMENTS', payload: updatedDocuments });
    })

    return () => unsubscribe()   
  }, [dispatchContext, permission])

  useEffect(() => {
    const docRef = doc(firestore, 'Roles', 'Preparer'); 
    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const documentData = { data: { ...docSnapshot.data() } };

      dispatch(setPermission(documentData));
    } else {
      console.log('No such document!');
    }
  });

    return () => unsubscribe()   
  }, [dispatch, apiURL])

  return (
    <main className="h-screen w-full flex bg-coolSteel">
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