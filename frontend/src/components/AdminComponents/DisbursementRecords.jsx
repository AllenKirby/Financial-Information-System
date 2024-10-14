import {useParams, Outlet} from 'react-router-dom'
import DocumentDetails from '../DocumentDetails'
import { useAuthContext } from '../../hooks/useAuthContext' 
import { useAdminDisbursementContext } from '../../hooks/useAdminDisbursementContext'

const DisbursementRecords = () => {
  const { id } = useParams()
  const { user } = useAuthContext()
  const { AdminDocuments } = useAdminDisbursementContext()
  return (
    <section className="w-4/5 p-3 h-[30rem] rounded-xl shadow-slate-200 shadow-customShadowStyle bg-white">
      {!id ? ( 
        <>
          <div className='w-full h-auto p-2'>
            <section className='w-full h-auto flex pl-3 pr-6 py-2'>
              <h1 className='w-4/6 text-left font-bold'>Payee</h1>
              <h1 className='w-1/6 text-center font-bold'>DV No.</h1>
              <h1 className='w-1/6 text-center font-bold'>Status</h1>
              <h1 className='w-1/6 text-center font-bold text-sm'>Time Transferred</h1>
            </section>
            {AdminDocuments ? (
              <section className="w-full h-[340px] overflow-auto rounded-md bg-gray-100 px-1">
                {Object.entries(AdminDocuments).map(([key, document]) => (
                  <DocumentDetails key={key} documents={document} type={user.role}/>
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
    </section>
  )
}

export default DisbursementRecords