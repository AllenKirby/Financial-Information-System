import { Outlet, useLocation } from "react-router-dom"
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { firestore } from "../config/firebase-config";

import Navbar from "../components/Shared/Navbar"
import Header from "../components/Shared/Header"

import { useState, useEffect } from "react"

import { useFundingHook } from "../hooks/useFundingHook"

import {useDispatch} from 'react-redux'
import { setPermission } from '../redux/PermissionRedux'
import { setDVRecords } from '../redux/DVUsersRedux'
import { setVouchers } from "../redux/AllVouchersRedux";

import {initializeSocket } from "../socketService/socketService";
import { setBURs } from "../redux/BURRecordsRedux";

const OperatorPage = () => {
  const page = useLocation()
  const [location, setLocation] = useState('')
  const [navbarExpand, setNavbarExpand] = useState(true)
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const { retrieveControlBooks } = useFundingHook()
  // const [status, setStatus] = useState([])
  const dispatch = useDispatch()
  //const permission = useSelector((state) => state.permission)
  //const apiURL = import.meta.env.VITE_API_URL
  //const cb = useSelector((state) => state.controlBook)

  useEffect(() => {
    if(page.pathname === "/operator/records/disbursementrecords" || page.pathname === "/operator/records/burrecords" || page.pathname === "/operator/records/payrollrecords"){
      setLocation('Records')
    }else if(page.pathname === "/operator/dashboard"){
      setLocation('Dashboard')
    }else if(page.pathname === "/operator/controlbook"){
      setLocation('Control Book')
    } else if(page.pathname === "/operator/disbursementlogs"){
      setLocation('Logs')
    } else if(page.pathname === "/operator/dvregister"){
      setLocation('DV Register')
    }else if(page.pathname === "/operator/payroll-records"){
      setLocation('Payroll Records')
    }
  }, [page.pathname])

  useEffect(() => {
    const unsubscribe = retrieveControlBooks(dispatch)
    return () => {
      if(unsubscribe){
        unsubscribe()
      }
    }
  }, []) 

  useEffect(() => {
    const collectionRef = collection(firestore, 'BURRecords');
    const q = query(collectionRef, where("status", "in", ["Drafting", "Returned|3"]));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const documents = snapshot.docs.map(doc => ({
        id: doc.id, 
        ...doc.data()
      }));
      dispatch(setBURs(documents));
    });
  
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const {socket, isInitialized} = initializeSocket()
      if(isInitialized){
        socket.on('operator:firestore:update', (doc) => {
          //dispatchContext({type: 'SET_OPDOCUMENTS', payload: doc})
          dispatch(setDVRecords(doc))
        })
        socket.on('operatorPermission:firestore:update', (doc) => {
          dispatch(setPermission(doc));
        })
        socket.on('operator:firestore:records', (doc) => {
          dispatch(setVouchers(doc))
        })
        return () => {
          socket.off('operator:firestore:update');
          socket.off('operatorPermission:firestore:update');
          // socket.off('operator:firestore:records')
          
        };
      }
  }, []) //[user, dispatchContext, apiURL, documents, permission?.data?.permission]

  const collapseSideBar = () => {
    setNavbarExpand(!navbarExpand)
  }

  const collapseMobileSidebar = () => {
    setMobileSidebar(!mobileSidebar)
  }

  return (
    <main className="relative h-screen w-full flex bg-white">
      {mobileSidebar && (
        <aside className={`${mobileSidebar ? 'w-full' : 'w-0'} z-30 block lg:hidden absolute top-0 left-0 h-full transition-all duration-100`}>
          <div className="relative w-3/4 h-full z-40 bg-white">
            <Navbar flag={navbarExpand} sidebarMobile={collapseMobileSidebar}/>
          </div>
        </aside>
      )}
      <aside className={`${navbarExpand ? 'absolute lg:relative hidden lg:w-1/6' : 'w-[78px]'} hidden lg:block h-full transition-all duration-100`}>
        <Navbar flag={navbarExpand} sidebar={collapseSideBar}/>
      </aside>
      <section className={`h-full ${navbarExpand ? 'w-full sm:w-full md:w-full lg:w-5/6 xl:w-5/6 2xl:w-5/6' : 'w-full'}`}>
        <section className="h-[8%] lg:h-[10%] w-full flex items-center justify-center border-b-2">
          <Header currentPage={location} sidebar={collapseMobileSidebar}/>
        </section>
        <section className="h-[92%] lg:h-[90%] w-full flex">
            <Outlet/>
        </section>
      </section>
    </main>
  )
}

export default OperatorPage