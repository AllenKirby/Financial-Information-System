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
                        console.log(docs)
                        setHistoryLogs(docs)
                        console.log('history', historyLogs)
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

    const getStatusColor = (status) => {
        switch(status){
            case 'Approved':
                return 'bg-green-500 text-white';
            case 'Under Review':
                return 'bg-orange-500 text-white';
            case 'In Review':
                return 'bg-blue-500 text-white';
            case 'Drafting':
                return 'bg-gray-200 text-customFontColor';
            default:
                return 'bg-red-500 text-white';
        }
    }
    
  return (
    <section className="w-full h-full flex flex-col bg-white rounded-xl p-5">
        <table className="w-full h-full">
            <thead className="w-full">
                <tr className="w-full py-1 text-lg">
                    <th className="w-4/6 text-left px-7">Payee</th>
                    <th className="w-1/6">DV No.</th>
                    <th className="w-1/6">Status</th>
                </tr>
            </thead>
            <tbody className="w-full">
                {historyLogs ? (
                    Object.entries(historyLogs).map(([key, document]) => (
                        <tr key={key} className="w-full">
                            <td className="w-4/6 text-left px-7">{document.payee}</td>
                            <td className="w-1/6 text-center">{document.DV}</td>
                            <td className='w-1/6 text-center text-xs'> 
                                <div className={`w-auto h-auto px-2 py-1 rounded-lg ${getStatusColor(document.status)}`} >{document.status}</div>
                            </td>
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