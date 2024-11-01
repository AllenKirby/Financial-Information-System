import Navbar from "../components/Navbar"
import Header from "../components/Header"
import { Outlet, useLocation } from "react-router-dom"
import { TiDocumentText } from "react-icons/ti";
import { TbLayoutDashboard } from "react-icons/tb";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
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
  const [navbarExpand, setNavbarExpand] = useState(true)
  const [navbarSize, setNavbarSize] = useState('')
  const [mainSize, setMainSize] = useState('')
  const { user } = useAuthContext() 
  const { dispatch: dispatchContext, documents } = useHeadDisbursementContext()
  const dispatch = useDispatch()
  const permission = useSelector((state) => state.permission)
  const [status, setStatus] = useState([])
  const apiURL = import.meta.env.VITE_API_URL

  const navItems = [
    { label: 'Dashboard', path: '/head/dashboard', icon: <TbLayoutDashboard size={18} /> },
    { label: 'Disbursement Records', path: '/head/disbursementrecords', icon: <TiDocumentText size={18} /> }, 
  ]

  useEffect(() => {
      const getPermission = async() => {
        try{
          const res = await axios.get(`${apiURL}/head/getPermission`, {
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
  }, [dispatch, apiURL])

  useEffect(() => {
      if(page.pathname === "/head/disbursementrecords") {
        setLocation('Disbursement Records')
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
      console.log('Permission:', permission)
      if(permission?.data?.permission) {
        setStatus(['Approved', 'Under Review'])
      } else {
        setStatus(['Under Review'])
      }
  }, [permission])

  useEffect(() => {
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
  }, [user, dispatchContext, apiURL, status, documents, permission?.data?.permission])

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
          <section className="h-[87%] w-full pr-3">
              <Outlet/>
          </section>
      </section>
    </main>
  )
}

export default HeadPage
