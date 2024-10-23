import { Outlet, useLocation } from "react-router-dom"
import { useOpDisbursementContext } from '../hooks/useOpDisbursementContext'
import { firestore } from "../config/firebase-config"
import { collection, doc, query, where, onSnapshot } from "firebase/firestore"

import Navbar from "../components/Navbar"
import Header from "../components/Header"

import { CiViewList } from "react-icons/ci"
import { useState, useEffect } from "react"
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "axios"
import {useDispatch, useSelector} from 'react-redux'
import { setPermission } from '../redux/PermissionRedux'

const OperatorPage = () => {
  const page = useLocation()
  const [location, setLocation] = useState('')
  const { user } = useAuthContext()
  const { dispatch: dispatchContext, documents } = useOpDisbursementContext()
  const [status, setStatus] = useState([])
  const dispatch = useDispatch()
  const permission = useSelector((state) => state.permission)

  const navItems = [
    { label: 'Disbursement Records', path: '/operator/disbursementrecords', icon: <CiViewList size={18} /> },
  ]

  useEffect(() => {
    if(page.pathname === "/operator/disbursementrecords"){
      setLocation('Disbursement Records')
    }
  }, [page.pathname])

  useEffect(() => {
    const getPermission = async() => {
      try {
        const res = await axios.get('http://localhost:4000/operator/getPermission', {
          withCredentials: true
        })
        if(res.status === 200){
          const data = res.data
          console.log(data)
          dispatch(setPermission(data))
        }
      } catch (error) {
        console.log(error)
      }
    }
    getPermission()

    const docRef = doc(firestore, 'Roles', 'Funding'); 
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

  useEffect(() => {
    if(permission && permission.data.permission){
      console.log('yes hit')
      setStatus(['Drafting', 'In Review', 'Returned|3', 'Returned|4'])
    }
    else{
      console.log('no hit')
      setStatus(['In Review', 'Returned|3'])
    }
  }, [permission])

  useEffect(() => {
    const retriveData = async() => {
      if(documents){
        console.log('Disbursement Records has been retrieved')
        console.log(documents)
      }else{
        try{
          console.log('fetching...')
          const getDocu = await axios.get('http://localhost:4000/operator/read_records', {flag: permission.data.permission}, {
            withCredentials: true
          });
          if(getDocu.status === 200){
            const documents = getDocu.data
            dispatchContext({type: 'SET_OPDOCUMENTS', payload: documents})
          }
        }catch(error){
          console.log(`fetching docu in op: ${error}`)
        }
      }
    };
    retriveData();

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
  }, [user, dispatchContext, documents, status])
  // permission.data.permission 

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