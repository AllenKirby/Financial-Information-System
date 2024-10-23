import { useParams, Outlet } from "react-router-dom"
import { useState, useEffect } from "react";
import { useHeadDisbursementContext } from "../../hooks/useHeadDisbursementContext"
import DocumentDetails from '../DocumentDetails'
import { IoSearchSharp } from "react-icons/io5";
import { FiFilter } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

const DisbursementRecordsHead = () => {
    const { id } = useParams()
    const { HeadDocuments } = useHeadDisbursementContext()
    const [filterFlag, setFilterFlag] = useState(false)
    const [filter, setFilter] = useState('')
    const [filteredDocuments, setFilteredDocuments] = useState({})

    const filterModal = (value) => {
      setFilter(value)
      setFilterFlag(!filterFlag)
    }
  
    useEffect(() => {
      if (HeadDocuments && Object.keys(HeadDocuments).length > 0) {
        const filteredResults = Object.fromEntries(
          Object.entries(HeadDocuments).filter(([, document]) =>
            document.fund.toLowerCase().includes(filter.toLowerCase())
          )
        );
        setFilteredDocuments(filteredResults);
      } else {
        setFilteredDocuments({});
      }
    }, [filter, HeadDocuments]);
    
  return (
    <section className="w-full h-full">
      <div className='flex items-center justify-end py-1'>
      <div className='relative w-1/2 flex items-center justify-end gap-2'>
          <div className='relative w-auto'>
            <IoSearchSharp size={20} className='absolute top-[12px] left-4 text-gray-400'/>
            <input 
              type="search"
              placeholder='Search'
              className='py-2 pr-3 pl-10 rounded-3xl focus:outline-none border-2' />
          </div>
          <div className='relative'>
            <button onClick={() => setFilterFlag(!filterFlag)} className='flex relative bg-white z-20 w-fit items-center justify-center gap-2 px-2 py-2 border-2 border-customFontColor rounded-full text-sm'><FiFilter size={15}/>{filter ? <>{filter} <RxCross2 onClick={() => setFilter('')}/></>: 'Filter by Fund Cluster'}</button>
            {filterFlag && (
              <>
                <div className="fixed inset-0 z-0" onClick={() => setFilterFlag(!filterFlag)}/>
                <div className='absolute w-full bg-white pt-5 top-5 z-0 p-1 border-[1px]'>
                  <div onClick={() => filterModal('501 COB')} className='text-center mt-1 hover:bg-slate-100 cursor-pointer py-1 text-sm'>501 COB</div>
                  <div onClick={() => filterModal('501 LFP')} className='text-center mt-1 hover:bg-slate-100 cursor-pointer py-1 text-sm'>501 LFP</div>
                  <div onClick={() => filterModal('501 CARP')} className='text-center mt-1 hover:bg-slate-100 cursor-pointer py-1 text-sm'>501 CARP</div>
                  <div onClick={() => filterModal('Contract Farming')} className='text-center mt-1 hover:bg-slate-100 cursor-pointer py-1 text-sm'>Contract Farming</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="w-full p-3 h-full border-[1px] rounded-t-lg bg-white ">
        {!id ? ( 
          <>
            <div className='w-full h-full p-2'>
              <section className='w-full h-auto flex px-2 py-2 rounded-t-lg bg-customgreen text-white'>
                <h1 className='w-4/6 text-left font-bold'>Payee</h1>
                <h1 className='w-1/6 text-center font-bold'>DV No.</h1>
                <h1 className='w-1/6 text-center font-bold'>Status</h1>
                <h1 className='w-1/6 text-center font-bold text-sm'>Time Transferred</h1>
              </section>
              {filteredDocuments ? (
                <section className="w-full h-[340px] overflow-auto">
                  {Object.entries(filteredDocuments).map(([key, document]) => (
                    <DocumentDetails key={key} documents={document} type={'2'}/>
                  ))}
                </section>
              ) : (
                <div className='w-full h-full flex items-center justify-center'>
                  <div>No Documents Found</div>
                </div>
                // <div className='w-full h-[340px] overflow-auto rounded-md bg-gray-100 px-1'>
                //   <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                //   <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                //   <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                //   <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                //   <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                //   <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                //   <div className='animate-blink w-full h-12 rounded-md my-1 bg-gray-200 text-customFontGreen cursor-pointer flex items-center justify-center transition-all duration-150'></div>
                // </div>
              )}
            </div>
          </>
      ) : <Outlet/>}
      </div>
    </section>
  )
}

export default DisbursementRecordsHead