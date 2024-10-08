import { Outlet, useParams } from 'react-router-dom'
import { useDisbursementContext } from '../../hooks/useDisbursementContext'
import DocumentDetails from '../DocumentDetails'
import { IoAdd } from "react-icons/io5";
import { useState } from 'react';
import DisbursementVoucher from '../DisbursementVoucher';

const DisbursementRecords = () => {
  const { documents } = useDisbursementContext()
  const { id } = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const modal = () => setIsModalOpen(!isModalOpen)

  return (
    <section className="w-4/5 p-3 h-[30rem] rounded-xl shadow-slate-200 shadow-customShadowStyle bg-white">
      {!id ? ( 
        <>
          <div className="w-full py-1 px-6 flex items-center justify-between">
            
            <button onClick={modal} className="flex items-center justify-center gap-2 pl-3 py-2 pr-4 rounded-lg bg-white text-customgreen font-semibold border-2 border-customgreen hover:scale-125 hover:bg-customgreen hover:text-white transition-all duration-100">
              <div className='w-auto h-auto flex items-center justify-center'>
                <IoAdd size={20}/>
              </div>
              <p className='text-sm'>Add DV</p>
            </button>
          </div>
          <div className='w-full h-auto p-2'>
            <section className='w-full h-auto flex pl-3 pr-6 py-2'>
              <h1 className='w-4/6 text-left font-bold'>Payee</h1>
              <h1 className='w-1/6 text-center font-bold'>DV No.</h1>
              <h1 className='w-1/6 text-center font-bold'>Status</h1>
            </section>
            {documents ? (
              <section className="w-full h-[340px] overflow-auto rounded-md bg-gray-100 px-1">
                {Object.entries(documents).map(([key, document]) => (
                  <DocumentDetails key={key} documents={document} type='Editor'/>
                ))}
              </section>
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
    </section>
  )
}

export default DisbursementRecords