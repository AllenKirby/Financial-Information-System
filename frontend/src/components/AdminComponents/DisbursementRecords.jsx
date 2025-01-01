import {useParams, Outlet} from 'react-router-dom'
import { useState, useEffect } from 'react';

import PaginatedList from '../PaginatedList'

import { useAdminDisbursementContext } from '../../hooks/useAdminDisbursementContext'

import { IoSearchSharp } from "react-icons/io5";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";
import { IoIosClose } from "react-icons/io";
import { LuFileCheck } from "react-icons/lu";
import { FiLayers } from "react-icons/fi";
import { BsListTask } from "react-icons/bs";

const DisbursementRecords = () => {
  const { id } = useParams()
  const { AdminDocuments } = useAdminDisbursementContext()
  const [filterFlag, setFilterFlag] = useState(false)
  const [filter, setFilter] = useState('')
  const [filteredDocuments, setFilteredDocuments] = useState({all: {}, forApproval: {}, approved: {}})
  const [searchModal, setSearchModal] = useState(false)
  const [search, setSearch] = useState('')
  const [activeTabs, setActiveTabs] = useState('')

  const filterModal = (value) => {
    setFilter(value)
    setFilterFlag(!filterFlag)
  }
  useEffect(() => {
    if (AdminDocuments && Object.keys(AdminDocuments).length > 0) {
      if(!activeTabs) {
        const filteredResults = Object.fromEntries(
          Object.entries(AdminDocuments).filter(([, document]) =>
            document?.data?.fund.toLowerCase().includes(filter.toLowerCase())
          )
        );
        setFilteredDocuments({...filteredDocuments, all: filteredResults});
      } else {
        const drafts = Object.entries(AdminDocuments).filter(([, document]) => document.data.status.includes(activeTabs))
        const filteredDrafts = Object.fromEntries(drafts.filter((document ,) => document[1].data.fund.toLowerCase().includes(filter.toLowerCase())))
        if(activeTabs === 'For Approval') {
          setFilteredDocuments({...filteredDocuments, forApproval: filteredDrafts})
        } else if(activeTabs === 'Approved') {
          setFilteredDocuments({...filteredDocuments, approved: filteredDrafts})
        } 
      }
    } else {
      setFilteredDocuments({});
    }
  }, [filter, AdminDocuments, activeTabs]);

  useEffect(() => {
    if(!AdminDocuments) return 
    if(!activeTabs) {
      const filteredResults = Object.entries(AdminDocuments).filter(doc => doc[1].data.payee.toLowerCase().includes(search.toLowerCase()) || doc[1].data.DV.toLowerCase().includes(search.toLowerCase()))
      setFilteredDocuments({...filteredDocuments, all: Object.fromEntries(filteredResults)})
    } else {
      const drafts = Object.entries(AdminDocuments).filter(([, document]) => document.data.status.includes(activeTabs))
      const filteredDrafts = Object.fromEntries(drafts.filter((document ,) => document[1].data.payee.toLowerCase().includes(search.toLowerCase()) || document[1].data.DV.toLowerCase().includes(search.toLowerCase())))
      console.log(filteredDrafts)
      if(activeTabs === 'Approved') {
        setFilteredDocuments({...filteredDocuments, approved: filteredDrafts})
      } else if(activeTabs.includes('For Approval')) {
        setFilteredDocuments({...filteredDocuments, forApproval: filteredDrafts})
      }
    }
  }, [search, AdminDocuments, activeTabs])

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


  const getFilteredDocuments = () => {
    if (activeTabs === '') return filteredDocuments.all;
    if (activeTabs === 'For Approval') return filteredDocuments.forApproval;
    if (activeTabs === 'Approved') return filteredDocuments.approved;
    return filteredDocuments.all; 

  }

  return (
    <section className='w-full h-full p-2 relative flex flex-col gap-2'>
      <div className={`${searchModal ? ' block h-auto' : 'hidden'} absolute py-5 bg-white z-20 top-0 left-0 w-full block overflow-hidden sm:hidden transition-all duration-100`}>
        <div className='flex items-center justify-center gap-2 px-3'>
          <div className='w-5/6 relative'>
            <IoSearchSharp size={20} className='absolute top-[10px] left-4 text-gray-400'/>
            <input 
              type="search"
              placeholder='Search'
              onChange={(e) => setSearch(e.target.value)}
              className='w-full py-2 text-sm 2xl:text-base pl-10 rounded-lg focus:outline-customgreen border-2' />
          </div>
          <button onClick={() => setSearchModal(!searchModal)} className='w-1/6 py-1 flex items-center justify-center border-2 rounded-lg'>
            <IoIosClose size={25}/>
          </button>
        </div>
      </div>
      <div className='w-full h-[10%] flex'>
        <div className="w-2/3 sm:w-1/2 flex items-end">
          <div className='pt-3 flex items-center justify-center'>
            <button onClick={() => setActiveTabs('')} className={`${activeTabs === '' ? 'border-b-2 border-customgreen text-customgreen font-bold' : ''} flex items-center justify-center gap-2 px-3 py-2 text-gray-500 hover:border-b-2 hover:text-customgreen hover:font-bold hover:border-customgreen transition-all duration-100`}><FiLayers size={20}/><span className='hidden sm:block'>All</span></button>
            <button onClick={() => setActiveTabs('For Approval')} className={`${activeTabs === 'For Approval' ? 'border-b-2 border-customgreen text-customgreen font-bold' : ''} flex items-center justify-center gap-2 px-3 py-2 text-gray-500 hover:border-b-2 hover:text-customgreen hover:font-bold hover:border-customgreen transition-all duration-100`}><BsListTask size={20}/><span className='hidden sm:block'>For Approval</span></button>
            <button onClick={() => setActiveTabs('Approved')} className={`${activeTabs === 'Approved' ? 'border-b-2 border-customgreen text-customgreen font-bold' : ''} flex items-center justify-center gap-2 px-3 py-2 text-gray-500 hover:border-b-2 hover:text-customgreen hover:font-bold hover:border-customgreen transition-all duration-100`}><LuFileCheck size={20}/><span className='hidden sm:block'>Approved</span></button>
          </div>
        </div>
        <div className='w-1/2 flex items-end justify-end gap-2'>
          <div className='relative'>
            <button onClick={() => setFilterFlag(!filterFlag)} className='flex relative bg-white z-10 w-fit items-center justify-center gap-2 px-2 py-2 border-2 rounded-lg text-sm 2xl:text-base'>
              <HiAdjustmentsHorizontal 
                size={18}/>
                {filter ? <> <span className='hidden sm:block'>{filter}</span> <RxCross2 onClick={() => setFilter('')}/> </> : <span className='hidden sm:hidden md:hidden lg:hidden xl:block'>Filter by Fund Cluster</span>}
            </button>
            {filterFlag && (
              <>
                <div className="fixed inset-0 z-0" onClick={() => setFilterFlag(!filterFlag)}/>
                <div className='absolute w-24 sm:w-28 md:w-32 lg:w-full bg-white right-0 top-10 z-0 p-1 border-[1px] text-xs lg:text-sm'>
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
              onChange={(e) => setSearch(e.target.value)}
              className='w-14 sm:w-auto py-2 text-sm 2xl:text-base pl-10 placeholder-transparent sm:placeholder-gray-500 rounded-lg focus:outline-none border-2' />
          </div>
          <button onClick={() => setSearchModal(!searchModal)} className='block sm:hidden'>
            <IoSearchSharp size={38} className='border-2 rounded-lg px3 py-2 text-gray-400'/>
          </button>
        </div>
      </div>
      <div className="w-full h-[90%] rounded-lg">
        <div className='w-full h-full rounded-lg'>
          <div className='w-full h-[8%] hidden sm:flex items-center justify-center px-2 py-2 rounded-lg bg-gray-100 text-gray-400 text-sm'>
            <h1 className={`lg:text-sm 2xl:text-base text-left px-2 font-semibold ${activeTabs === 'For Approval' ? 'w-3/6' : 'w-2/6'}`}>Payee</h1>
            <h1 className='lg:text-sm 2xl:text-base w-1/6 text-center font-semibold'>DV No.</h1>
            <h1 className='lg:text-sm 2xl:text-base w-1/6 text-center font-semibold'>Status</h1>
            <h1 className='lg:text-sm 2xl:text-base w-1/6 text-center font-semibold'>Time Transferred</h1>
            {activeTabs !== 'For Approval' && (<h1 className='lg:text-sm 2xl:text-base w-1/6 text-center font-semibold'>Time Approved</h1>)}
          </div>
          <div className="w-full h-full sm:h-[92%] rounded-lg">
            <PaginatedList items={sortTimePassedDesc(getFilteredDocuments())} type={'1'} activeTab={activeTabs}/>
          </div>
        </div>
      </div>
      {id && (
        <>
          <div className="fixed inset-0 z-20 bg-black opacity-50" />
          <div className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
            <Outlet/>
          </div>
        </>
      )}
    </section>
  )
}

export default DisbursementRecords