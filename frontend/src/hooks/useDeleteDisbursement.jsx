import { useState } from "react"
import axios from 'axios'
import { useDisbursementContext } from "./useDisbursementContext"

export const useDeleteDisbursement = () => {
    const [error, setError] = useState(null)
    const { dispatch } = useDisbursementContext()

    const deleteDV = async(id) => {
        setError(null)

        try {
            const res = await axios.delete(`http://localhost:4000/editor/deleteDV/${id}`, {
                withCredentials: true
            })

            if(res.status === 200){
                console.log(res.data)
                dispatch({type: 'DELETE_DOCUMENT', payload: id})
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setError(errorMessage);
            console.log(`error at DV: ${errorMessage}`)
        }

    }
  return {deleteDV, error}
}
