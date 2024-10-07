import { useState } from "react";
import { useDisbursementContext } from "./useDisbursementContext";
import axios from "axios";

export const useToOperator = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const { dispatch } = useDisbursementContext()

    const submitDoc = async(data) => {
        setError(null)
        setIsLoading(true)
        try{
            const res = await axios.post('http://localhost:4000/editor/passRecord', data, {
              withCredentials: true
            });
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
  return {submitDoc, isLoading, error}
}
