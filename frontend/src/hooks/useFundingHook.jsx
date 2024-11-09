import { useState } from "react";
import axios from "axios";
import { firestore } from "../config/firebase-config"
import { collection, query, onSnapshot } from "firebase/firestore"
import { setControlBook } from '../redux/ControlBookRedux'

export const useFundingHook = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const apiURL = import.meta.env.VITE_API_URL

    const returnDoc = async (data) => {
        setError(null)
        setIsLoading(true)
        try{
            const res = await axios.post(`${apiURL}/operator/return_record`, data, {
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
            const res = await axios.patch(`${apiURL}/operator/update_records/${DV}`, data, {
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
            const res = await axios.post(`${apiURL}/operator/transferDocu`, data, {
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
            const res = await axios.post(`${apiURL}/operator/appendDataToSheet`, data, {
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

    const AddControlBook = async(data) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await axios.post(`${apiURL}/operator/addControlBook`, data, {
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

    const AddFieldOffice = async(data) => {
        console.log(data.ASANo)
        setIsLoading(true)
        setError(null)
        try {
            const res = await axios.post(`${apiURL}/operator/addFieldOffice/${data.ASANo}`, data, {
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

    const retrieveControlBooks = async (dispatch) => {
        const q = query(collection(firestore, 'ControlBook'));
        const unsubscribeControlBook = onSnapshot(q, (snapshot) => {
          const controlBooks = {};
      
          snapshot.docs.forEach((doc) => {
            controlBooks[doc.id] = { ...doc.data(), subcollection: {} };
      
            const subcollectionQuery = collection(firestore, 'ControlBook', doc.id, 'FieldOffices');
            const unsubscribeSubcollection = onSnapshot(subcollectionQuery, (subSnapshot) => {
              const subcollectionData = subSnapshot.docs.reduce((acc, subDoc) => {
                acc[subDoc.id] = { ...subDoc.data() };
                return acc;
              }, {});
              controlBooks[doc.id].subcollection = { ...subcollectionData };
              const cleanedControlBooks = JSON.parse(JSON.stringify(controlBooks));
              console.log(cleanedControlBooks)
              dispatch(setControlBook(cleanedControlBooks));
            });
      
            controlBooks[doc.id].unsubscribeSubcollection = unsubscribeSubcollection;
          });
        });
      
        return unsubscribeControlBook;
      };
      
      
    return {
        returnDoc, 
        inputOperator, 
        transferToHead, 
        appendDataToSheet, 
        AddControlBook,
        AddFieldOffice, 
        retrieveControlBooks, isLoading, error}
}