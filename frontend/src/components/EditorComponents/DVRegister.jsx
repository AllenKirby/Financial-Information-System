import { useState, useEffect } from "react"
import {Outlet, useParams} from 'react-router-dom'

import { useSelector } from "react-redux";

import { IoSearchSharp } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

import PaginatedList from "../Pagination/PaginatedList";

const DVRegister = () => {
    const [activeTab, setActiveTabs] = useState('501 COB') 
    const { id } = useParams()
    const [search, setSearch]= useState('')
    const [searchModal, setSearchModal] = useState(false)
    const [filteredDocuments, setFilteredDocuments] = useState({})
    const [documents, setDocuments] = useState({})
    const DV = useSelector((state) => state.vouchers)
    const [counter, setCounter] = useState(1)

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

    const increment = () => {
        setCounter(prevCounter => prevCounter + 1)
    }

    const decrement = () => {
        setCounter(prevCounter => prevCounter - 1)
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
        <div className="w-full h-[90%] py-2">
            <div className="w-full h-full flex flex-col">
                <div className="w-auto h-auto rounded-lg hidden sm:flex items-center justify-between bg-gray-100 text-gray-400 text-sm">
                    <button onClick={decrement} disabled={counter === 1} className="w-fit px-2 h-full"><MdNavigateBefore size={24}/></button>
                    <div className="w-full flex items-center justify-center">
                        <p className="w-1/6 py-2 text-center font-semibold">DV No.</p>
                        {counter === 1 && (
                            <>
                                <p className="w-1/6 py-2 text-center font-semibold">PR No. Date</p>
                                <p className="w-1/6 py-2 text-center font-semibold">PR No.</p>
                                <p className="w-1/6 py-2 text-center font-semibold">PO No. Date</p>
                                <p className="w-1/6 py-2 text-center font-semibold">PO No.</p>
                                <p className="w-1/6 py-2 text-center font-semibold">BUR Date</p>
                            </>
                        )}
                        {counter === 2 && (
                            <>
                                <p className="w-1/6 py-2 text-center font-semibold">BUR No.</p>
                                <p className="w-1/6 py-2 text-center font-semibold">DV Date</p>
                                <p className="w-1/6 py-2 text-center font-semibold">Payee</p>
                                <p className="w-2/6 py-2 text-center font-semibold">Particulars</p>
                            </>
                        )}
                        {counter === 3 && (
                            <div className="w-5/6 flex flex-col">
                                <div className="w-full text-center">
                                    <p className="py-2 text-center font-semibold">Obligation</p>
                                </div>
                                <div className="w-full flex">
                                    <p className="w-1/4 py-2 text-center font-semibold">ASA No.</p>
                                    <p className="w-1/4 py-2 text-center font-semibold">Project Name</p>
                                    <p className="w-1/4 py-2 text-center font-semibold">Category</p>
                                    <p className="w-1/4 py-2 text-center font-semibold">ASA Amount</p>
                                </div>
                            </div>
                        )}
                        {counter === 4 && (
                            <div className="w-5/6 flex flex-col">
                                <div className="w-full text-center">
                                    <p className="py-2 text-center font-semibold">Obligation</p>
                                </div>
                                <div className="w-full flex">
                                    <p className="w-1/5 py-2 text-center font-semibold">ADA-1st </p>
                                    <p className="w-1/5 py-2 text-center font-semibold">ADA-2nd</p>
                                    <p className="w-1/5 py-2 text-center font-semibold">Remittance</p>
                                    <p className="w-1/5 py-2 text-center font-semibold">BIR</p>
                                    <p className="w-1/5 py-2 text-center font-semibold">GSIS</p>
                                </div>
                            </div>
                        )}
                        {counter == 5 && (
                            <div className="w-5/6 flex flex-col">
                                <div className="w-full text-center">
                                    <p className="py-2 text-center font-semibold">Obligation</p>
                                </div>
                                <div className="w-full flex">
                                    <p className="w-1/5 py-2 text-center font-semibold">GSIS Loan</p>
                                    <p className="w-1/5 py-2 text-center font-semibold">Landbank</p>
                                    <p className="w-1/5 py-2 text-center font-semibold">Disallowance</p>
                                    <p className="w-1/5 py-2 text-center font-semibold">HDMF</p>
                                    <p className="w-1/5 py-2 text-center font-semibold">HDMF Loan</p>
                                </div>
                            </div>
                        )}
                        {counter === 6 && (
                            <div className="w-5/6 flex flex-col">
                                <div className="w-full text-center">
                                    <p className="py-2 text-center font-semibold">Obligation</p>
                                </div>
                                <div className="w-full flex">
                                    <p className="w-1/5 py-2 text-center font-semibold">PHIC</p>
                                    <p className="w-1/5 py-2 text-center font-semibold">NIAEASP-RO</p>
                                    <p className="w-1/5 py-2 text-center font-semibold">NIAEASP-DO</p>
                                    <p className="w-1/5 py-2 text-center font-semibold">NIAEASP-Dues</p>
                                    <p className="w-1/5 py-2 text-center font-semibold">COOP</p>
                                </div>
                            </div>
                        )}
                        {counter === 7 && (
                            <div className="w-5/6 flex flex-col">
                                <div className="w-full text-center">
                                    <p className="py-2 text-center font-semibold">Obligation</p>
                                </div>
                                <div className="w-full flex">
                                    <p className="w-1/3 py-2 text-center font-semibold">Total</p>
                                    <p className="w-1/3 py-2 text-center font-semibold">Cash</p>
                                    <p className="w-1/3 py-2 text-center font-semibold">BIR-Others</p>
                                </div>
                            </div>
                        )}
                        {counter === 8 && (
                            <div className="w-5/6 flex flex-col">
                                <div className="w-full text-center">
                                    <p className="py-2 text-center font-semibold">I.M.O.</p>
                                </div>
                                <div className="w-full flex">
                                    <p className="w-1/4 py-2 text-center font-semibold">ASA Total</p>
                                    <p className="w-1/4 py-2 text-center font-semibold">ASA Releases</p>
                                    <p className="w-1/4 py-2 text-center font-semibold">Cash Total</p>
                                    <p className="w-1/4 py-2 text-center font-semibold">Cash Releases</p>
                                </div>
                            </div>
                        )}
                        {counter === 9 && (
                            <div className="w-5/6 flex">
                                <p className="w-1/2 py-2 text-center font-semibold">Check Date</p>
                                <p className="w-1/2 py-2 text-center font-semibold">Check No.</p>
                            </div>
                        )}
                    </div>
                    <button onClick={increment} disabled={counter === 9} className="w-fit px-2 h-full"><MdNavigateNext size={24}/></button>
                </div>
                <div className="w-full flex-1 overflow-y-auto rounded-lg">
                    {Object.entries(documents).length > 0 ? (
                        <PaginatedList items={sortTimeCreatedDesc(documents)} paginationFor="DVRegister" counter={counter}/>
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