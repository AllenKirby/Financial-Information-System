import { useParams, Outlet } from "react-router-dom"
import { useState, useEffect } from "react";
import { useHeadDisbursementContext } from "../../hooks/useHeadDisbursementContext"
import PaginatedList from '../PaginatedList'
import { IoSearchSharp } from "react-icons/io5";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
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
    console.log(HeadDocuments)
    useEffect(() => {
      if (HeadDocuments && Object.keys(HeadDocuments).length > 0) {
        const filteredResults = Object.fromEntries(
          Object.entries(HeadDocuments).filter(([, document]) =>
            document?.data?.fund.toLowerCase().includes(filter.toLowerCase())
          )
        );
        setFilteredDocuments(filteredResults);
      } else {
        setFilteredDocuments({});
      }
    }, [filter, HeadDocuments]);
    
  return (
    <section className="w-full h-full">
      {!id ? (
        <>
          <div className='w-full h-auto py-2 flex'>
            <div className='w-1/2 flex flex-col'>
              <div className='pt-3'>
                <p className='font-semibold text-BOGreen px-2'>All Disbursement Voucher</p>
              </div>
            </div>
            <div className='w-1/2 flex items-end justify-end gap-2'>
              <div className='relative'>
                <button onClick={() => setFilterFlag(!filterFlag)} className='flex relative bg-white z-10 w-fit items-center justify-center gap-2 px-2 py-2 border-2 rounded-full text-sm'><HiAdjustmentsHorizontal size={15}/>{filter ? <>{filter} <RxCross2 onClick={() => setFilter('')}/></>: 'Filter by Fund Cluster'}</button>
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
              <div className='relative w-auto'>
                <IoSearchSharp size={20} className='absolute top-[12px] left-4 text-gray-400'/>
                <input 
                  type="search"
                  placeholder='Search'
                  className='py-2 pr-3 text-sm pl-10 rounded-full focus:outline-none border-2' />
              </div>
            </div>
          </div>
          <div className="w-full h-full rounded-t-lg ">
            <div className='w-full h-full'>
              <section className='w-full h-auto flex px-2 py-2 rounded-t-lg bg-BOGreen text-white'>
                <h1 className='w-3/6 text-left font-bold'>Payee</h1>
                <h1 className='w-1/6 text-center font-bold'>DV No.</h1>
                <h1 className='w-1/6 text-center font-bold'>Status</h1>
                <h1 className='w-1/6 text-center font-bold text-sm'>Time Transferred</h1>
              </section>
              <section className="w-full h-[430px] overflow-auto bg-white border-[1px] px-1">
                <PaginatedList items={filteredDocuments} type={'2'}/>
              </section>
            </div>
          </div>
        </>
      ) : <Outlet/>}
    </section>
  )
}

export default DisbursementRecordsHead