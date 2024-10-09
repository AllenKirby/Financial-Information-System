import { useState } from "react";
import { useOpDisbursementContext } from "./useOpDisbursementContext";
import axios from "axios";

export const useBackToEditor = () => {
    const [isLoadingReturn_OpToEditor, setIsLoading] = useState(false)
    const [errorReturn_OpToEditor, setError] = useState(null)
    const { dispatch } = useOpDisbursementContext()

    const returnDoc = async (data) => {
        setError(null)
        setIsLoading(true)
        try{
            const res = await axios.post('http://localhost:4000/operator/return_record', data, {
                withCredentials: true
            })
            if(res.status === 200){
                setIsLoading(false)
                console.log(`passed record: ${JSON.stringify(res.data, null, 2)}`)
                console.log(res.data.update)
                dispatch({type: 'UPDATE_DOCUMENT', payload: res.data.update})
                return true
            }
        }catch(error){
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "Error passing the document";
            setError(errorMessage);
            console.log(error)
        }
    }
    return {returnDoc, isLoadingReturn_OpToEditor, errorReturn_OpToEditor}

}