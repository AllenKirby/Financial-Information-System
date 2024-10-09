import axios from "axios"
import { useState } from "react"
import { useOpDisbursementContext } from "./useOpDisbursementContext"

export const useInputOperator = () => {
    const [isLoadingForOp, setIsLoadingForOp] = useState(false)
    const [errorForOp, setErrorForOp] = useState(null)
    const  {dispatch}  = useOpDisbursementContext()

    const inputOperator = async(data, DV) => {
        setIsLoadingForOp(true)
        setErrorForOp(null)
        try {
            const res = await axios.patch(`http://localhost:4000/operator/update_records/${DV}`, data, {
                withCredentials: true
            })
            if(res.status === 200){
                const docu = res.data   
                console.log('updated document by operator', docu)
                dispatch({type: 'UPDATE_OPDOCUMENT', payload: docu})
                return true
            }
        } catch (error) {
            setIsLoadingForOp(false)
            const errorMessage = error.response?.data?.message || error.message || "Error updating the document: operator";
            setErrorForOp(errorMessage);
            console.log(error)
        }
    }
  return {inputOperator, isLoadingForOp, errorForOp}
}
