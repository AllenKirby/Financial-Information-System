import { useState } from "react";
import axios from "axios";

export const useFundingHook = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const returnDoc = async (data) => {
        setError(null)
        setIsLoading(true)
        try{
            const res = await axios.post('http://localhost:4000/operator/return_record', data, {
                withCredentials: true
            })
            if(res.status === 200){
                setIsLoading(false)
                return true
            }
        }catch(error){
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "Error passing the document";
            setError(errorMessage);
            console.log(error)
        }
    }

    const inputOperator = async(data, DV) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await axios.patch(`http://localhost:4000/operator/update_records/${DV}`, data, {
                withCredentials: true
            })
            if(res.status === 200){
                setIsLoading(false) 
                return true
            }
        } catch (error) {
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "Error updating the document: operator";
            setError(errorMessage);
            console.log(error)
        }
    }

    const transferToHead = async(data) => {
        setError(null)
        setIsLoading(true)
        try {  
            const res = await axios.post('http://localhost:4000/operator/transferDocu', data, {
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
            console.log(error)
        }
    }

    const appendDataToSheet = async(data) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await axios.post('http://localhost:4000/operator/appendDataToSheet', data, {
                withCredentials: true
            })
            if(res.status === 200){
                setIsLoading(false)
                const response = res.data
                console.log(response)
            }
        } catch (error) {
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setError(errorMessage);
            console.log(error)
        }
    }

    return {returnDoc, inputOperator, transferToHead, appendDataToSheet, isLoading, error}
}