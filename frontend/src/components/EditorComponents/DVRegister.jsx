import { useState, useEffect } from "react"
import {Outlet, useParams} from 'react-router-dom'

import { useSelector } from "react-redux";

import { IoSearchSharp } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";

import PaginatedList from "../Pagination/PaginatedList";
import DVRegisterItems from "./DVRegisterItems";

const DVRegister = () => {
    const [activeTab, setActiveTabs] = useState('501 COB') 
    const { id } = useParams()
    const [search, setSearch]= useState('')
    const [searchModal, setSearchModal] = useState(false)
    const [filteredDocuments, setFilteredDocuments] = useState({})
    const [documents, setDocuments] = useState({})
    const DV = useSelector((state) => state.vouchers)

    useEffect(() => {
        if(DV && Object.entries(DV).length > 0) {
            const filteredResults = Object.entries(DV).filter(([, document]) => document.data.fund === activeTab)
            setDocuments(Object.fromEntries(filteredResults))
            setFilteredDocuments(Object.fromEntries(filteredResults))
        } else {
            setFilteredDocuments({})
        }
    }, [activeTab, DV])

    useEffect(() => {
        if(filteredDocuments && Object.entries(filteredDocuments).length > 0) {
            const filteredResults = Object.entries(filteredDocuments).filter(([,document]) => document.data.payee.toLowerCase().includes(search.toLowerCase()) || document.data.DV.toLowerCase().includes(search.toLowerCase()))
            setDocuments(Object.fromEntries(filteredResults))
        } else {
            setDocuments({})
        }
    }, [search, filteredDocuments])

    const sortTimeCreatedDesc = (docu) => {
        if (docu && Object.keys(docu).length > 0) {
          const sortedEntries = Object.entries(docu).sort(([, a], [, b]) => 
            new Date(b.data.createdAt) - new Date(a.data.createdAt)
          );
          return Object.fromEntries(sortedEntries);
        } else {
          return {}
        }
    }

  return (
    <section className="w-full h-full p-2 text-gray-500 relative">
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
        <div className="w-full h-[10%] pt-2 flex items-center justify-between">
            <div className="flex items-center justify-center gap-1 text-sm sm:text-base">
                <button onClick={() => setActiveTabs('501 COB')} className={`${activeTab === '501 COB' ? 'text-preparerPrimary border-b-2 border-preparerPrimary' : ''} px-1 py-2 hover:text-preparerPrimary hover:border-b-2 hover:border-preparerPrimary transition-all duration-100`}>501 COB</button>
                <button onClick={() => setActiveTabs('501 LFP')} className={`${activeTab === '501 LFP' ? 'text-preparerPrimary border-b-2 border-preparerPrimary' : ''} px-1 py-2 hover:text-preparerPrimary hover:border-b-2 hover:border-preparerPrimary transition-all duration-100`}>501 LFP</button>
                <button onClick={() => setActiveTabs('501 CARP')} className={`${activeTab === '501 CARP' ? 'text-preparerPrimary border-b-2 border-preparerPrimary' : ''} px-1 py-2 hover:text-preparerPrimary hover:border-b-2 hover:border-preparerPrimary transition-all duration-100`}>501 CARP</button>
                <button onClick={() => setActiveTabs('Farming Support Services Program')} className={`${activeTab === 'Farming Support Services Program' ? 'text-preparerPrimary border-b-2 border-preparerPrimary' : ''} px-1 py-2 hover:text-preparerPrimary hover:border-b-2 hover:border-preparerPrimary transition-all duration-100`}>Farming Support Services Program</button>
            </div>
            <div>
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
        <div className="w-full h-[90%] overflow-x-auto py-2">
            <div className="min-w-max w-full h-full flex flex-col">
                <div className="w-auto h-auto rounded-lg hidden sm:flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
                    <p className="w-36 h-full font-bold flex items-center justify-center">PR No. Date</p>
                    <p className="w-24 h-full font-bold flex items-center justify-center">PR No.</p>
                    <p className="w-36 h-full font-bold flex items-center justify-center">PO No. Date</p>
                    <p className="w-36 h-full font-bold flex items-center justify-center">BUR Date</p>
                    <p className="w-24 h-full font-bold flex items-center justify-center">BUR No.</p>
                    <p className="w-36 h-full font-bold flex items-center justify-center">DV Date</p>
                    <p className="w-60 h-full font-bold flex items-center justify-center">DV No.</p>
                    <p className="w-80 h-full font-bold flex items-center justify-center">Payee</p>
                    <p className="w-[420px] h-full font-bold flex items-center justify-center">Particulars</p>
                    <div className="w-[500px] h-full flex flex-col">
                        <p className="text-center py-1">Obligations</p>
                        <div className="flex py-1">
                            <p className="w-1/4 text-center">ASA No.</p>
                            <p className="w-1/4 text-center">Project Name</p>
                            <p className="w-1/4 text-center">Category</p>
                            <p className="w-1/4 text-center">ASA Amount</p>
                        </div>
                    </div>
                    <div className="w-auto h-full flex flex-col">
                        <p className="text-center py-1">Obligations</p>
                        <div className="flex py-1">
                            <p className="w-28 text-center">ADA-1st</p>
                            <p className="w-28 text-center">ADA-2nd</p>
                            <p className="w-28 text-center">Remittance</p>
                            <p className="w-28 text-center">ASA Amount</p>
                            <p className="w-28 text-center">ASA No.</p>
                            <p className="w-28 text-center">Project Name</p>
                            <p className="w-28 text-center">Category</p>
                            <p className="w-28 text-center">ASA Amount</p>
                            <p className="w-28 text-center">ASA No.</p>
                            <p className="w-28 text-center">Project Name</p>
                            <p className="w-28 text-center">Category</p>
                            <p className="w-28 text-center">ASA Amount</p>
                            <p className="w-28 text-center">ASA No.</p>
                            <p className="w-28 text-center">Project Name</p>
                            <p className="w-28 text-center">Category</p>
                            <p className="w-28 text-center">ASA Amount</p>
                            <p className="w-28 text-center">ASA No.</p>
                            <p className="w-28 text-center">Project Name</p>
                        </div>
                    </div>
                    <p></p>
                    <p></p>
                    <p></p>
                    <p></p>
                    <p></p>
                    <p></p>
                </div>
                <div className="w-full flex-1 overflow-y-auto rounded-lg">
                    {Object.entries(documents).length > 0 ? (
                        //<PaginatedList items={sortTimeCreatedDesc(documents)} paginationFor="DVRegister"/>
                        Object.entries(sortTimeCreatedDesc(documents)).map(([key, document], index) => 
                            <DVRegisterItems key={key} index={index} DV={document}/>
                        )
                    ) : (
                        <div className='w-full h-full flex items-center justify-center'>
                            <p className='font-bold'>No Disbursement Voucher Found</p>
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
    </section>
  )
}

export default DVRegister