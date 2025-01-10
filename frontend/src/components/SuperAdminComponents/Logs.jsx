import { collection, onSnapshot } from "firebase/firestore"
import { firestore } from "../../config/firebase-config"
import { useEffect, useState, useMemo } from "react"

import { FiUser } from "react-icons/fi";
import { TbUserShield } from "react-icons/tb";
import PaginatedList from "../Pagination/PaginatedList";

const Logs = () => {
    const [activeTab, setActiveTab] = useState("Logins");
    const tabs = ['Logins', 'Access Control Logs']
    const[currDate, setCurrDate] = useState('')

    const [LoginLogs, setLoginLogs] = useState({})
    const [AccessLogs, setAccessLogs] = useState({})


    // useEffect(() => {
    //     const fetch = async() => {
    //         const logs = await getLogs()
    //         const currentMonth = Object.keys(logs)[0]
    //         setCurrDate(currentMonth)
    //         setLogs(logs)
    //         console.log(logs)
    //     }
    //     fetch()
    // }, [])

    const combinedLogs = useMemo(() => {
        const result = {}
        Object.keys(LoginLogs).map((month) => {
            if(!result[month]){
                result[month] = {loginLogs: {}, accessLogs: {}}
            }
            result[month].loginLogs = LoginLogs[month]
        })

        Object.keys(AccessLogs).map((month) => {
            if(!result[month]){
                result[month] = {loginLogs: {}, accessLogs: {}}
            }
            result[month].accessLogs = AccessLogs[month]
        })
        console.log(result)
        return result
    }, [LoginLogs, AccessLogs])

    useEffect(() => {
        const collectionRef = collection(firestore, 'loginLogs')
        const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
            const fetchedLogs = snapshot.docs.reduce((acc, doc) => {
                acc[doc.id] = doc.data()
                return acc
            }, {})
            setLoginLogs(fetchedLogs)
            console.log('login logs')
        })

        return () => unsubscribe()
    }, [])

    useEffect(() => {
        const collectionRef = collection(firestore, 'accessControlLogs')
        const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
            const fetchedLogs = snapshot.docs.reduce((acc, doc) => {
                acc[doc.id] = doc.data()
                return acc
            }, {})
            setAccessLogs(fetchedLogs)
        })

        return () => unsubscribe()
    }, [])

    useEffect(() => {
        const currentMonth = Object.keys(combinedLogs)[0]
        setCurrDate(currentMonth)
    }, [combinedLogs])

    const sortDate = (logs) => {
        const filteredResult = Object.entries(logs).sort(([keyA], [keyB]) => new Date(keyB) - new Date(keyA))
        return Object.fromEntries(filteredResult)
    }

    return (
        <div className="w-full h-full p-3 text-gray-500">
            <div className="w-full h-[7%] flex gap-3 border-b border-gray-300">
                {tabs.map((tab) => (
                    <button
                    key={tab}
                    className={`${
                        activeTab === tab
                        ? 'text-superAdminBlue border-b-2 border-b-superAdminBlue'
                        : ""
                    } hover:border-b-2 hover:text-superAdminBlue hover:border-b-superAdminBlue flex items-center justify-center gap-2 transition-all duration-100`}
                    onClick={() => setActiveTab(tab)}
                    >
                    {tab === 'Logins' ? <FiUser size={20}/> : <TbUserShield size={20}/>}<span className="hidden sm:block">{tab}</span>
                    </button>
                ))}
                <div className="flex items-center justify-center">
                    <select
                        value={currDate}
                        onChange={(e) => setCurrDate(e.target.value)}
                        className="py-1 px-3 border-[1px] rounded-lg"
                    >
                        {Object.keys(combinedLogs).map((key, index) => (
                            <option key={index} value={index}>{key}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="w-full h-[93%] p-2">
                {activeTab === "Logins" && (
                    <div className="w-full h-full flex flex-col">
                        {/* Header Row */}
                        <div className="w-full h-auto hidden sm:flex text-sm text-gray-500 rounded-lg bg-gray-200 font-semibold pr-4">
                            <div className="w-1/6 px-4 py-2">Date</div>
                            <div className="w-1/6 px-4 py-2">Time</div>
                            <div className="w-1/6 px-4 py-2">Fullname</div>
                            <div className="w-1/6 px-4 py-2">Role</div>
                            <div className="w-1/6 px-4 py-2">Email</div>
                            <div className="w-1/6 px-4 py-2">UID</div>
                        </div> 
                        {/* Data Rows */}
                        <div className="w-full flex-1 overflow-y-auto">
                            {/* {
                                combinedLogs?.[currDate]?.loginLogs ? (
                                    Object.keys(combinedLogs[currDate].loginLogs)
                                    .sort((a, b) => new Date(b) - new Date(a))
                                    .map((timestamp, index) => {
                                        const log = combinedLogs[currDate].loginLogs[timestamp]
                                        const role = log.role === "0" ? "Super Admin" :
                                                    log.role === "1" ? "Head of Finance" :
                                                    log.role === "2" ? "Budget Officer" :
                                                    log.role === "3" ? "Funding" :
                                                    "Preparer"
                                        const [date, time] = timestamp.split(',').map(part => part.trim());
                                        return (
                                            <div key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} flex flex-col sm:flex-row rounded-lg mt-2`}>
                                                <div className="w-full sm:w-1/6 px-4 py-2 flex gap-2"><span className="font-bold block sm:hidden">Date: </span>{date}</div>
                                                <div className="w-full sm:w-1/6 px-4 py-2 flex gap-2"><span className="font-bold block sm:hidden">Time:</span>{time}</div>
                                                <div className="w-full sm:w-1/6 px-4 py-2 flex gap-2 truncate"><span className="font-bold block sm:hidden">Fullname:</span>{log.name}</div>
                                                <div className="w-full sm:w-1/6 px-4 py-2 flex gap-2"><span className="font-bold block sm:hidden">Role:</span>{role}</div>
                                                <div className="w-full sm:w-1/6 px-4 py-2 flex gap-2 truncate"><span className="font-bold block sm:hidden">Email:</span><span className="text-blue-500 underline">{log.email}</span></div>
                                                <div className="w-full sm:w-1/6 px-4 py-2 flex gap-2 truncate"><span className="font-bold block sm:hidden">UID:</span><span className="text-green-500">{log.uid}</span></div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div className="w-full h-full text-center flex items-center justify-center">No access logs available for the selected date.</div>
                                )
                            } */}
                            {combinedLogs?.[currDate]?.loginLogs ? (
                                <PaginatedList items={sortDate(combinedLogs[currDate].loginLogs)} paginationFor="loginLogs"/>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <p className="font-bold">No Login Log Found</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {activeTab === "Access Control Logs" && (
                    <div className="w-full h-full flex flex-col">
                        <div className="w-full h-auto hidden sm:flex text-sm text-gray-500 rounded-lg bg-gray-200 font-semibold pr-4">
                            <div className="w-1/5 px-4 py-2">Date</div>
                            <div className="w-1/5 px-4 py-2">Time</div>
                            <div className="w-3/5 px-4 py-2">Description</div>
                        </div> 
                        {/* Data Rows */}
                        <div className="w-full flex-1 overflow-y-auto">
                            {/* {
                                combinedLogs?.[currDate]?.accessLogs ? (
                                    Object.keys(combinedLogs[currDate].accessLogs)
                                    .sort((a,b) => new Date(b) - new Date(a))
                                    .map((timestamp, index) => {
                                        const log = combinedLogs[currDate].accessLogs[timestamp]
                                        const desc = log.event ? (
                                            <>
                                                The role {log.role} granted access feature of {log.feature}
                                            </>
                                        ) : (
                                            <>
                                                The role {log.role} revoked access feature
                                            </>
                                        )
                                        const [date, time] = timestamp.split(',').map(part => part.trim());
                                        return (
                                            <div key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} flex flex-col sm:flex-row rounded-lg mt-2`}>
                                                <div className="w-full sm:w-1/5 px-4 py-2 flex gap-2"><span className="font-bold block sm:hidden">Date:</span> {date}</div>
                                                <div className="w-full sm:w-1/5 px-4 py-2 flex gap-2"><span className="font-bold block sm:hidden">Time:</span>{time}</div>
                                                <div className="w-full sm:w-3/5 px-4 py-2 flex gap-2"><span className="font-bold block sm:hidden">Description:</span>{desc}</div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div className="w-full h-full text-center flex items-center justify-center">No access logs available for the selected date.</div>
                                )
                            } */}
                            {combinedLogs?.[currDate]?.accessLogs ? (
                                <PaginatedList items={sortDate(combinedLogs[currDate].accessLogs)} paginationFor="AccessControl"/>
                            ): (
                                <div className="w-full h-full flex items-center justify-center">
                                    <p className="font-bold">No Access Control Log Found</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
        
    )
}

export default Logs
