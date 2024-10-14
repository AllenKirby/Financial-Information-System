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
                    const res = await axios.get('http://localhost:4000/admin/getAllDV', {
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
    <section className="w-full h-full flex flex-col bg-white rounded-xl p-5">
        <table className="w-full h-full">
            <thead className="w-full">
                <tr className="w-full py-1 text-lg">
                    <th>Payee</th>
                    <th>DV No.</th>
                    <th>Last Action By Name</th>
                    <th>Action Time and Date</th>
                </tr>
            </thead>
            <tbody className="w-full">
                {historyLogs ? (
                    historyLogs.map((log, index) => (
                        <tr key={index} className="w-full">
                            <td className="text-center">{log.split('|').slice()[0]}</td>
                            <td className="text-center">{log.split('|').slice()[1]}</td>
                            <td className="text-center">{log.split('|').slice()[2]}</td>
                            <td className="text-center">{`${log.split('|').slice()[3]} ${log.split('|').slice()[4]}`}</td>
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