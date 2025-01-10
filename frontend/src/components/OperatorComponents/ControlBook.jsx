import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { Outlet, useParams } from "react-router-dom"

import AddControlBook from "./AddControlBook"
import {useAuthContext} from '../../hooks/useAuthContext'


import { IoAdd } from "react-icons/io5";
import PaginatedList from "../Pagination/PaginatedList"

const ControlBook = () => {
  const [controlBookFlag, setControlBookFlag] = useState(false)
  const [CBStatus, setCBStatus] = useState('active')
  const [filteredCB, setFilteredCB] = useState({})

  const controlBooks = useSelector((state) => state.controlBook)
  const { user } = useAuthContext()


  const { id } = useParams()

  const modal = () => setControlBookFlag(!controlBookFlag)

  useEffect(() => {

   if(controlBooks && Object.entries(controlBooks).length > 0) {
    const filteredResults = Object.entries(controlBooks).filter(([, controlBook]) => controlBook.cbStatus === CBStatus)
    console.log(controlBooks)
    setFilteredCB(Object.fromEntries(filteredResults))
   }else{
    setFilteredCB({})
   }
  }, [CBStatus, controlBooks])

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
          <div className="w-full flex-1 overflow-y-auto">
            {Object.entries(filteredCB).length > 0 ? (
              <PaginatedList items={filteredCB} paginationFor="ControlBook"/>
              ) : (
                <div className='w-full h-full flex items-center justify-center'>
                  <p className='font-bold'>No Control Book Found</p>
                </div>
              )
            }
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
