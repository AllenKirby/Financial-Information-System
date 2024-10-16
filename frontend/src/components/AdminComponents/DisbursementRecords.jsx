import {useParams, Outlet} from 'react-router-dom'

import DocumentDetails from '../DocumentDetails'

import { useAuthContext } from '../../hooks/useAuthContext' 
import { useAdminDisbursementContext } from '../../hooks/useAdminDisbursementContext'

import { IoSearchSharp } from "react-icons/io5";

const DisbursementRecords = () => {
  const { id } = useParams()
  const { user } = useAuthContext()
  const { AdminDocuments } = useAdminDisbursementContext()
  return (
    <section className='w-full h-full'>
      <div className='w-full p-1 flex items-center justify-end'>
        <div className='relative'>
          <IoSearchSharp size={20} className='absolute top-[12px] left-4  text-gray-400'/>
          <input 
            type="search"
            placeholder='Search'
            className='py-2 pr-3 pl-10 rounded-3xl focus:outline-none border-2' />
        </div>
      </div>
      <div className="w-full p-3 h-full rounded-lg bg-white border-[1px]">
        {!id ? ( 
          <>
            <div className='w-full h-auto p-2'>
              <div className='w-full h-auto flex px-2 py-2 rounded-t-lg bg-customgreen text-white'>
                <h1 className='w-4/6 text-left font-bold px-2'>Payee</h1>
                <h1 className='w-1/6 text-center font-bold'>DV No.</h1>
                <h1 className='w-1/6 text-center font-bold'>Status</h1>
                <h1 className='w-1/6 text-center font-bold'>Time Transferred</h1>
              </div>
              {AdminDocuments ? (
                <div className="w-full h-[340px] overflow-auto">
                  {Object.entries(AdminDocuments).map(([key, document]) => (
                    <DocumentDetails key={key} documents={document} type={user.role}/>
                  ))}
                </div>
              ) : (
                <div className='w-full h-[340px] overflow-auto rounded-md bg-gray-100 px-1'>
                  <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                  <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                  <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                  <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                  <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                  <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                  <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                </div>
              )}
            </div>
          </>
        ) : <Outlet/>}
      </div>
    </section>
  )
}

export default DisbursementRecords