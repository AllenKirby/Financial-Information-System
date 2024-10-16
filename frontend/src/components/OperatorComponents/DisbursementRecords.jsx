import { Outlet, useParams } from 'react-router-dom'
import { useOpDisbursementContext } from '../../hooks/useOpDisbursementContext'
import DocumentDetails from '../DocumentDetails'
import { IoSearchSharp } from "react-icons/io5";

const DisbursementRecords = () => {
  const { OpDocuments } = useOpDisbursementContext()
  const { id } = useParams()
  console.log("documents records: ", OpDocuments)
  return (
    <section className='w-full h-full'>
      <div className='flex items-center justify-end py-1'>
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
      </div>
    </section>
    
  )
}

export default DisbursementRecords