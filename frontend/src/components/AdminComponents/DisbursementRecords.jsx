import {useParams, Outlet} from 'react-router-dom'
import { useState, useEffect } from 'react';

import PaginatedList from '../PaginatedList'

import { useAdminDisbursementContext } from '../../hooks/useAdminDisbursementContext'

import { IoSearchSharp } from "react-icons/io5";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";
import { BsSortAlphaDown, BsSortAlphaDownAlt } from "react-icons/bs";
import { FaSort } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";

const DisbursementRecords = () => {
  const { id } = useParams()
  const { AdminDocuments } = useAdminDisbursementContext()
  const [filterFlag, setFilterFlag] = useState(false)
  const [filter, setFilter] = useState('')
  const [filteredDocuments, setFilteredDocuments] = useState({})
  const [alphabeticalFlag, setAlphabeticalFlag] = useState(false)
  const [searchModal, setSearchModal] = useState(false)

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
      const descFilteredResults = sortTimePassedDesc(filteredResults)
      setFilteredDocuments(descFilteredResults);
    } else {
      setFilteredDocuments({});
    }
  }, [filter, AdminDocuments]);

  const sortAphabetically = (flag) => {
    setAlphabeticalFlag(!alphabeticalFlag)
    if (AdminDocuments && Object.keys(AdminDocuments).length > 0) {
      if(flag) {
        const sortedEntries = Object.entries(AdminDocuments).sort(([, a], [, b]) => 
          a.data.payee.localeCompare(b.data.payee)
        );
        const filteredResults = Object.fromEntries(sortedEntries);
        setFilteredDocuments(filteredResults);
      }
      else {
        const sortedEntries = Object.entries(AdminDocuments).sort(([, a], [, b]) => 
          a.data.payee.localeCompare(b.data.payee)
        );
        const filteredResults = Object.fromEntries(sortedEntries.reverse());
        setFilteredDocuments(filteredResults);
      }
    } else {
      setFilteredDocuments({}); 
    }
  }

  const sortTimePassedDesc = (docu) => {
    if (docu && Object.keys(docu).length > 0) {
      const sortedEntries = Object.entries(docu).sort(([, a], [, b]) => {
        const dateTimeA = a.data.reviewedBy.split('|').slice()[1]
        const dateTimeB = b.data.reviewedBy.split('|').slice()[1]
        return new Date(dateTimeB) - new Date(dateTimeA)
      });
      return Object.fromEntries(sortedEntries)
    } else {
      return {} 
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
                <h1 className='lg:text-base 2xl:text-lg w-1/6 text-center font-semibold flex items-center justify-center gap-2'>Time Transferred</h1>
                <div className='w-1/6 flex items-end justify-center gap-2'>
                  <h1 className='lg:text-base 2xl:text-lg w-auto text-center font-semibold flex items-center justify-center gap-2'>Time Approved <FaSort className='cursor-pointer'/></h1>
                </div>
              </div>
              <div className="w-full h-[92%] overflow-auto bg-white rounded-lg">
                <PaginatedList items={filteredDocuments} type={'1'}/>
              </div>
            </div>
          </div>
        </>
      ) : <Outlet/>}
    </section>
  )
}

export default DisbursementRecords