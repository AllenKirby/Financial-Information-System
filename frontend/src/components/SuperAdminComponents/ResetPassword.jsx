import { useSelector } from "react-redux"

import { IoSearchSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import { firestore } from "../../config/firebase-config"
import { collection, query, onSnapshot } from "firebase/firestore"
import ProfileModal from "./ProfileModal";

const ResetPassword = () => {
  const requests = useSelector((state) => state.request)
  const [existingUsers, setExistingUsers] = useState({})
  const [email, setEmail] = useState('')
  console.log(requests)

  useEffect(() => {
    const q = query(collection(firestore, 'listOfUsers'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
        const users = snapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = {...doc.data()}
            return acc;
        }, {});
            console.log(users)
            setExistingUsers(users)
        })

        return () => unsubscribe()  
  }, [])

  const modal = (e) => {
    setEmail(e)
  }

  return (
    <div className="w-full h-full p-3">
      <div className="w-full h-[10%] flex items-center justify-end">
        <div className='relative'>
            <IoSearchSharp size={20} className='absolute top-[12px] left-4 text-gray-400' />
            <input 
              type="search"
              placeholder='Search Email'
              className='py-2 pr-3 pl-10 text-sm rounded-2xl focus:outline-none border-2' />
          </div>
      </div>
      <div className="w-full h-[90%] flex tems-center justify-center">
        <div className="w-2/3 h-full rounded-lg border-2">
          <div className="w-full flex items-center justify-center py-1 bg-gray-200">
            <p className="w-1/2 font-semibold text-left px-3">Email</p>
            <p className="w-1/2 font-semibold text-center">Time Requested</p>
          </div>
          <div className="w-full h-[420px] p-1">
            {Object.entries(requests).length > 0 ? (
              Object.entries(requests).map(([key, request], index) => (
                <button key={key} onClick={() => modal(`${request.email}|${key}`)} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} w-full px-2 my-1 py-2 rounded-lg flex items-center justify-center`}>
                  <p className="w-1/2">{request.email}</p>
                  <p className="w-1/2 text-center">{request.requestedAt}</p>
                </button>
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="font-semibold text-lg">No Request Found</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {email && (
        <>
          <div className="fixed inset-0 z-20 bg-black opacity-50" />
          <div className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
            <ProfileModal modal={modal} email={email} existingEmails={existingUsers} />
          </div>
        </>
      )}
    </div>
  )
}

export default ResetPassword