import { collection, onSnapshot } from "firebase/firestore"
import { firestore } from "../../config/firebase-config"
import { useEffect, useState, useMemo } from "react"

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


    return (
        <div className="w-full h-full p-3">
            <div className="w-full h-[7%] flex gap-3 border-b border-gray-300">
                {tabs.map((tab) => (
                    <button
                    key={tab}
                    className={`${
                        activeTab === tab
                        ? 'text-superAdminMustard border-b-2 border-b-superAdminMustard'
                        : ""
                    } hover:border-b-2 hover:text-superAdminMustard hover:border-b-superAdminMustard transition-all duration-100`}
                    onClick={() => setActiveTab(tab)}
                    >
                    {tab}
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
                    <div className="w-full h-full border border-gray-300 rounded-lg">
                        {/* Header Row */}
                        <div className="w-full h-[8%] flex text-sm text-gray-500 bg-gray-100 border-b border-gray-300 font-semibold pr-4">
                            <div className="w-1/6 px-4 py-2">Date</div>
                            <div className="w-1/6 px-4 py-2">Time</div>
                            <div className="w-1/6 px-4 py-2">Fullname</div>
                            <div className="w-1/6 px-4 py-2">Role</div>
                            <div className="w-1/6 px-4 py-2">Email</div>
                            <div className="w-1/6 px-4 py-2">UID</div>
                        </div> 
                        {/* Data Rows */}
                        <div className="w-full h-[92%] overflow-y-auto">
                            {
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
                                            <div key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} flex`}>
                                                <div className="w-1/6 px-4 py-2">{date}</div>
                                                <div className="w-1/6 px-4 py-2">{time}</div>
                                                <div className="w-1/6 px-4 py-2 truncate">{log.name}</div>
                                                <div className="w-1/6 px-4 py-2">{role}</div>
                                                <div className="w-1/6 px-4 py-2 text-blue-500 underline truncate">{log.email}</div>
                                                <div className="w-1/6 px-4 py-2 text-green-500 truncate">{log.uid}</div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div className="text-gray-500">No login logs available for the selected date.</div>
                                )
                            }
                        </div>
                    </div>
                    )}
                    {activeTab === "Access Control Logs" && (
                    <div className="w-full h-full border border-gray-300 rounded-lg">
                        <div className="w-full h-[8%] flex bg-gray-100 border-b border-gray-300 font-semibold pr-4">
                            <div className="w-1/5 px-4 py-2">Date</div>
                            <div className="w-1/5 px-4 py-2">Time</div>
                            <div className="w-3/5 px-4 py-2">Description</div>
                        </div> 
                        {/* Data Rows */}
                        <div className="w-full h-[92%] overflow-y-auto">
                            {
                                combinedLogs?.[currDate]?.accessLogs ? (
                                    Object.keys(combinedLogs[currDate].accessLogs)
                                    .sort((a,b) => new Date(b) - new Date(a))
                                    .map((timestamp, index) => {
                                        const log = combinedLogs[currDate].accessLogs[timestamp]
                                        const desc = log.event ? (
                                            <>
                                                The role <span className="font-bold">{log.role}</span> granted access feature of <span className="font-bold">{log.feature}</span>
                                            </>
                                        ) : (
                                            <>
                                                The role <span className="font-bold">{log.role}</span> revoked access feature
                                            </>
                                        )
                                        const [date, time] = timestamp.split(',').map(part => part.trim());
                                        return (
                                            <div key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} flex`}>
                                                <div className="w-1/5 px-4 py-2">{date}</div>
                                                <div className="w-1/5 px-4 py-2">{time}</div>
                                                <div className="w-3/5 px-4 py-2">{desc}</div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div className="text-gray-500">No access logs available for the selected date.</div>
                                )
                            }
                        </div>
                    </div>
                    )}
                </div>
        </div>
        
    )
}

export default Logs
