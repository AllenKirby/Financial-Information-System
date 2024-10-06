import { Outlet, useParams } from 'react-router-dom'
import { useOpDisbursementContext } from '../../hooks/useOpDisbursementContext'
import DocumentDetails from '../DocumentDetails'
const DisbursementRecords = () => {
  const { OpDocuments } = useOpDisbursementContext()
  const { id } = useParams()
  console.log("documents records: ", OpDocuments)
  return (
    <section className="w-4/5 p-3 h-[30rem] overflow-auto rounded-xl shadow-slate-200 shadow-customShadowStyle bg-white">
      {!id ? ( 
        <>
          <div className='w-full h-auto p-2'>
            <section className='w-full h-auto flex pl-3 pr-6 py-2'>
              <h1 className='w-3/6 flex items-center justify-start font-bold'>Payee</h1>
              <h1 className='w-1/6 flex items-center justify-center font-bold'>DV No.</h1>
              <h1 className='w-1/6 flex items-center justify-center font-bold'>Status</h1>
              <h1 className='w-1/6 flex items-center justify-center font-bold text-sm'>Time Transferred</h1>
              <h1 className='w-1/6 flex items-center justify-center font-bold'>Options</h1>
            </section>
          {OpDocuments ? (
            <div className="w-full h-[340px] overflow-auto rounded-md bg-gray-100 px-1">
              {Object.entries(OpDocuments.documents).map(([key, document]) => (
                <DocumentDetails key={key} documents={document} type='Operator' />
              ))}
            </div>
          ) : (
            <div>Loading...</div>
          )}
          </div>
        </>
    ) : <Outlet/>}
    </section>
  )
}

export default DisbursementRecords