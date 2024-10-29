import axios from "axios"
import { useEffect, useState } from "react"
import { useAuthContext } from "../../hooks/useAuthContext"

const HistoryLogs = () => {
    const [historyLogs, setHistoryLogs] = useState(null)
    const { user } = useAuthContext()

    useEffect(() => {
        const getDV = async() => {
            try{
                if(!historyLogs){
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/getAllDV`, {
                        withCredentials: true
                    })
                    if(res.status === 200){
                        const docs = res.data 
                        console.log('logs', docs)
                        setHistoryLogs(docs)
                    }
                }
            }
            catch(error){
                console.log(error.response ? error.response.data : error.message)
            }
        }
        if(user){
            getDV()
        }
    }, [user, historyLogs])

  return (
    <section className="w-full h-full flex flex-col bg-white rounded-t-lg border-[1px] p-5">
        <table className="w-full h-full">
            <thead className="w-full text-white rounded-t-lg">
                <tr className="w-full text-lg bg-customgreen">
                    <th className="w-1/4 py-2 border-r-2 border-white text-left px-2">Payee</th>
                    <th className="w-1/4 py-2 border-r-2 border-white">DV No.</th>
                    <th className="w-1/4 py-2 border-r-2 border-white">Last Action By Name</th>
                    <th className="w-1/4 py-w-1/4 2">Action Time and Date</th>
                </tr>
            </thead>
            <tbody className="w-full h-72 overflow-y-auto">
                {historyLogs ? (
                    historyLogs.map((log, index) => (
                        <tr key={index} className="w-full border-2">
                            <td className="text-left px-2 border-r-2">{log.split('|').slice()[0]}</td>
                            <td className="text-center px-2 border-r-2">{log.split('|').slice()[1]}</td>
                            <td className="text-center px-2 border-r-2">{log.split('|').slice()[2]}</td>
                            <td className="text-center px-2">{`${log.split('|').slice()[3]} ${log.split('|').slice()[4]}`}</td>
                        </tr>
                    ) )
                ) : (
                    <tr className="text-center w-full">No Documents Found</tr>
                )}
            </tbody>
        </table>
    </section>

  )
}

export default HistoryLogs