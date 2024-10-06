import { Outlet, useParams } from 'react-router-dom'
import { useDisbursementContext } from '../../hooks/useDisbursementContext'
import DocumentDetails from '../DocumentDetails'
import { IoAdd } from "react-icons/io5";
import { useState } from 'react';
import DisbursementVoucher from './DisbursementVoucher';

const DisbursementRecords = () => {
  const { documents } = useDisbursementContext()
  const { id } = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const modal = () => setIsModalOpen(!isModalOpen)

  console.log("documents records: ", documents)

  return (
    <section className="w-4/5 p-3 h-[30rem] rounded-xl overflow-auto shadow-slate-200 shadow-customShadowStyle bg-white">
      {!id ? ( 
        <>
          <div className="w-full py-3 px-6 flex items-center justify-between">
            <button onClick={modal} className="flex pl-3 pr-5 py-1 rounded-lg bg-customgreen text-white hover:scale-125 transition-all duration-100">
              <div className='w-auto h-auto flex gap-2 items-center justify-center'>
                <IoAdd size={20}/> <p>Add DV</p>
              </div>
            </button>
          </div>
          <div className='w-full h-auto p-2'>
            <section className='w-full h-auto flex pl-3 pr-6 py-2'>
              <h1 className='w-3/6 text-left font-bold'>Payee</h1>
              <h1 className='w-1/6 text-center font-bold'>DV No.</h1>
              <h1 className='w-1/6 text-center font-bold'>Status</h1>
              <h1 className='w-1/6 text-center font-bold'>Options</h1>
            </section>
            {documents ? (
              <section className="w-full h-[340px] overflow-auto rounded-md bg-gray-100 px-1">
                {Object.entries(documents).map(([key, document]) => (
                    <DocumentDetails key={key} documents={document} />
                ))}
              </section>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </>
    ) : <Outlet/>}
    {isModalOpen && (
      <section className="fixed z-10 left-0 top-0 w-full h-full flex items-center justify-center">
        <DisbursementVoucher modal={modal}/>
      </section>
    )}
    </section>
  )
}

export default DisbursementRecords