import { Outlet, useLocation } from "react-router-dom";
import {io} from 'socket.io-client'
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
import { TbLayoutDashboard} from "react-icons/tb";
import { FiBook} from "react-icons/fi";
import { PiFileThin, PiTableThin } from "react-icons/pi";

import { getSocket, initializeSocket } from "../socketService/socketService";



const EditorPage = () => {
  const page = useLocation()
  const [location, setLocation] = useState('')
  const [navbarExpand, setNavbarExpand] = useState(true)
  const { dispatch: dispatchContext } = useDisbursementContext()
  const dispatch = useDispatch()
  const apiURL = import.meta.env.VITE_API_URL
  const permission = useSelector((state) => state.permission)
  const { retrieveControlBooks } = useFundingHook()
  

  const navItems = [
    { label: 'Dashboard', path: '/editor/dashboard', icon: <TbLayoutDashboard size={22} /> },
    { label: 'Disbursement Records', path: '/editor/disbursementrecords', icon: <PiFileThin size={22} /> } ,
    ...(permission?.data?.permission 
      ? [{ label: 'Control Book', path: '/editor/controlbook', icon: <FiBook size={20} /> }] 
      : []),
    { label: 'Disbursement Logs', path: '/editor/disbursementlogs', icon: <PiTableThin size={20} /> }
  ];

  useEffect(() => {
    if(page.pathname === "/editor/disbursementrecords"){
      setLocation('Disbursement Records')
    } else if(page.pathname === "/editor/dashboard"){
      setLocation('Dashboard')
    } else if(page.pathname === "/editor/controlbook"){
      setLocation('Control Book')
    } else if(page.pathname === "/editor/disbursementlogs"){
      setLocation('Disbursement Logs')
    }
  }, [page.pathname])

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

  // useEffect(() => {
  //   const status = permission?.data?.permission 
  //   ? ['Drafting', 'Returned|4', 'In Review', 'Returned|3'] 
  //   : ['Drafting', 'Returned|4'];

  //   const q = query(collection(firestore, 'records'),where('status', 'in', status ? status : ['Drafting', 'Returned|4'] ));
  //   const unsubscribe = onSnapshot(q, (snapshot) => {
  //     const updatedDocuments = snapshot.docs.reduce((acc, doc) => {
  //       acc[doc.id] = {...doc.data()}
  //       return acc;
  //     }, {});

  //     dispatchContext({ type: 'SET_DOCUMENTS', payload: updatedDocuments });
  //   })

  //   return () => unsubscribe()   
  // }, [dispatchContext, permission])

  useEffect(() => {
    const {socket, isInitialized} = initializeSocket()
    if(isInitialized){
      socket.on('editor:firestore:update', (doc) => {
        dispatchContext({ type: 'SET_DOCUMENTS', payload: doc });
      })
      return () => {
        socket.off('editor:firestore:update');
      };
    }
  }, [])

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

  const collapseSideBar = () => {
    setNavbarExpand(!navbarExpand)
  }

  return (
    <main className="relative h-screen w-full flex bg-coolSteel">
      {navbarExpand && (
        <aside className={`${navbarExpand ? 'w-full' : 'w-0'} z-30 block lg:hidden absolute top-0 left-0 h-full transition-all duration-100`}>
          <div className="relative w-3/4 h-full z-40">
            <Navbar items={navItems} flag={navbarExpand} sidebar={collapseSideBar}/>
          </div>
        </aside>
      )}
      <aside className={`${navbarExpand ? 'absolute lg:relative hidden lg:w-1/6' : 'w-[78px]'} hidden lg:block h-full transition-all duration-100`}>
        <Navbar items={navItems} flag={navbarExpand}/>
      </aside>
      <section className={`h-full ${navbarExpand ? 'w-full sm:w-full md:w-full lg:w-5/6 xl:w-5/6 2xl:w-5/6' : 'w-full'}`}>
        <section className="h-[8%] lg:h-[10%] w-full flex items-center justify-center border-b-2">
          <Header currentPage={location} sidebar={collapseSideBar}/>
        </section>
        <section className="h-[92%] lg:h-[90%] w-full flex">
            <Outlet/>
        </section>
      </section>
    </main>
  )
}

export default EditorPage