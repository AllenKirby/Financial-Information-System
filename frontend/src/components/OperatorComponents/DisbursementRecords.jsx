import { Outlet, useParams } from 'react-router-dom'
import { useOpDisbursementContext } from '../../hooks/useOpDisbursementContext'
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { IoSearchSharp, IoAdd } from "react-icons/io5";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";
import { BsSortAlphaDown, BsSortAlphaDownAlt } from "react-icons/bs";
import { FaSort } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";

import PaginatedList from '../PaginatedList';
import DisbursementVoucher from '../DisbursementVoucher';

const DisbursementRecords = () => {
  const { OpDocuments } = useOpDisbursementContext()
  const { id } = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const permission = useSelector((state) => state.permission)
  const [filterFlag, setFilterFlag] = useState(false)
  const [filter, setFilter] = useState('')
  const [filteredDocuments, setFilteredDocuments] = useState({})
  const [alphabeticalFlag, setAlphabeticalFlag] = useState(false)
  const [timePassedFlag, setTimePassedFlag] = useState(false)
  const [timeReturnedFlag, setTimeReturnedFlag] = useState(false)
  const [searchModal, setSearchModal] = useState(false)

  const modal = () => setIsModalOpen(!isModalOpen)

  const filterModal = (value) => {
    setFilter(value)
    setFilterFlag(!filterFlag)
  }

  useEffect(() => {
    if (OpDocuments.documents && Object.keys(OpDocuments.documents).length > 0) {
      const filteredResults = Object.fromEntries(
        Object.entries(OpDocuments.documents).filter(([, document]) => 
          document?.data?.fund.toLowerCase().includes(filter.toLowerCase())
        )
      );
      setFilteredDocuments(filteredResults);
    } else {
      setFilteredDocuments({});
    }
  }, [filter, OpDocuments]);

  const sortAphabetically = (flag) => {
    setAlphabeticalFlag(!alphabeticalFlag)
    if (OpDocuments.documents && Object.keys(OpDocuments.documents).length > 0) {
      if(flag) {
        const sortedEntries = Object.entries(OpDocuments.documents).sort(([, a], [, b]) => 
          a.data.payee.localeCompare(b.data.payee)
        );
        const filteredResults = Object.fromEntries(sortedEntries);
        setFilteredDocuments(filteredResults);
      }
      else {
        const sortedEntries = Object.entries(OpDocuments.documents).sort(([, a], [, b]) => 
          a.data.payee.localeCompare(b.data.payee)
        );
        const filteredResults = Object.fromEntries(sortedEntries.reverse());
        setFilteredDocuments(filteredResults);
      }
    } else {
      setFilteredDocuments({}); 
    }
  }

  const sortTimePassedAsc = () => {
    setTimePassedFlag(!timePassedFlag)
    if (OpDocuments.documents && Object.keys(OpDocuments.documents).length > 0) {
      const sortedEntries = Object.entries(OpDocuments.documents).sort(([, a], [, b]) => 
        new Date(b.data.submittedBy) - new Date(a.data.submittedBy)
      );
      const filteredResults = Object.fromEntries(sortedEntries);
      setFilteredDocuments(filteredResults);
    } else {
      setFilteredDocuments({}); 
    }
  }

  const sortTimePassedDesc = () => {
    setTimePassedFlag(!timePassedFlag)
    if (OpDocuments.documents && Object.keys(OpDocuments.documents).length > 0) {
      const sortedEntries = Object.entries(OpDocuments.documents).sort(([, a], [, b]) => 
        new Date(b.data.submittedBy) - new Date(a.data.submittedBy)
      );
      const filteredResults = Object.fromEntries(sortedEntries.reverse());
      setFilteredDocuments(filteredResults);
    } else {
      setFilteredDocuments({}); 
    }
  }

  const sortTimeReturnedAsc = () => {
    setTimeReturnedFlag(!timeReturnedFlag)
    if (OpDocuments.documents && Object.keys(OpDocuments.documents).length > 0) {
      const sortedEntries = Object.entries(OpDocuments.documents).sort(([, a], [, b]) => {
        const [, dateA, timeA] = a.data.returnedToFunding ? a.data.returnedToFunding.split('|') : ["", "", ""];
        const [, dateB, timeB] = b.data.returnedToFunding ? b.data.returnedToFunding.split('|') : ["", "", ""];
        if (!a.data.returnedBy) return -1; 
        if (!b.data.returnedBy) return 1;
        const aDate = `${dateA} ${timeA}` 
        const bDate = `${dateB} ${timeB}` 
        return new Date(aDate) - new Date(bDate)
      });
      const filteredResults = Object.fromEntries(sortedEntries);
      setFilteredDocuments(filteredResults);
    } else {
      setFilteredDocuments({}); 
    }
  }

  const sortTimeReturnedDesc = () => {
    setTimeReturnedFlag(!timeReturnedFlag)
    if (OpDocuments.documents && Object.keys(OpDocuments.documents).length > 0) {
      const sortedEntries = Object.entries(OpDocuments.documents).sort(([, a], [, b]) => {
        const [, dateA, timeA] = a.data.returnedToFunding ? a.data.returnedToFunding.split('|') : ["", "", ""];
        const [, dateB, timeB] = b.data.returnedToFunding ? b.data.returnedToFunding.split('|') : ["", "", ""];
        if (!a.data.returnedBy) return -1; 
        if (!b.data.returnedBy) return 1;
        const aDate = `${dateA} ${timeA}` 
        const bDate = `${dateB} ${timeB}` 
        return new Date(aDate) - new Date(bDate)
      });
      const filteredResults = Object.fromEntries(sortedEntries.reverse());
      setFilteredDocuments(filteredResults);
    } else {
      setFilteredDocuments({}); 
    }
  }

  return (
    <section className='w-full h-full p-2 relative'>
      {!id ? (
        <>
          <div className={`${searchModal ? ' block h-auto' : 'hidden'} absolute py-5 bg-white z-20 top-0 left-0 w-full block overflow-hidden sm:hidden transition-all duration-100`}>
            <div className='flex items-center justify-center gap-2 px-3'>
              <div className='w-5/6 relative'>
                <IoSearchSharp size={20} className='absolute top-[10px] left-4 text-gray-400'/>
                <input 
                  type="search"
                  placeholder='Search'
                  className='w-full py-2 text-sm 2xl:text-base pl-10 rounded-lg focus:outline-preparerPrimary border-2' />
              </div>
              <button onClick={() => setSearchModal(!searchModal)} className='w-1/6 py-1 flex items-center justify-center border-2 rounded-lg'>
                <IoIosClose size={25}/>
              </button>
            </div>
          </div>
          <div className='w-full h-[10%] py-2 flex'>
            <div className="w-2/3 sm:w-1/2 flex items-end">
              <div className='pt-3'>
                <p className='font-semibold text-xs lg:text-base 2xl:text-lg text-preparerPrimary px-2'>Disbursement Vouchers ({Object.entries(filteredDocuments).length})</p>
              </div>
            </div>
            <div className='w-1/2 flex items-end justify-end gap-2'>
              {(permission && permission?.data?.permission) && (
                <button onClick={modal} className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm 2xl:text-base bg-preparerPrimary text-white ">
                  <IoAdd size={20} className='font-bold'/> <span className='hidden lg:block'>New</span>
                </button>
              )}
              <div className='relative'>
                <button 
                  onClick={() => setFilterFlag(!filterFlag)} className='flex relative bg-white z-10 w-fit items-center justify-center gap-2 px-2 py-2 border-2 rounded-lg text-sm 2xl:text-base'>
                    <HiAdjustmentsHorizontal 
                      size={15}/>
                      {filter ? <>{filter} <RxCross2 onClick={() => setFilter('')}/></> : <span className='hidden sm:hidden md:hidden lg:hidden xl:block'>Filter by Fund Cluster</span>}
                </button>
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
              <div className='relative w-auto hidden sm:block'>
                <IoSearchSharp size={20} className='absolute top-[10px] left-4 text-gray-400'/>
                <input 
                  type="search"
                  placeholder='Search'
                  className='w-14 sm:w-auto py-2 text-sm 2xl:text-base pl-10 placeholder-transparent sm:placeholder-gray-500 rounded-lg focus:outline-none border-2' />
              </div>
              <button onClick={() => setSearchModal(!searchModal)} className='block sm:hidden'>
                <IoSearchSharp size={38} className='border-2 rounded-lg px3 py-2 text-gray-400'/>
              </button>
            </div>
          </div>
        <div className="w-full h-[90%] rounded-lg">
          <div className='w-full h-full rounded-lg border-2'>
            <div className='w-full h-auto flex px-2 py-2 rounded-t-lg bg-gray-100 text-gray-400 text-sm'>
              <div className='w-2/6 flex '>
                <h1 className='lg:text-base 2xl:text-lg w-auto text-left px-2 font-semibold flex items-center justify-center gap-2'>
                  Payee {alphabeticalFlag ? 
                    <BsSortAlphaDownAlt 
                      size={20} 
                      onClick={() => sortAphabetically(true)}
                      className='cursor-pointer'/> : 
                    <BsSortAlphaDown 
                      size={20} 
                      onClick={() => sortAphabetically(false)}
                      className='cursor-pointer'/>
                  }
                </h1>
              </div>
              <h1 className='lg:text-base 2xl:text-lg w-1/6 text-center font-semibold'>DV No.</h1>
              <h1 className='lg:text-base 2xl:text-lg w-1/6 text-center font-semibold'>Status</h1>
              <div className='w-1/6 flex items-end justify-center gap-2'>
                  <h1 className='lg:text-base 2xl:text-lg w-auto text-center font-semibold flex items-center justify-center gap-2'>Time Transferred <FaSort className='cursor-pointer' onClick={timePassedFlag ? sortTimePassedDesc : sortTimePassedAsc}/></h1>
                </div>
                <div className='w-1/6 flex items-end justify-center gap-2'>
                  <h1 className='lg:text-base 2xl:text-lg w-auto text-center font-semibold flex items-center justify-center gap-2'>Time Returned <FaSort className='cursor-pointer' onClick={timeReturnedFlag ? sortTimeReturnedDesc : sortTimeReturnedAsc}/></h1>
                </div>
              </div>
              <div className="w-full h-[92%] overflow-auto bg-white rounded-lg">
                <PaginatedList items={filteredDocuments} type={'3'}/>
              </div>
            </div>
            {isModalOpen && (
              <>
                <div className="fixed inset-0 z-20 bg-black opacity-50" onClick={modal} />
                <div className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
                  <DisbursementVoucher modal={modal} flag={false}/>
                </div>
              </>
            )}
          </div>
        </>
      ) : <Outlet/>}
    </section>
    
  )
}

export default DisbursementRecords