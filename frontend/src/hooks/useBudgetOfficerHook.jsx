import axios from "axios"
import { useState } from "react"

export const useBudgetOfficerHook = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const apiURL = import.meta.env.VITE_API_URL

    const submitToAdmin = async(data) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await axios.post(`${apiURL}/head/passToAdmin`,data, {
                withCredentials: true
            } )
            if(res.status === 200){
                setIsLoading(false)
                return true
            }
        } catch (error) {
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setError(errorMessage);
            console.log(error)
        }
    } 

    const returnDocFromHeader = async (data) => {
        setError(null)
        setIsLoading(true)
        try{
            const res = await axios.post(`${apiURL}/head/return_record`, data, {
                withCredentials: true
            })
            if(res.status === 200){
                setIsLoading(false)
                return true
            }
        }catch(error){
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "Error passing the document";
            setError(errorMessage);
            console.log(error)
        }
    }

  return {submitToAdmin, returnDocFromHeader, isLoading, error}
}
