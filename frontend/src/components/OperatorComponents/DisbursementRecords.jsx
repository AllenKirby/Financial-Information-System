import { Outlet, useParams } from 'react-router-dom'
import { useOpDisbursementContext } from '../../hooks/useOpDisbursementContext'
import DocumentDetails from '../DocumentDetails'
import { IoSearchSharp, IoAdd } from "react-icons/io5";
import { useState } from 'react';
import DisbursementVoucher from '../DisbursementVoucher';
import { useSelector } from 'react-redux';

const DisbursementRecords = () => {
  const { OpDocuments } = useOpDisbursementContext()
  const { id } = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const permission = useSelector((state) => state.permission)

  const modal = () => setIsModalOpen(!isModalOpen)

  return (
    <section className='w-full h-full'>
      <div className='flex items-center justify-end py-1'>
        {(permission && permission?.data?.permission) && (
          <div className="w-full py-1 flex items-center justify-between">
            <button onClick={modal} className="flex items-center justify-center gap-2 pl-3 py-1 pr-4 rounded-lg bg-customgreen text-white font-semibold border-2 border-customgreen hover:scale-125 transition-all duration-100">
              <IoAdd size={20} className='font-bold'/>Add DV
            </button>
          </div>
        )}
        <div className='relative'>
          <IoSearchSharp size={20} className='absolute top-[12px] left-4 text-gray-400'/>
          <input 
            type="search"
            placeholder='Search'
            className='py-2 pr-3 pl-10 rounded-3xl focus:outline-none border-2' />
        </div>
      </div>
      <div className="w-full p-3 h-full rounded-t-lg border-[1px] bg-white">
        {!id ? ( 
          <>
            <div className='w-full h-auto p-2'>
              <section className='w-full h-auto flex px-2 py-2 rounded-t-lg bg-customgreen text-white'>
                <h1 className='w-4/6 text-left font-bold px-2'>Payee</h1>
                <h1 className='w-1/6 text-center font-bold'>DV No.</h1>
                <h1 className='w-1/6 text-center font-bold'>Status</h1>
                <h1 className='w-1/6 text-center font-bold'>Time Transferred</h1>
              </section>
            {OpDocuments ? (
              <div className="w-full h-[340px] overflow-auto">
                {Object.entries(OpDocuments.documents).map(([key, document]) => (
                  <DocumentDetails key={key} documents={document} type={'3'} />
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
      {isModalOpen && (
          <>
          <div className="fixed inset-0 z-20 bg-black opacity-50" onClick={modal} />
          <section className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
            <DisbursementVoucher modal={modal} flag={false}/>
          </section>
        </>
        )}
      </div>
    </section>
    
  )
}

export default DisbursementRecords