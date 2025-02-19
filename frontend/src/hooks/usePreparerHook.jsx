import axios from "axios";
import { useState } from "react";

import {useDispatch} from 'react-redux'
import { deleteDVrecords } from '../redux/DVUsersRedux'

export const usePreparerHook = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const apiURL = import.meta.env.VITE_API_URL
    const dispatch = useDispatch()

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
            return false
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
                dispatch(deleteDVrecords(id))
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
                dispatch(deleteDVrecords(data.DV))
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
            return false
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
            return true
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

    const exportDVRegister = async(data) => {
        setError(null)
        setIsLoading(true)
        try {
            const res = await axios.post(`${apiURL}/editor/exportDV`, data, {
                responseType: 'blob',
                withCredentials: true
            })
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'populated-template.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setError(errorMessage);
            console.log(errorMessage)
            return false
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
    exportDVRegister,
    isLoading, 
    error}
}