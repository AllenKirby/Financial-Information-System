import axios from "axios"
import { useState } from "react"

import { deleteDVrecords } from '../redux/DVUsersRedux'
import { useDispatch } from 'react-redux'

export const useBudgetOfficerHook = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const apiURL = import.meta.env.VITE_API_URL
    const dispatch = useDispatch()

    const submitToAdmin = async(data) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await axios.post(`${apiURL}/head/passToAdmin`,data, {
                withCredentials: true
            } )
            if(res.status === 200){
                setIsLoading(false)
                dispatch(deleteDVrecords(data.DV))
                return true
            }
        } catch (error) {
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setError(errorMessage);
            console.log(error)
        }
    } 

    const returnDocFromHeader = async (data) => {
        setError(null)
        setIsLoading(true)
        try{
            const res = await axios.post(`${apiURL}/head/return_record`, data, {
                withCredentials: true
            })
            if(res.status === 200){
                setIsLoading(false)
                dispatch(deleteDVrecords(data.DV))
                return true
            }
        }catch(error){
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "Error passing the document";
            setError(errorMessage);
            console.log(error)
        }
    }

    const addCertified = async(data, id) => {
        console.log(data)
        setError(null)
        setIsLoading(true)
        try {
            const res = await axios.patch(`${apiURL}/head/addCertified/${id}`, data, {
                withCredentials: true
            })
            if(res.status === 200){
                setIsLoading(false)
                return true
            }
        } catch (error) {
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "Error adding certified";
            setError(errorMessage);
            console.log(error)
        }
    }
    
    const returnBUR = async (data) => {
        setError(null)
        setIsLoading(true)
        try{
            const res = await axios.post(`${apiURL}/head/returnBUR`, data, {
                withCredentials: true
            })
            if(res.status === 200){
                setIsLoading(false)
                return true
            }
        }catch(error){
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "Error returning the document";
            setError(errorMessage);
            console.log(error)
        }
    }

    const submitBURToAdmin = async(data) => {
        setIsLoading(true)
        setError(null)
        console.log('submitting')
        try {
            const res = await axios.post(`${apiURL}/head/passBURToAdmin`,data, {
                withCredentials: true
            } )
            if(res.status === 200){
                setIsLoading(false)
                return true
            }
        } catch (error) {
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setError(errorMessage);
            console.log(error)
        }
    } 

  return {
    submitToAdmin, 
    returnDocFromHeader, 
    addCertified, 
    returnBUR, 
    submitBURToAdmin,
    isLoading, 
    error}
}
