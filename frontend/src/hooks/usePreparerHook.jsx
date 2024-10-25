import axios from "axios";
import { useState } from "react";
import { useDisbursementContext } from './useDisbursementContext'

export const usePreparerHook = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { dispatch } = useDisbursementContext()

    const createDisbursement = async(data) => {
        setError(null)
        setIsLoading(true)
        try{
            const res = await axios.post('http://localhost:4000/editor/createDV', data, {
              withCredentials: true,
            });
      
            if(res.status === 200){
              setIsLoading(false)
              const docu = res.data
              dispatch({type: 'CREATE_DOCUMENT', payload: docu})
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
            const res = await axios.delete(`http://localhost:4000/editor/deleteDV/${id}`, {
                withCredentials: true
            })

            if(res.status === 200){
                setIsLoading(false)
                dispatch({type: 'DELETE_DOCUMENT', payload: id})
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
            const res = await axios.get('http://localhost:4000/editor/getFormData', {
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
            const res = await axios.post('http://localhost:4000/editor/passRecord', data, {
              withCredentials: true
            });
            if(res.status === 200){
                setIsLoading(false)
                dispatch({type: 'UPDATE_DOCUMENT', payload: res.data.update})
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
            const res = await axios.patch(`http://localhost:4000/editor/updateDV/${id}`, data, {
                withCredentials: true
            })

            if(res.status === 200){
                const updateDoc = res.data
                dispatch({type: 'UPDATE_DOCUMENT', payload: updateDoc})
                return true
            }
        } catch (error) {
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setError(errorMessage);
            console.log(errorMessage)
        }

    }

  return {createDisbursement, deleteDV, getFormData, submitDoc, updateDV, isLoading, error}
}