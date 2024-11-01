import {useParams, Outlet} from 'react-router-dom'
import { useState, useEffect } from 'react';

import DocumentDetails from '../DocumentDetails'

import { useAdminDisbursementContext } from '../../hooks/useAdminDisbursementContext'

import { IoSearchSharp } from "react-icons/io5";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";

const DisbursementRecords = () => {
  const { id } = useParams()
  const { AdminDocuments } = useAdminDisbursementContext()
  const [filterFlag, setFilterFlag] = useState(false)
  const [filter, setFilter] = useState('')
  const [filteredDocuments, setFilteredDocuments] = useState({})

  const filterModal = (value) => {
    setFilter(value)
    setFilterFlag(!filterFlag)
  }
  useEffect(() => {
    if (AdminDocuments && Object.keys(AdminDocuments).length > 0) {
      const filteredResults = Object.fromEntries(
        Object.entries(AdminDocuments).filter(([, document]) =>
          document?.data?.fund.toLowerCase().includes(filter.toLowerCase())
        )
      );
      setFilteredDocuments(filteredResults);
    } else {
      setFilteredDocuments({});
    }
  }, [filter, AdminDocuments]);

  return (
    <section className='w-full h-full'>
      {!id ? (
        <>
          <div className='w-full h-auto py-2 flex'>
            <div className='w-1/2 flex flex-col'>
              <div className='pt-3'>
                <p className='font-semibold text-customgreen px-2'>All Disbursement Voucher</p>
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
                  className='py-2 pr-3 pl-10 text-sm rounded-full focus:outline-none border-2' />
              </div>
            </div>
          </div>
          <div className="w-full h-full rounded-lg">
            <div className='w-full h-full'>
              <div className='w-full h-auto flex px-2 py-2 rounded-t-lg bg-customgreen text-white'>
                <h1 className='w-3/6 text-left font-medium px-2'>Payee</h1>
                <h1 className='w-1/6 text-center font-medium'>DV No.</h1>
                <h1 className='w-1/6 text-center font-medium'>Status</h1>
                <h1 className='w-1/6 text-center font-medium text-sm'>Time Transferred</h1>
              </div>
              <div className="w-full h-[400px] overflow-auto bg-white border-[1px] px-1">
                {Object.keys(filteredDocuments).length > 0 ? (
                  Object.entries(filteredDocuments).map(([key, document]) => (
                    <DocumentDetails key={key} documents={document} type={'1'}/>
                  ))
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
            </div>
          </div>
        </>
      ) : <Outlet/>}
    </section>
  )
}

export default DisbursementRecords