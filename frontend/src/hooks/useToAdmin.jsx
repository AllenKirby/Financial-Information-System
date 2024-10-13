import axios from "axios"
import { useState } from "react"

export const useToAdmin = () => {
    const [isLoadingToAdmin, setIsLoadingToAdmin] = useState(false)
    const [errorToAdmin, setErrorToAdmin] = useState(null)

    const submitToAdmin = async(data) => {
        setIsLoadingToAdmin(true)
        setErrorToAdmin(null)
        try {
            const res = await axios.post('http://localhost:4000/head/passToAdmin',data, {
                withCredentials: true
            } )
            if(res.status === 200){
                const docu = res.data
                console.log(docu)
                return true
            }
        } catch (error) {
            setIsLoadingToAdmin(false)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setErrorToAdmin(errorMessage);
            console.log(error)
        }
    } 
  return {submitToAdmin, isLoadingToAdmin, errorToAdmin}
}
