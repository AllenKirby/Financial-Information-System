import { useState } from "react"
import { useSelector } from 'react-redux'
import { Outlet, useParams } from "react-router-dom"

import AddControlBook from "./AddControlBook"
import Folder from "./Folder"
import {useAuthContext} from '../../hooks/useAuthContext'


import { IoAdd } from "react-icons/io5";

const ControlBook = () => {
  const [controlBookFlag, setControlBookFlag] = useState(false)
  const [CBStatus, setCBStatus] = useState('active')

  const controlBooks = useSelector((state) => state.controlBook)
  const { user } = useAuthContext()


  const { id } = useParams()

  const modal = () => setControlBookFlag(!controlBookFlag)

  return (
    <section className="w-full h-full p-2 flex flex-col text-gray-500">
      {!id ? (
        <>
          <div className="w-full h-auto flex items-end justify-between py-2">
            <p className="font-semibold">Control Books({controlBooks ? Object.entries(controlBooks).length : 0})</p>
            <div className="flex space-x-2">
              <select
              onChange={(e) => setCBStatus(e.target.value)} 
              className="px-3 py-2 border rounded-lg bg-white text-gray-700 shadow-sm">
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
                <option value="ended">Ended</option>
              </select>
              <button 
                onClick={modal}
                className={`${user?.role === '3' ? 'bg-fundingBlueGreen' : 'bg-preparerPrimary'} px-3 py-2 rounded-lg text-white flex items-center justify-center gap-2`}
                > <IoAdd/> <span className="hidden sm:block">New</span>
              </button>
            </div>
          </div>
          <div className="relative p-2 w-full flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 border-2 rounded-lg overflow-y-auto">
            {controlBooks && Object.entries(controlBooks).length > 0 ? (
              Object.entries(controlBooks)
              .filter(([, controlBook]) => controlBook.cbStatus === CBStatus)
              .map(([key, controlBook]) => (
                <Folder key={key} ASANo={key} controlBook={controlBook}/>
              ))
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-xl font-semibold">No Control Books Found</p>
              </div>
            )}
          </div>
          {controlBookFlag && (
            <>
              <div 
                className="fixed inset-0 z-40 bg-black opacity-50" 
                onClick={modal} 
              />
              <div className="fixed z-50 left-0 top-0 w-full h-full flex items-center justify-center">
                <AddControlBook modal={modal} flag={false}/>
              </div>
            </>
          )}
        </>
      ) : <Outlet/>}
    </section>
  )
}

export default ControlBook
