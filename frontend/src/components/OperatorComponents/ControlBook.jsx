import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { Outlet, useParams } from "react-router-dom"

import AddControlBook from "./AddControlBook"
import {useAuthContext} from '../../hooks/useAuthContext'

import { IoSearchSharp ,IoAdd } from "react-icons/io5";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";
import { IoIosClose } from "react-icons/io";

import PaginatedList from "../Pagination/PaginatedList"

const ControlBook = () => {
  const [controlBookFlag, setControlBookFlag] = useState(false)
  const [CBStatus, setCBStatus] = useState('active')
  const [filteredCB, setFilteredCB] = useState({})
  const [filterFlag, setFilterFlag] = useState(false)
  const [filter, setFilter] = useState('')
  const [searchModal, setSearchModal] = useState(false)
  const [search, setSearch] = useState('')

  const controlBooks = useSelector((state) => state.controlBook)
  const { user } = useAuthContext()

  const { id } = useParams()

  const modal = () => setControlBookFlag(!controlBookFlag)

  const filterModal = (value) => {
    setFilter(value)
    setFilterFlag(!filterFlag)
  }

  useEffect(() => {
   if(controlBooks && Object.entries(controlBooks).length > 0) {
    const filteredResults = Object.entries(controlBooks).filter(([, controlBook]) => controlBook.cbStatus === CBStatus)
    const filteredFundCluster = filteredResults.filter((document ,) =>
        document[1]?.FundCluster?.toLowerCase().includes(filter.toLowerCase())
      )
    const filteredSearch = filteredFundCluster.filter((controlbook,) => controlbook[1]?.ASANo?.toLowerCase().includes(search.toLowerCase()))
    setFilteredCB(Object.fromEntries(filteredSearch))
   }else{
    setFilteredCB({})
   }
  }, [CBStatus, controlBooks, filter, search])

  const sortCreatedAtDesc = (docu) => {
    if (docu && Object.keys(docu).length > 0) {
      const sortedEntries = Object.entries(docu).sort(([, a], [, b]) => {
        const parsedA = a.createdAt ? a.createdAt : null;
        const parsedB = b.createdAt ? b.createdAt : null;
        return new Date(parsedB) - new Date(parsedA)
      });
      return Object.fromEntries(sortedEntries)
    } else {
      return {} 
    }
  }

  return (
    <section className="w-full h-full p-2 flex flex-col text-gray-500 relative">
      {!id ? (
        <>
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
          <div className="w-full h-auto flex items-end justify-between py-2">
            <button 
              onClick={modal}
              className={`${user?.role === '3' ? 'bg-fundingBlueGreen' : 'bg-preparerPrimary'} px-3 py-2 rounded-lg text-white flex items-center justify-center gap-2`}
              > <IoAdd/> <span className="hidden sm:block">New</span>
            </button>
            <div className="flex space-x-2">
              <div className='relative'>
                <button onClick={() => setFilterFlag(!filterFlag)} className='flex relative truncate bg-white z-10 w-fit items-center justify-center gap-2 px-2 py-2 border-2 rounded-lg text-sm 2xl:text-base'>
                  <HiAdjustmentsHorizontal 
                    size={18}/>
                    {filter ? <> <span className='hidden sm:block'>{filter}</span> <RxCross2 onClick={() => setFilter('')}/></> : <span className='hidden sm:hidden md:hidden lg:hidden xl:block'>Filter by Fund Cluster</span>}
                </button>
                {filterFlag && (
                  <>
                    <div className="fixed inset-0 z-0" onClick={() => setFilterFlag(!filterFlag)}/>
                    <div className='absolute w-24 sm:w-28 md:w-32 lg:w-full bg-white right-0 top-10 z-50 p-1 border-[1px] text-xs lg:text-sm'>
                      <div onClick={() => filterModal('501 COB')} className='text-center mt-1 hover:bg-slate-100 cursor-pointer py-1 text-sm'>501 COB</div>
                      <div onClick={() => filterModal('501 LFP')} className='text-center mt-1 hover:bg-slate-100 cursor-pointer py-1 text-sm'>501 LFP</div>
                      <div onClick={() => filterModal('501 CARP')} className='text-center mt-1 hover:bg-slate-100 cursor-pointer py-1 text-sm'>501 CARP</div>
                      <div onClick={() => filterModal('Contract Farming')} className='text-center mt-1 hover:bg-slate-100 cursor-pointer py-1 text-sm'>Farming Support Services Program</div>
                    </div>
                  </>
                )}
              </div>
              <select
              onChange={(e) => setCBStatus(e.target.value)} 
              className="px-3 py-2 border rounded-lg bg-white shadow-sm">
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
                <option value="ended">Ended</option>
              </select>
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
          <div className="w-full flex-1 overflow-y-auto">
            {Object.entries(filteredCB).length > 0 ? (
              <PaginatedList items={sortCreatedAtDesc(filteredCB)} paginationFor="ControlBook"/>
              ) : (
                <div className='w-full h-full flex items-center justify-center'>
                  <p className='font-bold'>No Control Book Found</p>
                </div>
              )
            }
          </div>
          {controlBookFlag && (
            <>
              <div 
                className="fixed inset-0 z-40 bg-black opacity-50" 
                onClick={modal} 
              />
              <div className="fixed z-50 left-0 top-0 w-full h-full flex items-center justify-center">
                <AddControlBook modal={modal} flag={false}/>
              </div>
            </>
          )}
        </>
      ) : <Outlet/>}
    </section>
  )
}

export default ControlBook
