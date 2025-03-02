import { useState, useEffect, useMemo } from "react"
import {Outlet, useParams} from 'react-router-dom'

import { useSelector } from "react-redux";

import { IoSearchSharp } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { PiExport } from "react-icons/pi";

import PaginatedList from "../Pagination/PaginatedList";
import { useAuthContext } from "../../hooks/useAuthContext";
import { usePreparerHook } from "../../hooks/usePreparerHook";
import DVRegisterModal from "./DVRegisterModal";

const DVRegister = () => {
    const [activeTab, setActiveTabs] = useState('501 COB') 
    const { id } = useParams()
    const [search, setSearch]= useState('')
    const [searchModal, setSearchModal] = useState(false)
    const [filteredDocuments, setFilteredDocuments] = useState({})
    const [documents, setDocuments] = useState({})
    const DV = useSelector((state) => state.vouchers)
    const [counter, setCounter] = useState(1)
    const { user } = useAuthContext()
    const { exportDVRegister, isLoading } = usePreparerHook()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [data, setData] = useState({})
    const [date, setDate] = useState({start: '',end: ''});
    const [total, setTotal] = useState({
        ASA: 0, 
        ADAfirst: 0, 
        ADAsecond: 0, 
        cash: 0, 
        ASATotal: 0, 
        ASAReleases: 0, 
        cashTotal: 0, 
        cashReleases: 0
    })

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
    
        // First day of the current month
        const firstDay = new Date(year, month, 1);
        // Last day of the current month
        const lastDay = new Date(year, month + 1, 0);
    
        // Format date to YYYY-MM-DD correctly
        const formatDate = (date) => date.toLocaleDateString("en-CA");
    
        setDate({start: formatDate(firstDay), end: formatDate(lastDay)});
        extractMonthYear()
      }, []);

      const extractMonthYear = (startDate, endDate) => {
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
    
          const startMonth = start.toLocaleString("default", { month: "long" });
          const startYear = start.getFullYear();
    
          const endMonth = end.toLocaleString("default", { month: "long" });
          const endYear = end.getFullYear();

          const date = [`${startMonth} ${startYear}`, `${endMonth} ${endYear}`]

          return date
        }
      };

    const formatToPeso = (value) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(value);
    };

    const modal = (data = {}) => {
        setIsModalOpen(!isModalOpen)
        setData(data)
    }

    const approvedDV = useMemo(() => {
        return Object.fromEntries(
            Object.entries(DV).filter(([, vouchers]) => vouchers.data.status === "Approved")
        );
    }, [DV]);

    useEffect(() => {
        if(approvedDV && Object.entries(approvedDV).length > 0) {
            const filteredResults = Object.entries(approvedDV).filter(([, document]) => document?.data?.fund === activeTab)
            setDocuments(Object.fromEntries(filteredResults))
            setFilteredDocuments(Object.fromEntries(filteredResults));
        } else {
            setFilteredDocuments({});
        }
    }, [activeTab, approvedDV])

    useEffect(() => {
        if(filteredDocuments && Object.entries(filteredDocuments).length > 0) {
            const filteredResults = Object.entries(filteredDocuments).filter(([,document]) => document?.data?.payee?.toLowerCase().includes(search.toLowerCase()) || document?.data?.DV?.toLowerCase().includes(search.toLowerCase()))
            setDocuments(Object.fromEntries(filteredResults))
        } else {
            setDocuments({})
        }
    }, [search, filteredDocuments])

    const sortTimeCreatedDesc = (docu) => {
        if (docu && Object.keys(docu).length > 0) {
            const startDate = new Date(date.start);
            const endDate = new Date(date.end);

            const filteredDocuments = Object.entries(docu).filter(([, document]) => {
                const docDate = new Date(document?.data?.date);
                return docDate >= startDate && docDate <= endDate;
            });

            const sortedEntries = filteredDocuments.sort(([, a], [, b]) => 
                new Date(b?.data?.createdAt) - new Date(a?.data?.createdAt)
            );
            return Object.fromEntries(sortedEntries);
        } else {
          return {}
        }
    }

    console.log(sortTimeCreatedDesc())

    const increment = () => {
        setCounter(prevCounter => prevCounter + 1)
    }

    const decrement = () => {
        setCounter(prevCounter => prevCounter - 1)
    }

    const exportDV = async() => {
        const [startDate, endDate] = extractMonthYear(date.start, date.end) 
        let reportMonth = ''
        if(startDate === endDate) {
            reportMonth = startDate
        } else {
            reportMonth = `${startDate} to ${endDate}`
        }

        const header = {
            fundCluster: activeTab,
            month: reportMonth,
        }

        const dataDV = Object.entries(documents).map(([, data]) => {
            const { PRNoDate, PRNo, PONODate, PONO, BURDate, ADAfirst, ADASecond, checkDate, checkNo, ORSBURS, date, DV,
                payee, particular, ASA, amount
             } = data.data

             const ASANo = Object.keys(ASA).map((item,) => item.split('!')[0].replace("|", ' '))
             const projectName = Object.keys(ASA).map((item,) => item.split(',')[1].split('>')[0])
             const category = Object.keys(ASA).map((item,) => item.split(',')[1].split('>')[1])
             const ASAAmount = Object.values(ASA).map((item,) => item)
            return {
                PRNoDate, 
                PRNo, 
                PONODate, 
                PONO, 
                BURDate, 
                BURNo: ORSBURS?.split('-')[3] || '',
                DVDate: date,
                DV,
                payee, 
                particular,
                ASANo,
                projectName,
                category,
                ASAAmount,
                ADAfirst, 
                ADASecond,
                cash: amount,
                ASATotal: 0,
                ASAReleases: 0,
                cashTotal: 0,
                cashReleases: 0,
                checkDate, 
                checkNo
            }
        })

        const data= {
            DV: dataDV,
            header: header
        }

        await exportDVRegister(data)
    }

    const sumOfASA = () => {
        const ASA = Object.entries(documents).map((item,) => Object.values(item[1].data.ASA))
        const innerSums = ASA.map((arr) => arr.reduce((sum, num) => sum + Number(num), 0));
        return innerSums.reduce((sum, num) => sum + num, 0);
    }

    const sumOfADAFirst = () => {
        const ADAFirst = Object.entries(documents).map((item,) => item[1].data.ADAfirst)
        return ADAFirst.reduce((sum, num) => sum + Number(num), 0);
    }

    const sumOfADASecond = () => {
        const ADASecond = Object.entries(documents).map((item,) => item[1].data.ADASecond)
        return ADASecond.reduce((sum, num) => sum + Number(num), 0);
    }

    const sumOfCash = () => {
        const cash = Object.entries(documents).map((item,) => parseFloat(item[1].data.amount))
        return cash.reduce((sum, num) => sum + num, 0);
    }

    useEffect(() => {
        //ASA
        setTotal({
            ASA: formatToPeso(sumOfASA()),
            ADAfirst: formatToPeso(sumOfADAFirst()), 
            ADAsecond: formatToPeso(sumOfADASecond()), 
            cash: formatToPeso(sumOfCash()),  
            ASATotal: formatToPeso(sumOfASA()),
            ASAReleases: formatToPeso(sumOfASA()), 
            cashTotal: formatToPeso(sumOfASA()), 
            cashReleases: formatToPeso(sumOfASA())
        })
    }, [documents])

  return (
    <section className="w-full h-full p-2 text-gray-500 relative flex flex-col">
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
        <div className="w-full h-fit flex flex-col items-center justify-between gap-2">
            <div className="w-full flex items-center justify-end gap-2">
                <label>Start:</label>
                <input
                    type="date"
                    value={date.start}
                    onChange={(e) => setDate({...date, start: e.target.value})}
                    className={`${user?.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 text-sm w-40 px-4 py-1 rounded-md border-2`}/>
                <label>End:</label>
                <input  
                    type="date"
                    value={date.end}
                    onChange={(e) => setDate({...date, end: e.target.value})}
                    className={`${user?.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 text-sm w-40 px-4 py-1 rounded-md border-2`}/>
                <button onClick={exportDV} disabled={isLoading} className={`${user?.role === '4' ? 'bg-preparerPrimary' : 'bg-fundingBlueGreen'} text-white px-5 py-2 rounded-lg flex items-center justify-center gap-2`}><PiExport size={20}/>Export</button>
            </div>
            <div className="w-full flex items-center justify-between">
                <div className="w-fit flex items-center justify-center gap-1 text-sm sm:text-base">
                    <button onClick={() => setActiveTabs('501 COB')} className={`${activeTab === '501 COB' ? 'text-preparerPrimary border-b-2 border-preparerPrimary' : ''} px-1 py-2 hover:text-preparerPrimary hover:border-b-2 hover:border-preparerPrimary transition-all duration-100`}>501 COB</button>
                    <button onClick={() => setActiveTabs('501 LFP')} className={`${activeTab === '501 LFP' ? 'text-preparerPrimary border-b-2 border-preparerPrimary' : ''} px-1 py-2 hover:text-preparerPrimary hover:border-b-2 hover:border-preparerPrimary transition-all duration-100`}>501 LFP</button>
                    <button onClick={() => setActiveTabs('501 CARP')} className={`${activeTab === '501 CARP' ? 'text-preparerPrimary border-b-2 border-preparerPrimary' : ''} px-1 py-2 hover:text-preparerPrimary hover:border-b-2 hover:border-preparerPrimary transition-all duration-100`}>501 CARP</button>
                    <button onClick={() => setActiveTabs('Contract Farming')} className={`${activeTab === 'Farming Support Services Program' ? 'text-preparerPrimary border-b-2 border-preparerPrimary' : ''} px-1 py-2 hover:text-preparerPrimary hover:border-b-2 hover:border-preparerPrimary transition-all duration-100`}>Farming Support Services Program</button>
                </div>
                <div className="w-fit">
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
        </div>
        <div className="w-full flex-1 py-2">
            <div className="w-full h-full flex flex-col">
                <div className="w-auto h-auto rounded-lg flex items-center justify-between bg-gray-100 text-gray-400 text-sm">
                    <button onClick={decrement} disabled={counter === 1} className="w-fit px-2 h-full"><MdNavigateBefore size={24}/></button>
                    <div className="w-full hidden sm:flex items-end justify-center">
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
                                    <p className="py-2 text-center font-semibold">RO Payroll</p>
                                </div>
                                <div className="w-full flex">
                                    <p className="w-1/3 py-2 text-center font-semibold">ADA-1st </p>
                                    <p className="w-1/3 py-2 text-center font-semibold">ADA-2nd</p>
                                    <p className="w-1/3 py-2 text-center font-semibold">Cash</p>
                                </div>
                            </div>
                        )}
                        {counter === 5 && (
                            <div className="w-5/6 flex">
                                <p className="w-1/4 py-2 text-center font-semibold">ASA Total</p>
                                <p className="w-1/4 py-2 text-center font-semibold">ASA Releases</p>
                                <p className="w-1/4 py-2 text-center font-semibold">Cash Total</p>
                                <p className="w-1/4 py-2 text-center font-semibold">Cash Releases</p>
                            </div>
                        )}
                        {counter === 6 && (
                            <div className="w-5/6 flex">
                                <p className="w-1/4 py-2 text-center font-semibold">Check Date</p>
                                <p className="w-1/4 py-2 text-center font-semibold">Check No.</p>
                            </div>
                        )}
                    </div>
                    <button onClick={increment} disabled={counter === 6} className="w-fit px-2 h-full"><MdNavigateNext size={24}/></button>
                </div>
                <div className="w-full flex-1 overflow-y-auto rounded-lg">
                    {Object.entries(sortTimeCreatedDesc(documents)).length > 0 ? (
                        <PaginatedList 
                            items={sortTimeCreatedDesc(documents)} 
                            paginationFor="DVRegister" 
                            counter={counter} 
                            modal={modal}
                            total={total}/>
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
        {isModalOpen && (
            <>
                <div className="fixed inset-0 z-20 bg-black opacity-50" />
                <div className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
                    <DVRegisterModal modal={modal} DVData={data}/>
                </div>
            </>
        )}
    </section>
  )
}

export default DVRegister