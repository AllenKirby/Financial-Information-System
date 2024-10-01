import { useDisbursementContext } from '../hooks/useDisbursementContext'
import DocumentDetails from './DocumentDetails'
const DisbursementRecords = () => {
  const { documents } = useDisbursementContext()

  return (
    <section className="w-4/6 p-3 h-full rounded-xl shadow-slate-200 shadow-customShadowStyle bg-white">
      <div className="w-full py-3 px-6 flex items-center justify-between">
        <input 
        type="text" 
        placeholder="Search"
        className="text-sm w-64 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen"/>
        <button className="px-6 py-2 rounded-xl bg-customgreen text-white hover:scale-125 transition-all duration-100">Filter</button>
      </div>
      <div className="w-full max-h-fit overflow-auto py-3">
          {documents && documents.documents.map((document, index) => (
            <DocumentDetails key={index} documents={document.data}/>
          ))}
      </div>
    </section>
  )
}

export default DisbursementRecords