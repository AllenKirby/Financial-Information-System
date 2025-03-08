import { Outlet, useLocation } from "react-router-dom";
import { useFundingHook } from "../hooks/useFundingHook";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { firestore } from "../config/firebase-config";

import {useDispatch, useSelector} from 'react-redux'
import {setPermission} from '../redux/PermissionRedux'
import {setVouchers} from '../redux/AllVouchersRedux' 
import { setDVRecords } from '../redux/DVUsersRedux'
import { setBURs } from "../redux/BURRecordsRedux";

//Components
import Navbar from "../components/Shared/Navbar"
import Header from "../components/Shared/Header";

import { initializeSocket } from "../socketService/socketService";

const EditorPage = () => {
  const page = useLocation()
  const [location, setLocation] = useState('')
  const [navbarExpand, setNavbarExpand] = useState(true)
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const dispatch = useDispatch()
  //const apiURL = import.meta.env.VITE_API_URL
  const permission = useSelector((state) => state.permission)
  const { retrieveControlBooks } = useFundingHook()

  useEffect(() => {
    if(page.pathname === "/editor/records/disbursementrecords" || page.pathname === "/editor/records/payrollrecords" || page.pathname === "/editor/records/burrecords"){
      setLocation('Records')
    } else if(page.pathname === "/editor/dashboard"){
      setLocation('Dashboard')
    } else if(page.pathname === "/editor/controlbook"){
      setLocation('Control Book')
    } else if(page.pathname === "/editor/disbursementlogs"){
      setLocation('Logs')
    } else if(page.pathname === "/editor/dvregister"){
      setLocation('DV Register')
    }else if(page.pathname === "/editor/payroll-records"){
      setLocation('Payroll Records')
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

  useEffect(() => {
    if(permission?.data?.permission) {
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
    }
    }, []);

  useEffect(() => {
    const {socket, isInitialized} = initializeSocket()
    if(isInitialized){
      socket.on('editor:firestore:update', (doc) => {
        //dispatchContext({ type: 'SET_DOCUMENTS', payload: doc });
        dispatch(setDVRecords(doc))
      })
      socket.on('editorPermission:firestore:update', (doc) => {
        dispatch(setPermission(doc));
      })
      socket.on('editor:firestore:records', (doc) => {
        dispatch(setVouchers(doc))
      })

      // const fetchInitialDocuments = () => {
      //   socket.emit('editor:fetch:initial', (err, documents) => {
      //     if (err) {
      //       console.error('Error fetching initial documents:', err);
      //     } else {
      //       console.log('Fetched initial documents:', documents);
            
      //     }
      //   });
      // };

      // const fetchNextDocuments = () => {
      //   socket.emit('editor:fetch:next', (err, documents) => {
      //     if (err) {
      //       console.error('Error fetching next documents:', err);
      //     } else {
      //       console.log('Fetched next documents:', documents);
            
            
      //     }
      //   });
      // };

      // fetchInitialDocuments()
      // fetchNextDocuments()
      return () => {
        socket.off('editor:firestore:update');
        socket.off('editorPermission:firestore:update');
        socket.off('editor:firestore:records')
      };
    }
  }, [permission?.data?.permission])

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

export default EditorPage