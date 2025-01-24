import { Outlet, useParams } from 'react-router-dom'
import { useDisbursementContext } from '../../hooks/useDisbursementContext'
import { useEffect, useState } from 'react';
import { useSelector} from 'react-redux'

import { IoSearchSharp, IoAdd  } from "react-icons/io5";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";
import { IoIosClose } from "react-icons/io";
import { MdOutlineDrafts, MdKeyboardReturn } from "react-icons/md";
import { FiLayers } from "react-icons/fi";
import { BsClockHistory } from "react-icons/bs";

import DisbursementVoucher from './DisbursementVoucher';
import PaginatedList from '../Pagination/PaginatedList';

const DisbursementRecords = () => {
  const { documents } = useDisbursementContext()
  const { id } = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterFlag, setFilterFlag] = useState(false)
  const [filter, setFilter] = useState('')
  const [filteredDocuments, setFilteredDocuments] = useState({all: {}, drafting: {}, returned: {}, inReview: {}})
  const [searchModal, setSearchModal] = useState(false)
  const [search, setSearch] = useState('')
  const [activeTabs, setActiveTabs] = useState('')
  const permission = useSelector((state) => state.permission)

  const modal = () => setIsModalOpen(!isModalOpen)

  const filterModal = (value) => {
    setFilter(value)
    setFilterFlag(!filterFlag)
  }

  useEffect(() => {
    if (documents && Object.keys(documents).length > 0) {
      if(!activeTabs) {
        const filteredResults = Object.fromEntries(
          Object.entries(documents).filter(([, document]) => 
            document.fund.toLowerCase().includes(filter.toLowerCase())
          )
        );
        setFilteredDocuments({...filteredDocuments, all: filteredResults});
      } else {
        const drafts = Object.entries(documents).filter(([, document]) => document.status.includes(activeTabs))
        const filteredDrafts = Object.fromEntries(drafts.filter((document ,) => document[1].fund.toLowerCase().includes(filter.toLowerCase())))
        if(activeTabs === 'Drafting') {
          setFilteredDocuments({...filteredDocuments, drafting: filteredDrafts})
        } else if(activeTabs.includes('Returned')) {
          setFilteredDocuments({...filteredDocuments, returned: filteredDrafts})
        } else if(activeTabs.includes('In Review')) {
          setFilteredDocuments({...filteredDocuments, inReview: filteredDrafts})
        }
      } 
    } else {
      setFilteredDocuments({
        all: {},
        drafting: {},
        returned: {},
        inReview: {},
      }); 
    }
  }, [filter, documents, activeTabs]);

  useEffect(() => {
    if(documents && Object.entries(documents).length > 0) {
      if(!activeTabs) {
        const filteredResults = Object.entries(documents).filter(doc => doc[1].payee.toLowerCase().includes(search.toLowerCase()) || doc[1].DV.toLowerCase().includes(search.toLowerCase()))
        setFilteredDocuments({...filteredDocuments, all: Object.fromEntries(filteredResults)})
      } else {
        const drafts = Object.entries(documents).filter(([, document]) => document.status.includes(activeTabs))
        const filteredDrafts = Object.fromEntries(drafts.filter((document ,) => document[1].payee.toLowerCase().includes(search.toLowerCase()) || document[1].DV.toLowerCase().includes(search.toLowerCase())))
        if(activeTabs === 'Drafting') {
          setFilteredDocuments({...filteredDocuments, drafting: filteredDrafts})
        } else if(activeTabs.includes('Returned')) {
          setFilteredDocuments({...filteredDocuments, returned: filteredDrafts})
        } else if(activeTabs.includes('In Review')) {
          setFilteredDocuments({...filteredDocuments, inReview: filteredDrafts})
        }
      }
    } else {
      setFilteredDocuments({
        all: {},
        drafting: {},
        returned: {},
        inReview: {}
      })
    }
  }, [search, documents, activeTabs])

  const sortTimeCreatedDesc = (docu) => {
    if (docu && Object.keys(docu).length > 0) {
      const sortedEntries = Object.entries(docu).sort(([, a], [, b]) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      return Object.fromEntries(sortedEntries);
    } else {
      return {}
    }
  }

  const getFilteredDocuments = () => {
    if (!activeTabs) return filteredDocuments.all || {};
    if (activeTabs === 'Drafting') return filteredDocuments.drafting || {};
    if (activeTabs.includes('Returned')) return filteredDocuments.returned || {};
    if (activeTabs === 'In Review') return filteredDocuments.inReview || {};
    return {}; 
  }

  return (
    <section className='w-full h-full p-2 relative flex flex-col gap-2 text-gray-500'>
      <div className={`${searchModal ? ' block h-auto' : 'hidden'} absolute py-5 bg-white z-20 top-0 left-0 w-full block overflow-hidden sm:hidden transition-all duration-100`}>
        <div className='flex items-center justify-center gap-2 px-3'>
          <div className='w-5/6 relative'>
            <IoSearchSharp size={20} className='absolute top-[10px] left-4 text-gray-400'/>
            <input 
              type="search"
              placeholder='Search'
              onChange={(e) => setSearch(e.target.value)}
              className='w-full py-2 text-sm 2xl:text-base pl-10 rounded-lg focus:outline-preparerPrimary border-2' />
          </div>
          <button onClick={() => setSearchModal(!searchModal)} className='w-1/6 py-1 flex items-center justify-center border-2 rounded-lg'>
            <IoIosClose size={25}/>
          </button>
        </div>
      </div>
      <div className='w-full h-[10%] flex'>
        <div className="w-2/3 sm:w-1/2 flex items-end">
          <div className='pt-3 flex items-center justify-center'>
            <button onClick={() => setActiveTabs('')} className={`${!activeTabs ? 'border-b-2 border-preparerPrimary text-preparerPrimary font-bold' : ''} flex items-center justify-center gap-2 px-3 py-2 text-gray-500 hover:border-b-2 hover:text-preparerPrimary hover:font-bold hover:border-preparerPrimary transition-all duration-100`}><FiLayers size={20}/><span className='hidden lg:block'>All</span></button>
            <button onClick={() => setActiveTabs('Drafting')} className={`${activeTabs === 'Drafting' ? 'border-b-2 border-preparerPrimary text-preparerPrimary font-bold' : ''} flex items-center justify-center gap-2 px-3 py-2 text-gray-500 hover:border-b-2 hover:text-preparerPrimary hover:font-bold hover:border-preparerPrimary transition-all duration-100`}><MdOutlineDrafts size={20}/><span className='hidden lg:block'>Drafting</span></button>
            {permission?.data?.permission && <button onClick={() => setActiveTabs('In Review')} className={`${activeTabs === 'In Review' ? 'border-b-2 border-preparerPrimary text-preparerPrimary font-bold' : ''} flex items-center justify-center gap-2 px-3 py-2 text-gray-500 hover:border-b-2 hover:text-preparerPrimary hover:font-bold hover:border-preparerPrimary transition-all duration-100`}><BsClockHistory size={20}/><span className='hidden lg:block'>In Review</span></button>}
            <button onClick={() => setActiveTabs('Returned')} className={`${activeTabs.includes('Returned') ? 'border-b-2 border-preparerPrimary text-preparerPrimary font-bold' : ''} flex items-center justify-center gap-2 px-3 py-2 text-gray-500 hover:border-b-2 hover:text-preparerPrimary hover:font-bold hover:border-preparerPrimary transition-all duration-100`}><MdKeyboardReturn size={20}/><span className='hidden lg:block'>Returned</span></button>
          </div>
        </div>
        <div className='w-1/3 sm:w-1/2 flex items-end justify-end gap-2'>
          <button onClick={modal} className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm 2xl:text-base bg-preparerPrimary text-white ">
            <IoAdd size={20} className='font-bold'/> <span className='hidden lg:block'>New</span>
          </button>
          <div className='relative'>
            <button onClick={() => setFilterFlag(!filterFlag)} className='flex relative bg-white z-10 w-fit items-center justify-center gap-2 px-2 py-2 border-2 rounded-lg text-sm 2xl:text-base'>
              <HiAdjustmentsHorizontal 
                size={18}/>
                {filter ? <>{filter} <RxCross2 onClick={() => setFilter('')}/></> : <span className='hidden sm:hidden md:hidden lg:hidden xl:block'>Filter by Fund Cluster</span>}
            </button>
            {filterFlag && (
              <>
                <div className="fixed inset-0 z-0" onClick={() => setFilterFlag(!filterFlag)}/>
                <div className='absolute w-24 sm:w-28 md:w-32 lg:w-full bg-white right-0 top-10 z-0 p-1 border-[1px] text-xs lg:text-sm'>
                  <div onClick={() => filterModal('501 COB')} className='text-center mt-1 hover:bg-slate-100 cursor-pointer py-1 text-sm'>501 COB</div>
                  <div onClick={() => filterModal('501 LFP')} className='text-center mt-1 hover:bg-slate-100 cursor-pointer py-1 text-sm'>501 LFP</div>
                  <div onClick={() => filterModal('501 CARP')} className='text-center mt-1 hover:bg-slate-100 cursor-pointer py-1 text-sm'>501 CARP</div>
                  <div onClick={() => filterModal('Farming Support Services Program')} className='text-center mt-1 hover:bg-slate-100 cursor-pointer py-1 text-sm'>Farming Support Services Program</div>
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
        <div className='w-full h-full flex flex-col rounded-lg'>
          <div className='w-full h-auto hidden sm:flex items-center justify-center px-2 py-2 rounded-lg bg-gray-100 text-gray-400 text-sm'>
            <h1 className={`lg:text-sm 2xl:text-base ${!activeTabs ? 'w-4/6' : 'w-3/6'} text-left px-2 font-semibold`}>Payee</h1>
            <h1 className='lg:text-sm 2xl:text-base w-1/6 text-center font-semibold'>DV No.</h1>
            <h1 className='lg:text-sm 2xl:text-base w-1/6 text-center font-semibold'>Status</h1>
            {activeTabs === 'In Review' && <h1 className='lg:text-sm 2xl:text-base w-1/6 text-center font-semibold '>Time Transfered</h1>}
            {activeTabs === 'Drafting' && <h1 className='lg:text-sm 2xl:text-base w-1/6 text-center font-semibold '>Time Created</h1>}
            {activeTabs.includes('Returned') && <h1 className='lg:text-sm 2xl:text-base w-1/6 text-center font-semibold'>Time Returned</h1>}
          </div>
          <div className="w-full flex-1 overflow-y-auto rounded-lg">
            {Object.entries(getFilteredDocuments()).length > 0 ? (
              <PaginatedList items={sortTimeCreatedDesc(getFilteredDocuments())} type={'4'} activeTab={activeTabs} paginationFor={'DV'}/>
            ) : (
              <div className='w-full h-full flex items-center justify-center'>
                <p className='font-bold'>No Disbursement Voucher Found</p>
              </div>
            )}
          </div>
        </div>
        {isModalOpen && (
          <>
            <div className="fixed inset-0 z-20 bg-black opacity-50" onClick={modal} />
            <div className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-end">
              <DisbursementVoucher modal={modal} flag={false}/>
            </div>
          </>
        )}
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