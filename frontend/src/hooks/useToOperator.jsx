import axios from "axios"
import { useState } from "react"

export const useToOperator = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const toOperator = async(id) => {
        setIsLoading(true)
        setError(null)
        try{
            console.log('submitting records', id)
            const data = {
              DV: id,
            }
            const res = await axios.post('http://localhost:4000/editor/passRecord', data, {
              withCredentials: true
            });
            if(res.status === 200){
                setIsLoading(false)
                console.log(`passed record: ${res.data}`)
                return true
            }
          }catch(error){
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "Error passing the records";
            setError(errorMessage);
            console.log(error)
          }
    }
  return {toOperator, isLoading, error}
}
