import Navbar from "../components/Navbar"
import Header from "../components/Header"
import { Outlet, useLocation } from "react-router-dom"
import { CiViewList } from "react-icons/ci"
import { LuLayoutDashboard } from "react-icons/lu";
import { useEffect, useState } from "react"
import { useAuthContext } from "../hooks/useAuthContext"
import axios from "axios"
import { useHeadDisbursementContext } from "../hooks/useHeadDisbursementContext"
import { firestore } from "../config/firebase-config"
import { collection, query, doc, where, onSnapshot } from "firebase/firestore"
import { useDispatch, useSelector } from 'react-redux'
import { setPermission } from "../redux/PermissionRedux" 

const HeadPage = () => {
    const page = useLocation()
    const [location, setLocation] = useState('')
    const { user } = useAuthContext() 
    const { dispatch: dispatchContext, documents } = useHeadDisbursementContext()
    const dispatch = useDispatch()
    const permission = useSelector((state) => state.permission)
    const [status, setStatus] = useState([])

    const navItems = [
      { label: 'Dashboard', path: '/head/dashboard', icon: <LuLayoutDashboard size={18} /> },
      { label: 'Disbursement Records', path: '/head/disbursementrecords', icon: <CiViewList size={18} /> }, 
    ]

    useEffect(() => {
        const getPermission = async() => {
          try{
            const res = await axios.get('http://localhost:4000/head/getPermission', {
              withCredentials: true
            })
            if(res.status === 200){
              const data = res.data
              dispatch(setPermission(data))
            }
          } catch(error) {
            console.log(error)
          }
        }
        getPermission()

        const docRef = doc(firestore, 'Roles', 'Budget Officer'); 
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
        if(page.pathname === "/head/disbursementrecords") {
          setLocation('Disbursement Records')
        }
    }, [page.pathname])

    useEffect(() => {
        console.log('Permission:', permission)
        if(permission?.data?.permission) {
          setStatus(['Approved', 'Under Review'])
        } else {
          setStatus(['Under Review'])
        }
    }, [permission])

    useEffect(() => {
        const retrieveDV = async() => {
            if(!documents) { 
              try {
                const res = await axios.get('http://localhost:4000/head/read_records', { flag: permission.data.permission },{
                  withCredentials: true
                })
                if(res.status === 200){
                  const docu = res.data
                  dispatchContext({type: 'SET_HEADDOCUMENTS', payload: docu})
                }
              } catch (error) {
                  console.log(error)
              }
            }
        }

        // if(user){
        //     retrieveDV()
        // }
        retrieveDV()

        if (!status.length) return;  

        const q = query(collection(firestore, 'records'), where('status', 'in', status));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const newDocuments = snapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = { data: { ...doc.data() } };
            return acc;
          }, {});
          dispatchContext({ type: 'SET_HEADDOCUMENTS', payload: newDocuments });
        })

        return () => unsubscribe()
    }, [user, dispatchContext, status, documents, permission?.data?.permission])

    return (
        <main className="h-screen w-full flex bg-slate-100">
            <aside className="h-full w-1/6 mr-3">
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

export default HeadPage
