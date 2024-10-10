import axios from "axios"
import { useState } from "react"
import { useDisbursementContext } from "./useDisbursementContext"

export const useUpdateDisbursement = () => {
    const [isLoadingForUpdate, setisLoadingForUpdate] = useState(false)
    const [errorForUpdate, seterrorForUpdate] = useState(null)
    const { dispatch } = useDisbursementContext()

    const updateDV = async(data, id) => {
        console.log('updating')
        seterrorForUpdate(null)
        setisLoadingForUpdate(true)
        try {
            const res = await axios.patch(`http://localhost:4000/editor/updateDV/${id}`, data, {
                withCredentials: true
            })

            if(res.status === 200){
                const updateDoc = res.data
                console.log("updated doc: ", updateDoc)
                dispatch({type: 'UPDATE_DOCUMENT', payload: updateDoc})
                return true
            }
        } catch (error) {
            setisLoadingForUpdate(false)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            seterrorForUpdate(errorMessage);
            console.log(error)
        }

    }
  return {updateDV, isLoadingForUpdate, errorForUpdate}
}
