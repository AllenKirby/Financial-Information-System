import axios from "axios"
import { useState } from "react"

export const useToHead = () => {
    const [isLoadingToHead, setIsLoadingToHead] = useState(false)
    const [errorToHead, setErrorToHead] = useState(null)

    const transferToHead = async(data) => {
        setErrorToHead(null)
        setIsLoadingToHead(true)
        try {  
            const res = await axios.post('http://localhost:4000/operator/transferDocu', data, {
                withCredentials: true
            })

            if(res.status === 200){
                const docu = res.data
                console.log('document transferred to head', docu)
                return true
            }
            
        } catch (error) {
            setIsLoadingToHead(false)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setErrorToHead(errorMessage);
            console.log(error)
        }
    }
    return {transferToHead, isLoadingToHead, errorToHead}
}
