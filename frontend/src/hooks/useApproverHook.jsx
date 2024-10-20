import axios from "axios"
import { useState } from "react"

export const useApproverHook = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const approveDV = async(DV) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await axios.patch(`http://localhost:4000/admin/approveDocu/${DV}`, {}, {
                withCredentials: true
            })
            if(res.status == 200){
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
    const addNewFundCluster = async (newFundCluster, randKey) => {
        try{
            const data = {
                cluster: newFundCluster,
                key: randKey
            }

            const res = await axios.post('http://localhost:4000/admin/addNewFundCluster', data, {
                withCredentials: true
            })

            if(res.status === 200){
                return true
            }
        }catch(error){
            console.log(`There's an error on adding new cluster fund ${error}`)
        }
    }

    const getFundCluster = async () => {
        try{
            const res = await axios.get('http://localhost:4000/admin/getFundCluster', {
                withCredentials: true
            })
            if(res.status === 200){
                const arr = res.data.formData
                sessionStorage.setItem('FundClusterData', JSON.stringify(arr));
                return arr
            }
        }catch(error){
            console.log(`There's an error on fetching cluster fund ${error}`)
        }
    }

    const deleteFundCluster = async (field_key) => {
        try{
            const res = await axios.delete(`http://localhost:4000/admin/deleteFundCluster/${field_key}`, {
                withCredentials: true
            })
            if(res.status === 200){
                return true
            }
            return false
        }catch(error){
            console.log(`There's an error on fetching cluster fund ${error}`)
            return false
        }
    }

    const addNewNameAndOffice = async (name, office, key) => {
        try{
            const data = {
                name: name,
                office: office,
                key: key
            }

            const res = await axios.post('http://localhost:4000/admin/addNameAndOffice', data, {
                withCredentials: true
            })

            if(res.status === 200){
                return
            }
        }catch(error){
            console.log(`Error in creating new name and office ${error}`)
        }
    }

    const getNameAndOffice = async () => {
        try{
            const res = await axios.get('http://localhost:4000/admin/getNameAndOffice', {
                withCredentials: true
            })
            if(res.status === 200){
                const arr = res.data.formData
                sessionStorage.setItem('NameAndOfficeData', JSON.stringify(arr));
                return arr
            }
        }catch(error){
            console.log(`There's an error on fetching name and office ${error}`)
        }
    }

    const deleteNameAndOffice = async (field_key) => {
        try{
            const res = await axios.delete(`http://localhost:4000/admin/deleteNameAndOffice/${field_key}`, {
                withCredentials: true
            })
            if(res.status === 200){
                return true
            }
            return false
        }catch(error){
            console.log(`There's an error on deleting name and office ${error}`)
            return false
        }
    }

    const addNewRC = async (newRC, randKey) => {
        try{
            const data = {
                RC: newRC,
                key: randKey
            }

            const res = await axios.post('http://localhost:4000/admin/addRC', data, {
                withCredentials: true
            })

            if(res.status === 200){
                return true
            }
        }catch(error){
            console.log(`There's an error on adding new RC ${error}`)
        }
    }

    const getRC = async () => {
        try{
            const res = await axios.get('http://localhost:4000/admin/getRC', {
                withCredentials: true
            })
            if(res.status === 200){
                const arr = res.data.formData
                console.log('successfully added new RC', arr)
                sessionStorage.setItem('RCData', JSON.stringify(arr));
                return arr
                
            }
        }catch(error){
            console.log(`There's an error on fetching RC ${error}`)
        }
    }

    const deleteRC = async (field_key) => {
        try{
            const res = await axios.delete(`http://localhost:4000/admin/deleteRC/${field_key}`, {
                withCredentials: true
            })
            if(res.status === 200){
                return true
            }
            return false
        }catch(error){
            console.log(`There's an error on fetching RC ${error}`)
            return false
        }
    }

    const addTax = async (tax, title, formula1, formula2, key) => {
        try{
            const data = {
                tax: tax,
                title: title,
                formula1: formula1,
                formula2: formula2,
                key: key
            }

            const res = await axios.post('http://localhost:4000/admin/addTaxType', data, {
                withCredentials: true
            })

            if(res.status === 200){
                return true
            }
        }catch(error){
            console.log(`Error in creating new name and office ${error}`)
        }
    }

    const getTaxType = async () => {
        try{
            const res = await axios.get('http://localhost:4000/admin/getTaxType', {
                withCredentials: true
            })
            if(res.status === 200){
                const arr = res.data.formData
                sessionStorage.setItem('TaxTypeData', JSON.stringify(arr));
                return arr
                
            }
        }catch(error){
            console.log(`There's an error on fetching tax ${error}`)
        }
    }

    const deleteTax = async (field_key) => {
        try{
            const res = await axios.delete(`http://localhost:4000/admin/deleteTax/${field_key}`, {
                withCredentials: true
            })
            if(res.status === 200){
                return true
            }
            return false
        }catch(error){
            console.log(`There's an error on deleting tax ${error}`)
            return false
        }
    }

  return {
    approveDV, 
    addNewFundCluster, 
    getFundCluster, 
    deleteFundCluster, 
    addNewNameAndOffice,
    deleteNameAndOffice,
    getNameAndOffice,
    addNewRC,
    getRC,
    deleteRC,
    addTax,
    getTaxType,
    deleteTax,
    isLoading, 
    error
    }
}