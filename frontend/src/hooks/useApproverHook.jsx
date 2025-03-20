import axios from "axios"
import { useState } from "react"
import { firestore } from "../config/firebase-config"
import { collection, query, onSnapshot } from "firebase/firestore"
import { setVouchers } from '../redux/AllVouchersRedux'
import { deleteDVrecords } from '../redux/DVUsersRedux'
import { useDispatch } from 'react-redux'

export const useApproverHook = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const apiURL = import.meta.env.VITE_API_URL
    const dispatch = useDispatch()

    const approveDV = async(DV, data) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await axios.patch(`${apiURL}/admin/approveDocu/${DV}`,{data}, {
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
        setIsLoading(true)
        setError(null)
        try{
            const data = {
                cluster: newFundCluster,
                key: randKey
            }

            const res = await axios.post(`${apiURL}/admin/addNewFundCluster`, data, {
                withCredentials: true
            })

            if(res.status === 200){
                setIsLoading(false)
                return true
            }
        }catch(error){
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setError(errorMessage);
            console.log(errorMessage)
        }
    }

    const getFundCluster = async () => {
        try{
            const res = await axios.get(`${apiURL}/admin/getFundCluster`, {
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
        setIsLoading(true)
        setError(null)
        try{
            const res = await axios.delete(`${apiURL}/admin/deleteFundCluster/${field_key}`, {
                withCredentials: true
            })
            if(res.status === 200){
                setIsLoading(false)
                return true
            }
        }catch(error){
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setError(errorMessage);
            console.log(errorMessage)
        }
    }

    const addNewNameAndOffice = async (name, office, key) => {
        setIsLoading(true)
        setError(null)
        try{
            const data = {
                name: name,
                office: office,
                key: key
            }
            const res = await axios.post(`${apiURL}/admin/addNameAndOffice`, data, {
                withCredentials: true
            })

            if(res.status === 200){
                setIsLoading(false)
                return true
            }
        }catch(error){
            console.log(`Error in creating new name and office ${error}`)
            return false
        }
    }

    const getNameAndOffice = async () => {
        try{
            const res = await axios.get(`${apiURL}/admin/getNameAndOffice`, {
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
        setIsLoading(true)
        setError(null)
        try{
            const res = await axios.delete(`${apiURL}/admin/deleteNameAndOffice/${field_key}`, {
                withCredentials: true
            })
            if(res.status === 200){
                setIsLoading(false)
                return true
            }
            return false
        }catch(error){
            console.log(`There's an error on deleting name and office ${error}`)
            return false
        }
    }

    const addNewRC = async (newRC, randKey) => {
        setIsLoading(true)
        setError(null)
        try{
            const data = {
                RC: newRC,
                key: randKey
            }

            const res = await axios.post(`${apiURL}/admin/addRC`, data, {
                withCredentials: true
            })

            if(res.status === 200){
                setIsLoading(false)
                return true
            }
        }catch(error){
            console.log(`There's an error on adding new RC ${error}`)
        }
    }

    const getRC = async () => {
        try{
            const res = await axios.get(`${apiURL}/admin/getRC`, {
                withCredentials: true
            })
            if(res.status === 200){
                const arr = res.data.formData
                sessionStorage.setItem('RCData', JSON.stringify(arr));
                return arr
                
            }
        }catch(error){
            console.log(`There's an error on fetching RC ${error}`)
        }
    }

    const deleteRC = async (field_key) => {
        setIsLoading(true)
        setError(null)
        try{
            const res = await axios.delete(`${apiURL}/admin/deleteRC/${field_key}`, {
                withCredentials: true
            })
            if(res.status === 200){
                setIsLoading(false)
                return true
            }
            return false
        }catch(error){
            console.log(`There's an error on fetching RC ${error}`)
            return false
        }
    }

    const addTax = async (tax, title, formula1, formula2, key) => {
        setIsLoading(true)
        setError(null)
        try{
            const data = {
                tax: tax,
                title: title,
                formula1: formula1,
                formula2: formula2,
                key: key
            }

            const res = await axios.post(`${apiURL}/admin/addTaxType`, data, {
                withCredentials: true
            })

            if(res.status === 200){
                setIsLoading(false)
                return true
            }
        }catch(error){
            console.log(`Error in creating new name and office ${error}`)
        }
    }

    const getTaxType = async () => {
        try{
            const res = await axios.get(`${apiURL}/admin/getTaxType`, {
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
        setIsLoading(true)
        setError(null)
        try{
            const res = await axios.delete(`${apiURL}/admin/deleteTax/${field_key}`, {
                withCredentials: true
            })
            if(res.status === 200){
                setIsLoading(false)
                return true
            }
            return false
        }catch(error){
            console.log(`There's an error on deleting tax ${error}`)
            return false
        }
    }

    const getRecords = async(dispatch) => {
        const q = query(collection(firestore, 'records'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
        const records = snapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = {...doc.data()}
            return acc;
            }, {});
            dispatch(setVouchers(records))
        })

        
        return unsubscribe 
    } 

    const downloadDV = async (data) => {
        setIsLoading(true)
        setError(null)
        try {
            let res
            if(data.activeTab === 'To Payment'){
                res = await axios.post(`${apiURL}/admin/downloadDV`, {data}, {
                    responseType: 'blob',
                    withCredentials: true
                })
            }else if(data.activeTab === 'GSIS'){
                res = await axios.post(`${apiURL}/admin/downloadGSIS`, {data}, {
                    responseType: 'blob',
                    withCredentials: true
                })
            }else if(data.activeTab === 'Meralco'){
                res = await axios.post(`${apiURL}/admin/downloadDV`, {data}, {
                    responseType: 'blob',
                    withCredentials: true
                })
            }else if(data.activeTab === 'Others'){
                res = await axios.post(`${apiURL}/admin/downloadGSISRefund`, {data}, {
                    responseType: 'blob',
                    withCredentials: true
                })
            }
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'populated-template.xlsx'); // File name
            document.body.appendChild(link);
            link.click();
            link.remove();
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setError(errorMessage);
            console.log(errorMessage)
        }
    }

    const downloadBUR = async (data) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await axios.post(`${apiURL}/admin/downloadBUR`, {data}, {
                    responseType: 'blob',
                    withCredentials: true
                })
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${data.payee}.xlsx`); // File name
            document.body.appendChild(link);
            link.click();
            link.remove();
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setError(errorMessage);
            console.log(errorMessage)
        }
    }
    
    const returnDocFromAdmin = async (data) => {
        setError(null)
        setIsLoading(true)
        try{
            const res = await axios.post(`${apiURL}/admin/returnRecords`, data, {
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

    const updateFundCluster = async(key, updatedFundCluster) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await axios.patch(`${apiURL}/admin/updateFundCluster/${key}`,{ updatedFundCluster}, {
                withCredentials: true
            })
            if(res.status === 200) {
                setIsLoading(false)
                return true
            }
        } catch (error) {
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "Error updating fund cluster";
            setError(errorMessage);
            console.log(error)
        }
    }

    const updateResCen = async(key, updatedResCen) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await axios.patch(`${apiURL}/admin/updateResCen/${key}`,{ updatedResCen}, {
                withCredentials: true
            })
            if(res.status === 200) {
                setIsLoading(false)
                return true
            }
        } catch (error) {
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "Error updating responsibility center";
            setError(errorMessage);
            console.log(error)
        }
    }

    const updateNameOffice = async(key, updatedName, updatedOffice) => {
        setIsLoading(true)
        setError(null)
        const data = {
            updatedName: updatedName,
            updatedOffice: updatedOffice
        }
        try {
            const res = await axios.patch(`${apiURL}/admin/updateNameOffice/${key}`, data, {
                withCredentials: true
            })
            if(res.status === 200) {
                setIsLoading(false)
                return true
            }
        } catch (error) {
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "Error updating Name and Office";
            setError(errorMessage);
            console.log(error)
        }
    }

    const updateTaxType = async(key, updatedTax, updatedCost, updatedValue1, updatedValue2) => {
        setIsLoading(true)
        setError(null)
        const data = {
            updatedTax: updatedTax,
            updatedCost: updatedCost,
            updatedValue1: updatedValue1,
            updatedValue2: updatedValue2,
        }
        try {
            const res = await axios.patch(`${apiURL}/admin/updateTaxType/${key}`, data, {
                withCredentials: true
            })
            if(res.status === 200) {
                setIsLoading(false)
                return true
            }
        } catch (error) {
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "Error updating Tax Type";
            setError(errorMessage);
            console.log(error)
        }
    }

    const approveBUR = async(BUR, data) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await axios.patch(`${apiURL}/admin/approveBUR/${BUR}`,{data}, {
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

    const returnBURFromAdmin = async (data) => {
        setError(null)
        setIsLoading(true)
        try{
            const res = await axios.post(`${apiURL}/admin/returnBURRecords`, data, {
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
    getRecords,
    downloadDV,
    returnDocFromAdmin,
    updateFundCluster,
    updateResCen,
    updateNameOffice,
    updateTaxType,
    approveBUR,
    returnBURFromAdmin,
    downloadBUR,
    isLoading, 
    error
    }
}