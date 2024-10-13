import { useState } from "react";
import { useHeadDisbursementContext } from "./useHeadDisbursementContext";
import axios from "axios";

export const useReturnFromHead = () => {
    const [isLoadingReturn_fromHeader, setIsLoading] = useState(false)
    const [errorReturn_fromHeader, setError] = useState(null)
    const { dispatch } = useHeadDisbursementContext()

    const returnDocFromHeader = async (data) => {
        setError(null)
        setIsLoading(true)
        try{
            const res = await axios.post('http://localhost:4000/head/return_record', data, {
                withCredentials: true
            })
            if(res.status === 200){
                setIsLoading(false)
                console.log(`passed record: ${JSON.stringify(res.data, null, 2)}`)
                console.log(res.data.update)
                dispatch({type: 'UPDATE_HEADDOCUMENT', payload: res.data.update})
                return true
            }
        }catch(error){
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "Error passing the document";
            setError(errorMessage);
            console.log(error)
        }
    }
    return {returnDocFromHeader, isLoadingReturn_fromHeader, errorReturn_fromHeader}

}