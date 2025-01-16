import { useEffect, useState } from "react"
import { firestore } from "../../config/firebase-config";
import { doc, onSnapshot } from "firebase/firestore";

const HistoryLogs = () => {
    const [historyLogs, setHistoryLogs] = useState(null)

    useEffect(() => {
        const q = doc(firestore, 'passed_records', 'History_Logs');
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (snapshot.exists()) {
                const logs = snapshot.data()
                setHistoryLogs(sortDesc(logs));
            } else {
                console.log("Document does not exist!");
            }
        })

    return () => unsubscribe();
    }, [])

    const sortDesc = (data) => {
        if (data && Object.keys(data).length > 0) {
            const sortedEntries = Object.entries(data).sort(([, a], [, b]) => {
                const A = new Date(a.split("!")[3]);
                const B = new Date(b.split("!")[3]);
    
                // Validate the dates
                const timeA = isNaN(A.getTime()) ? 0 : A.getTime(); // Use 0 if invalid
                const timeB = isNaN(B.getTime()) ? 0 : B.getTime(); // Use 0 if invalid
    
                return timeB - timeA; // Descending order
            });
            return Object.fromEntries(sortedEntries);
        }
        return null;
    };

  return (
    <section className="w-full h-full bg-white p-3">
        <div className="w-full table-auto rounded-t-lg">
            <div className="w-full rounded-t-lg">
                <div className="w-full text-lg bg-gray-200 rounded-t-lg flex ">
                    <p className="font-semibold w-1/4 py-2 border-white text-left px-2">Payee</p>
                    <p className="font-semibold text-center w-1/4 py-2 border-white">DV No.</p>
                    <p className="font-semibold text-center w-1/4 py-2 border-white">Last Action By Name</p>
                    <p className="font-semibold text-center w-1/4 py-2 ">Action Time and Date</p>
                </div>
            </div>
            <div className="w-full h-[450px] overflow-y-auto">
                {historyLogs && Object.entries(historyLogs).length > 0 ? (
                    Object.entries(historyLogs).map(([key, log], index) => (
                        <div key={key} className={`${index % 2 == 0 ? 'bg-white' : 'bg-gray-200'} w-full flex py-2 rounded-lg`}>
                            <p className="w-1/4 text-sm text-left px-2">{log.split('!')[0]}</p>
                            <p className="w-1/4 text-sm text-center px-2">{log.split('!')[1].split('|').slice()[0]}</p>
                            <p className="w-1/4 text-sm text-center px-2">{log.split('!')[2].replace(',', ' ')}</p>
                            <p className="w-1/4 text-sm text-center px-2">{`${log.split('!')[3]}`}</p>
                        </div>
                    ) )
                ) : (
                    <div className=" w-full h-full flex items-center justify-center">
                        <p className="text-center font-semibold text-lg">No Logs Found</p>
                    </div>
                )}
            </div>
        </div>
    </section>

  )
}

export default HistoryLogs