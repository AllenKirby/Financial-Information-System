import { useEffect, useState } from "react"
import { IoIosClose, IoMdSearch } from "react-icons/io"
import { IoAdd  } from "react-icons/io5";
import { useSelector } from "react-redux"
import PaginatedList from "../Pagination/PaginatedList"
import DisbursementVoucher from '../EditorComponents/DisbursementVoucher';
import { Outlet, useParams } from "react-router-dom"
import { useAuthContext } from "../../hooks/useAuthContext";

import { MdOutlineDrafts, MdKeyboardReturn } from "react-icons/md";
import { FiLayers } from "react-icons/fi";
import { LuFileSearch, LuFileCheck } from "react-icons/lu";
import { BsListTask } from "react-icons/bs";

const BURRecords = () => {
  const [search, setSearch] = useState('')
  const {id} = useParams()
  const [searchModal, setSearchModal] = useState('')
  const BURRecords = useSelector((state) => state.burRecords)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTabs, setActiveTabs] = useState('')
  const [filteredDocuments, setFilteredDocuments] = useState([])
  const { user } = useAuthContext()
  const permission = useSelector((state) => state.permission)

  useEffect(() => {
    const filteredBUR = BURRecords.filter((item) => item.status.includes(activeTabs))
    const searchedBUR = filteredBUR.filter((item) => item.payee.toLowerCase().includes(search.toLowerCase()))
    setFilteredDocuments(searchedBUR)
  }, [BURRecords, activeTabs, search])

  const modal = () => setIsModalOpen(!isModalOpen)

  return (
    <section className="w-full h-full flex flex-col">
      <div className={`${searchModal ? ' block h-auto' : 'hidden'} h-fit absolute py-5 bg-white z-20 top-0 left-0 w-full block overflow-hidden sm:hidden transition-all duration-100`}>
        <div className='flex items-center justify-center gap-2 px-3'>
          <div className='w-5/6 relative'>
            <IoMdSearch size={20} className='absolute top-[10px] left-4 text-gray-400'/>
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
      <div className='w-full h-fit flex items-center justify-between gap-2'>
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setActiveTabs('')} className={`${!activeTabs ? 'border-b-2 border-preparerPrimary text-preparerPrimary font-bold' : ''} flex items-center justify-center gap-2 px-3 py-2 text-gray-500 hover:border-b-2 hover:text-preparerPrimary hover:font-bold hover:border-preparerPrimary transition-all duration-100`}><FiLayers size={20}/><span className='hidden lg:block'>All</span></button>
          {user?.role === '2' && (<button onClick={() => setActiveTabs('Under Review')} className={`${activeTabs === 'Under Review' ? 'border-b-2 border-BOGreen text-BOGreen font-bold' : ''} flex items-center justify-center gap-2 px-3 py-2 text-gray-500 hover:border-b-2 hover:text-BOGreen hover:font-bold hover:border-BOGreen transition-all duration-100`}><LuFileSearch size={20}/><span className='hidden lg:block'>Under Review</span></button>)}
          {(user?.role === '3' || permission?.data?.permission && permission?.data?.roleName === 'Preparer') && (<button onClick={() => setActiveTabs('Drafting')} className={`${activeTabs === 'Drafting' ? 'border-b-2 border-preparerPrimary text-preparerPrimary font-bold' : ''} flex items-center justify-center gap-2 px-3 py-2 text-gray-500 hover:border-b-2 hover:text-preparerPrimary hover:font-bold hover:border-preparerPrimary transition-all duration-100`}><MdOutlineDrafts size={20}/><span className='hidden lg:block'>Drafting</span></button>)}
          {(user?.role === '1' || permission?.data?.permission && permission?.data?.roleName === 'Budget Officer') && (
            <>
              <button onClick={() => setActiveTabs('For Approval')} className={`${activeTabs === 'For Approval' ? 'border-b-2 border-customgreen text-customgreen font-bold' : ''} flex items-center justify-center gap-2 px-3 py-2 text-gray-500 hover:border-b-2 hover:text-customgreen hover:font-bold hover:border-customgreen transition-all duration-100`}><BsListTask size={20}/><span className='hidden lg:block'>For Approval</span></button>
              <button onClick={() => setActiveTabs('Approved')} className={`${activeTabs === 'Approved' ? 'border-b-2 border-customgreen text-customgreen font-bold' : ''} flex items-center justify-center gap-2 px-3 py-2 text-gray-500 hover:border-b-2 hover:text-customgreen hover:font-bold hover:border-customgreen transition-all duration-100`}><LuFileCheck size={20}/><span className='hidden lg:block'>Approved</span></button>
            </>
          )}
          {user?.role !== '1' && (<button onClick={() => setActiveTabs('Returned')} className={`${activeTabs.includes('Returned') ? 'border-b-2 border-preparerPrimary text-preparerPrimary font-bold' : ''} flex items-center justify-center gap-2 px-3 py-2 text-gray-500 hover:border-b-2 hover:text-preparerPrimary hover:font-bold hover:border-preparerPrimary transition-all duration-100`}><MdKeyboardReturn size={20}/><span className='hidden lg:block'>Returned</span></button>)}
        </div>
        <div className="flex items-center justify-center gap-2">
          {(user?.role === '3' || user?.role === '4') && (
            <button onClick={modal} className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm 2xl:text-base bg-preparerPrimary text-white ">
              <IoAdd size={20} className='font-bold'/> <span className='hidden lg:block'>New</span>
            </button>
          )}
          <div className='relative w-auto hidden sm:block'>
            <IoMdSearch size={20} className='absolute top-[10px] left-4 text-gray-400'/>
            <input 
              type="search"
              placeholder='Search'
              onChange={(e) => setSearch(e.target.value)}
              className='w-14 sm:w-auto py-2 text-sm 2xl:text-base pl-10 placeholder-transparent sm:placeholder-gray-500 rounded-lg focus:outline-none border-2' />
          </div>
        </div>
        <button onClick={() => setSearchModal(!searchModal)} className='block sm:hidden'>
          <IoMdSearch size={38} className='border-2 rounded-lg px3 py-2 text-gray-400'/>
        </button>
      </div>
      <div className="w-full h-full p-2">
        <div className="w-full h-full flex flex-col">
          <div className="w-full h-fit py-2 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 font-bold text-sm">
            <div className={`${activeTabs ? 'w-1/4' : 'w-2/4'} px-4`}>Payee</div>
            <div className="w-1/4 text-center">GAA</div>
            <div className="w-1/4 text-center">Status</div>
            {activeTabs === 'Drafting' && (<div className="w-1/4 text-center">Time Created</div>)}
            {activeTabs === 'Returned' && (<div className="w-1/4 text-center">Time Returned</div>)}
            {activeTabs === 'Approved' && (<div className="w-1/4 text-center">Time Approved</div>)}
            {(activeTabs === 'Under Review' || activeTabs === 'For Approval') && (<div className="w-1/4 text-center">Time Transferred</div>)}
          </div>
          <div className="w-full h-full py-2">
            {filteredDocuments.length > 0 ? (
              <PaginatedList paginationFor="BUR" items={filteredDocuments} activeTab={activeTabs}/>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="font-bold">No BUR Found</p>
              </div>
            )}
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
      {isModalOpen && (
        <>
          <div className="fixed inset-0 z-20 bg-black opacity-50" onClick={modal} />
          <div className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-end">
            <DisbursementVoucher modal={modal} flag={false}/>
          </div>
        </>
      )}
    </section>
  )
}

export default BURRecords