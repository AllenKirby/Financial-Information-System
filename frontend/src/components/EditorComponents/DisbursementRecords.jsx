import { Outlet, useParams } from 'react-router-dom'
import { useDisbursementContext } from '../../hooks/useDisbursementContext'
import DocumentDetails from '../DocumentDetails'
const DisbursementRecords = () => {
  const { documents } = useDisbursementContext()
  const { id } = useParams()
  console.log("documents records: ", documents)
  return (
    <section className="w-4/5 p-3 h-[30rem] overflow-auto rounded-xl shadow-slate-200 shadow-customShadowStyle bg-white">
      {!id ? ( 
        <>
          <div className="w-full py-3 px-6 flex items-center justify-between">
            <input 
            type="text" 
            placeholder="Search"
            className="text-sm w-64 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen"/>
            <button className="px-6 py-2 rounded-xl bg-customgreen text-white hover:scale-125 transition-all duration-100">Filter</button>
          </div>
          {documents ? (
            <div className="w-full max-h-fit overflow-auto py-3">
              {Object.entries(documents).map(([key, document]) => (
                <DocumentDetails key={key} documents={document}/>
              ))}
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </>
    ) : <Outlet/>}
    </section>
  )
}

export default DisbursementRecords