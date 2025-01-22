import { Outlet, useLocation } from "react-router-dom";
//import {io} from 'socket.io-client'
import { useDisbursementContext } from '../hooks/useDisbursementContext'
import { useEffect, useState } from "react";
import { firestore } from "../config/firebase-config"
import { doc, onSnapshot } from "firebase/firestore"
import {useDispatch, useSelector} from 'react-redux'
import {setPermission} from '../redux/PermissionRedux' 
import { useFundingHook } from "../hooks/useFundingHook";

//Components
import Navbar from "../components/Shared/Navbar"
import Header from "../components/Shared/Header";

//Icons
import { TbLayoutDashboard} from "react-icons/tb";
import { FiBook} from "react-icons/fi";
import { MdOutlineHistory } from "react-icons/md";
import { FaRegFile } from "react-icons/fa";

import { initializeSocket } from "../socketService/socketService";



const EditorPage = () => {
  const page = useLocation()
  const [location, setLocation] = useState('')
  const [navbarExpand, setNavbarExpand] = useState(true)
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const { dispatch: dispatchContext } = useDisbursementContext()
  const dispatch = useDispatch()
  const apiURL = import.meta.env.VITE_API_URL
  const permission = useSelector((state) => state.permission)
  const { retrieveControlBooks } = useFundingHook()
  

  const navItems = [
    { label: 'Dashboard', path: '/editor/dashboard', icon: <TbLayoutDashboard size={22} /> },
    { label: 'Records', path: '/editor/disbursementrecords', icon: <FaRegFile size={20} /> } ,
    ...(permission?.data?.permission 
      ? [{ label: 'Control Book', path: '/editor/controlbook', icon: <FiBook size={20} /> }] 
      : []),
    { label: 'Logs', path: '/editor/disbursementlogs', icon: <MdOutlineHistory size={22} /> }
  ];

  useEffect(() => {
    if(page.pathname === "/editor/disbursementrecords"){
      setLocation('Records')
    } else if(page.pathname === "/editor/dashboard"){
      setLocation('Dashboard')
    } else if(page.pathname === "/editor/controlbook"){
      setLocation('Control Book')
    } else if(page.pathname === "/editor/disbursementlogs"){
      setLocation('Logs')
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
      socket.on('editorPermission:firestore:update', (doc) => {
        dispatch(setPermission(doc));
      })
      // socket.on('editor:firestore:records', (doc) => {
      //   console.log(doc)
      // })

      const fetchInitialDocuments = () => {
        socket.emit('editor:fetch:initial', (err, documents) => {
          if (err) {
            console.error('Error fetching initial documents:', err);
          } else {
            console.log('Fetched initial documents:', documents);
            
          }
        });
      };

      const fetchNextDocuments = () => {
        socket.emit('editor:fetch:next', (err, documents) => {
          if (err) {
            console.error('Error fetching next documents:', err);
          } else {
            console.log('Fetched next documents:', documents);
            
          }
        });
      };

      fetchInitialDocuments()
      fetchNextDocuments()
      return () => {
        socket.off('editor:firestore:update');
        socket.off('editorPermission:firestore:update');
        socket.off('editor:firestore:records')
      };
    }
  }, [])

  // useEffect(() => {
  //   const docRef = doc(firestore, 'Roles', 'Preparer'); 
  //   const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
  //   if (docSnapshot.exists()) {
  //     const documentData = { data: { ...docSnapshot.data() } };

  //     dispatch(setPermission(documentData));
  //   } else {
  //     console.log('No such document!');
  //   }
  // });

  //   return () => unsubscribe()   
  // }, [dispatch, apiURL])

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
            <Navbar items={navItems} flag={navbarExpand} sidebarMobile={collapseMobileSidebar}/>
          </div>
        </aside>
      )}
      <aside className={`${navbarExpand ? 'absolute lg:relative hidden lg:w-1/6' : 'w-[78px]'} hidden lg:block h-full transition-all duration-100`}>
        <Navbar items={navItems} flag={navbarExpand} sidebar={collapseSideBar}/>
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

export default EditorPage