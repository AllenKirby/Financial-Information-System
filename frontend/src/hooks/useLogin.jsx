import { useState } from "react"
import { useAuthContext } from "./useAuthContext"
import axios from "axios"

export const useLogin = () => {
    const {dispatch} = useAuthContext()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const login = async (loginData) => {
        setIsLoading(true)
        setError(null)
        try{
          const res = await axios.post('http://localhost:4000/api/user/login', loginData, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          const json = res.data
          if(res.status === 200){
            localStorage.setItem('user', JSON.stringify(json))
            dispatch({type: 'LOGIN', payload: json})
            setIsLoading(false)
          }
        }
        catch(error){
          setIsLoading(false)
          setError(error.response.data.error);
        }
    }
    return {login, isLoading, error}
}