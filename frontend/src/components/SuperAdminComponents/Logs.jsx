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
        <div>
            <div className="flex space-x-6 border-b border-gray-300 w-full">
                {tabs.map((tab) => (
                    <button
                    key={tab}
                    className={`pb-2 ${
                        activeTab === tab
                        ? "border-black text-black font-semibold"
                        : "text-gray-500 hover:text-black"
                    } border-b-2`}
                    onClick={() => setActiveTab(tab)}
                    >
                    {tab}
                    </button>
                ))}
                <select
                    value={currDate}
                    onChange={(e) => setCurrDate(e.target.value)}
                >
                    {Object.keys(combinedLogs).map((key, index) => (
                        <option key={index} value={index}>{key}</option>
                    ))}
                </select>
            </div>
                <div>
                    {activeTab === "Logins" && (
                    <div className="w-full border border-gray-300 rounded-lg">
                        {/* Header Row */}
                        <div className="flex bg-gray-100 border-b border-gray-300 font-semibold">
                            <div className="w-1/6 px-4 py-2">Date</div>
                            <div className="w-1/6 px-4 py-2">Time</div>
                            <div className="w-1/6 px-4 py-2">Fullname</div>
                            <div className="w-1/6 px-4 py-2">Role</div>
                            <div className="w-1/6 px-4 py-2">Email</div>
                            <div className="w-1/6 px-4 py-2">UID</div>
                        </div> 
                        {/* Data Rows */}
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
                                        <div key={index} className="flex border-b border-gray-300">
                                            <div className="w-1/6 px-4 py-2">{date}</div>
                                            <div className="w-1/6 px-4 py-2">{time}</div>
                                            <div className="w-1/6 px-4 py-2">{log.name}</div>
                                            <div className="w-1/6 px-4 py-2">{role}</div>
                                            <div className="w-1/6 px-4 py-2 text-blue-500 underline">{log.email}</div>
                                            <div className="w-1/6 px-4 py-2 text-green-500">{log.uid}</div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="text-gray-500">No login logs available for the selected date.</div>
                            )
                        }
                    </div>
                    )}
                    {activeTab === "Access Control Logs" && (
                    <div className="w-full border border-gray-300 rounded-lg">
                        <div className="flex bg-gray-100 border-b border-gray-300 font-semibold">
                            <div className="w-1/5 px-4 py-2">Date</div>
                            <div className="w-1/5 px-4 py-2">Time</div>
                            <div className="w-3/5 px-4 py-2">Description</div>
                        </div> 
                        {/* Data Rows */}
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
                                        <div key={index} className="flex border-b border-gray-300">
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
                    )}
                </div>
        </div>
        
    )
}

export default Logs
