import { useEffect, useState } from "react"
import { firestore } from "../config/firebase-config";
import { doc, onSnapshot } from "firebase/firestore";

import { IoSearchSharp } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { IoIosClose } from "react-icons/io";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";

const HistoryLogs = () => {
    const [historyLogs, setHistoryLogs] = useState(null)
    const [filteredLogs, setFilteredLogs] = useState(null)
    const [selectedDate, setSelectedDate] = useState('')
    const [filterFlag, setFilterFlag] = useState(false)
    const [dateRange, setDateRange] = useState({start: '', end: ''})
    const [search, setSearch] = useState('')
    const [searchModal, setSearchModal] = useState(false)

    const filterModal = (value) => {
        setSelectedDate(value)
        setFilterFlag(!filterFlag)
      }

    useEffect(() => {
        const q = doc(firestore, 'passed_records', 'History_Logs');
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (snapshot.exists()) {
                const logs = snapshot.data()
                console.log(logs)
                setHistoryLogs(sortDesc(logs));
                setFilteredLogs(sortDesc(logs))
            } else {9
                console.log("Document does not exist!");
            }
        })

    return () => unsubscribe();
    }, [])

    useEffect(() => {
        const getPastDate = (logs, days) => {
            if(days){
                let parseDay = days === 'Last 1 Day' ? '1' : '7';
                const today = new Date();
                const cutoffDate = new Date(today);
                cutoffDate.setDate(today.getDate() - parseDay);

                const filteredData = Object.entries(logs).filter(log => {
                    const logDate = new Date(log[1].split('!')[3]);
                    return logDate >= cutoffDate;
                });
                setFilteredLogs(Object.fromEntries(filteredData))
            } else {
                setFilteredLogs(logs)
            }   
        };
        const filterByDateRange = (startDate, endDate, logs) => {
            if(startDate && endDate){
                const start = new Date(startDate);
                const end = new Date(endDate);

                const filteredData = Object.entries(logs).filter(log => {
                    const logDate = new Date(log[1].split('!')[3]);
                    return logDate >= start && logDate <= end;
                });
                setFilteredLogs(Object.fromEntries(filteredData))
            } else {
                setFilteredLogs(logs)
            }
        }
        if(selectedDate === 'Custom') {
            filterByDateRange(dateRange.start, dateRange.end, historyLogs)
        }else {
           getPastDate(historyLogs, selectedDate)
        } 
    }, [selectedDate, historyLogs, dateRange])

    useEffect(() => {
        if(!historyLogs) return
        const toSearch = [0, 1, 2]
        const filteredResult = Object.entries(historyLogs).filter(log => 
                toSearch.some(item => log[1].split('!')[item].toLowerCase().includes(search.toLowerCase())
            )
        )
        setFilteredLogs(Object.fromEntries(filteredResult))
    }, [historyLogs, search])

    const sortDesc = (data) => {
        if (data && Object.keys(data).length > 0) {
            const sortedEntries = Object.entries(data).sort(([, a], [, b]) => {
                const A = new Date(a.split("!")[3]);
                const B = new Date(b.split("!")[3]);

                const timeA = isNaN(A.getTime()) ? 0 : A.getTime(); 
                const timeB = isNaN(B.getTime()) ? 0 : B.getTime(); 
    
                return timeB - timeA; 
            });
            return Object.fromEntries(sortedEntries);
        }
        return {};
    };

  return (
    <section className="w-full h-full p-3 relative">
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
        <div className="w-full h-full p-2">
            <div className="w-full h-[10%] flex items-center justify-end gap-2 rounded-lg">
                <div className="flex items-center justify-center gap-2">
                    {selectedDate === 'Custom' && (
                        <>
                            <label>From:</label>
                            <input type="date" onChange={(e) => setDateRange({...dateRange, start: e.target.value})} className="py-1 px-3 rounded-lg text-gray-500 border-2 text-sm lg:text-base"/>
                            <label>To:</label>
                            <input type="date" onChange={(e) => setDateRange({...dateRange, end: e.target.value})} className="py-1 px-3 rounded-lg text-gray-500 border-2 text-sm lg:text-base"/>
                        </>
                    )}
                    <div className='relative'>
                        <button onClick={() => setFilterFlag(!filterFlag)} className='flex relative bg-white z-10 w-fit items-center justify-center gap-2 px-2 py-2 border-2 rounded-lg text-sm 2xl:text-base'>
                            <HiAdjustmentsHorizontal 
                                size={18}/>
                                {selectedDate ? <span className="text-xs lg:text-sm flex items-center justify-center">{selectedDate} <RxCross2 onClick={() => setSelectedDate('')}/></span> : <span className='hidden sm:hidden md:hidden lg:block'>Filter by Date</span>}
                        </button>
                        {filterFlag && (
                        <>
                            <div className="fixed inset-0 z-0" onClick={() => setFilterFlag(!filterFlag)}/>
                            <div className='absolute w-24 sm:w-28 md:w-32 lg:w-full bg-white right-0 top-10 z-0 p-1 border-[1px] text-xs lg:text-sm'>
                                <div onClick={() => filterModal('Last 1 Day')} className='text-center mt-1 hover:bg-slate-100 cursor-pointer py-1'>Last 1 Day</div>
                                <div onClick={() => filterModal('Last 7 Days')} className='text-center mt-1 hover:bg-slate-100 cursor-pointer py-1'>Last 7 Days</div>
                                <div onClick={() => filterModal('Custom')} className='text-center mt-1 hover:bg-slate-100 cursor-pointer py-1'>Custom Date Range</div>
                            </div>
                        </>
                        )}
                    </div>
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
            <div className="w-full h-[90%] rounded-t-lg">
                <div className="w-full h-[7%] rounded-t-lg hidden sm:block">
                    <div className="w-full h-full text-lg bg-gray-100 rounded-lg flex ">
                        <p className="text-gray-400 text-sm font-semibold w-1/5 py-2 border-white text-left px-2">Payee</p>
                        <p className="text-gray-400 text-sm font-semibold text-center w-1/5 py-2 border-white">DV No.</p>
                        <p className="text-gray-400 text-sm font-semibold text-center w-1/5 py-2 border-white">Status</p>
                        <p className="text-gray-400 text-sm font-semibold text-center w-1/5 py-2 border-white">Last Action By Name</p>
                        <p className="text-gray-400 text-sm font-semibold text-center w-1/5 py-2 ">Action Time and Date</p>
                    </div>
                </div>
                <div className="w-full h-[93%] overflow-y-auto text-gray-500">
                    {filteredLogs && Object.entries(filteredLogs).length > 0 ? (
                        Object.entries(filteredLogs).map(([key, log], index) => (
                            <>
                                <div key={`sm-visible-${key}`} className={`${index % 2 == 0 ? 'bg-white' : 'bg-offWhite'} hidden sm:flex w-full py-3 rounded-lg mt-1`}>
                                    <p className="w-1/4 text-sm text-left px-2 truncate font-semibold">{log.split('!')[0]}</p>
                                    <p className="w-1/4 text-sm text-center px-2">{log.split('!')[1].split('|').slice()[0]}</p>
                                    <p className="w-1/4 text-sm text-center px-2">{log.split('!')[4]}</p>
                                    <p className="w-1/4 text-sm text-center px-2">{log.split('!')[2].replace(',', ' ')}</p>
                                    <p className="w-1/4 text-sm text-center px-2">{`${log.split('!')[3]}`}</p>
                                </div>
                                <div key={`sm-hidden-${key}`} className={`${index % 2 == 0 ? 'bg-white' : 'bg-offWhite'} rounded-lg block sm:hidden w-full py-3 mt-1`}>
                                    <p className="px-2 truncate font-semibold">{log.split('!')[0]}</p>
                                    <p className="text-sm px-2 ">{log.split('!')[1].split('|').slice()[0]}</p>
                                    <p className="text-sm px-2 ">{log.split('!')[4]}</p>
                                    <p className="text-sm px-2 ">{log.split('!')[2].replace(',', ' ')}</p>
                                    <p className="text-sm px-2 ">{`${log.split('!')[3]}`}</p>
                                </div>
                            </>
                        ) )
                    ) : (
                        <div className=" w-full h-full flex items-center justify-center">
                            <p className="text-center font-semibold text-lg">No Logs Found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </section>

  )
}

export default HistoryLogs