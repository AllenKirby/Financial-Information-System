import axios from "axios";
import { useState } from "react";
import { useAuthContext } from '../hooks/useAuthContext'

export const usePreparerHook = () => {
    const [error, setError] = useState(null)
    const { dispatch } = useAuthContext()
    const [isLoading, setIsLoading] = useState(false)
    const apiURL = import.meta.env.VITE_API_URL

    const createDisbursement = async(data) => {
        setError(null)
        setIsLoading(true)
        try{
            const res = await axios.post(`${apiURL}/editor/createDV`, data, {
              withCredentials: true,
            });
      
            if(res.status === 200){
              setIsLoading(false)
              sessionStorage.removeItem('pendingDVNumbers')
              return true
            }
          }
        catch(error){
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setError(errorMessage);
            console.log(errorMessage)
        }
    }

    const deleteDV = async(id) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await axios.delete(`${apiURL}/editor/deleteDV/${id}`, {
                withCredentials: true
            })

            if(res.status === 200){
                setIsLoading(false)
                return true
            }
        } catch (error) {
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setError(errorMessage);
            console.log(errorMessage)
        }

    }

    const getFormData = async () => {
        try{
            console.log('gerformdata')
            const res = await axios.get(`${apiURL}/editor/getFormData`, {
                withCredentials: true
            })

            if(res.status === 200){
                const arr = res.data.form
                sessionStorage.setItem('FormData', JSON.stringify(arr));
                return res.data.form
            }

        }catch(error){
            console.log(error)
        }
    }

    const submitDoc = async(data) => {
        setError(null)
        setIsLoading(true)
        try{
            const res = await axios.post(`${apiURL}/editor/passRecord`, data, {
              withCredentials: true
            });
            if(res.status === 200){
                setIsLoading(false)
                return true
            }
          }catch(error){
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "Error passing the document";
            setError(errorMessage);
            console.log(errorMessage)
        }
    }

    const updateDV = async(data, id) => {
        setError(null)
        setIsLoading(true)
        try {
            const res = await axios.patch(`${apiURL}/editor/updateDV/${id}`, data, {
                withCredentials: true
            })

            if(res.status === 200){
                return true
            }
        } catch (error) {
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setError(errorMessage);
            console.log(errorMessage)
        }

    }

    const savePayeeData = async (data) => {
        try{
           const key = `${data.payee}|${data.tin}`
           const sanitizedKey = key.replace(/[\/.*`,\\\0\s]/g, '')
           const payeeData = {
                key: sanitizedKey,
                data : data
           }            
           const res = axios.post(`${apiURL}/editor/savePayeeData`, payeeData, {
            withCredentials: true
           })
           if(res.status === 200){
                console.log(res.data)
           }
        }catch(error){
            console.log(error)
        }
    }

    const loadPayee =async() => {
        try{
            const res = await axios.get(`${apiURL}/editor/getPayeeData`, {
                withCredentials: true
            })
            if(res.status === 200){
                const response = res.data.document
                // sessionStorage.setItem('FormData', JSON.stringify(arr));
                return response
            }
        }catch(error){
            console.log(error)
        }
    }

    const updateAccount = async(data) => {
        console.log(data)
        setIsLoading(true)
        setError(null)
        try {
            const res = await axios.patch(`${apiURL}/editor/updateAcc`, data, {
                withCredentials: true
            })
            if(res.status === 200) {
                console.log(res.data)
                dispatch({type: 'LOGIN', payload: res.data})
                setIsLoading(false)
                return true
            }
        } catch (error) {
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setError(errorMessage);
            console.log(errorMessage)
        }
    }

  return {
    createDisbursement, 
    deleteDV, 
    getFormData, 
    submitDoc, 
    updateDV, 
    savePayeeData, 
    loadPayee, 
    updateAccount,
    isLoading, 
    error}
}