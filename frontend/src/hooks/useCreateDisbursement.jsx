import axios from "axios";
import { useState } from "react";
//import { useDisbursementContext } from '../hooks/useDisbursementContext'

export const useCreateDisbursement = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    //const { dispatch } = useDisbursementContext()

    const createDisbursement = async(data) => {
        setError(null)
        setIsLoading(true)
        try{
            const res = await axios.post('http://localhost:4000/editor/createDV', data, {
              withCredentials: true,
                });
      
            if(res.status === 200){
                setIsLoading(false)
               //const docu = res.data
                //dispatch({type: 'CREATE_DOCUMENT', payload: docu})
                console.log(res.data)
            }
          }
        catch(error){
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setError(errorMessage);
            console.log(`error at DV: ${errorMessage}`)
        }
    }
  return {createDisbursement, isLoading, error}
}
