import { useState } from "react";
import axios from "axios";
import { firestore } from "../config/firebase-config"
import { collection, query, onSnapshot, doc } from "firebase/firestore"
import { setControlBook, deleteFolder } from '../redux/ControlBookRedux'
import { useDispatch } from "react-redux";

export const useFundingHook = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const apiURL = import.meta.env.VITE_API_URL
    const dispatchFolder = useDispatch()

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

    const updateASA_ORS = async(data, DV) => {
        setIsLoading(true)
        setError(null)
        try{
            const res = await axios.patch(`${apiURL}/operator/updateASA_ORS/${DV}`, data, {
                withCredentials: true
            })
            if (res.status === 200){
                setIsLoading(false)
                return true
            }
        }catch(error){
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
      
        // Main listener for ControlBook collection
        const unsubscribeControlBook = onSnapshot(q, (snapshot) => {
          const controlBooks = {};
            
          // For each document in ControlBook collection
          snapshot.docs.forEach((doc) => {
            controlBooks[doc.id] = { ...doc.data(), fieldOffices: {} };
      
            // Listener for each FieldOffices sub-collection within the ControlBook document
            const subcollectionQuery = collection(firestore, 'ControlBook', doc.id, 'FieldOffices');
            const unsubscribeSubcollection = onSnapshot(subcollectionQuery, (subSnapshot) => {
              const fieldOfficesData = {};
              const updatedControlBooks = JSON.parse(JSON.stringify(controlBooks));
              dispatch(setControlBook(updatedControlBooks));
              // For each FieldOffices document
              subSnapshot.docs.forEach((subDoc) => {
                const fieldOfficeData = { ...subDoc.data(), dvCollection: {} };
                
                // Listener for each DV sub-collection within FieldOffices
                const dvQuery = collection(firestore, 'ControlBook', doc.id, 'FieldOffices', subDoc.id, 'DV');
                const unsubscribeDV = onSnapshot(dvQuery, (dvSnapshot) => {
                  const dvData = dvSnapshot.docs.reduce((acc, dvDoc) => {
                    acc[dvDoc.id] = dvDoc.data();
                    return acc;
                  }, {});
      
                  // Set DV data in the FieldOffice document
                  fieldOfficeData.dvCollection = dvData;
                  fieldOfficesData[subDoc.id] = fieldOfficeData;
      
                  // Deep copy of controlBooks to trigger React state update
                  const updatedControlBooks = JSON.parse(JSON.stringify(controlBooks));
                  dispatch(setControlBook(updatedControlBooks));
                  
                });
      
                // Add unsubscribe function for DV collection
                fieldOfficeData.unsubscribeDV = unsubscribeDV;
              });
      
              // Set FieldOffices data in the ControlBook document
              controlBooks[doc.id].fieldOffices = fieldOfficesData;
            });
      
            // Add unsubscribe function for FieldOffices sub-collection
            controlBooks[doc.id].unsubscribeSubcollection = unsubscribeSubcollection;
          });
        });
      
        return unsubscribeControlBook;
      };
      
      

    const retrieveProjectName = async (setASANo) => {
        const docRef = doc(firestore,'formData', 'ControlBook');
        const unsubscribe = onSnapshot(docRef, async (docSnapshot) => {
            if (docSnapshot.exists()) {
                // Document data is available
                const projectData = docSnapshot.data()
                sessionStorage.setItem('ProjectName', JSON.stringify(projectData))
                setASANo(projectData)

            } else {
                // Document does not exist
                console.log("Document not found");
            }

            return unsubscribe
        })
    }
    
    const updateControlBook = async(data, id) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await axios.patch(`${apiURL}/operator/updateControlBook/${id}`, data, {
                withCredentials: true
            })
            if(res.status === 200) {
                setIsLoading(false)
                return true
            }
        } catch(error) {
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setError(errorMessage);
            console.log(error)
        }
    }

    const deleteControlBook = async(id) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await axios.delete(`${apiURL}/operator/deleteControlBook/${id}`, {
                withCredentials: true
            })
            if(res.status === 200) {
                setIsLoading(false)
                dispatchFolder(deleteFolder(id))
                return true
            }
        } catch(error) {
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setError(errorMessage);
            console.log(error)
        }
    }

    const deleteFieldOffice = async(id) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await axios.delete(`${apiURL}/operator/deleteFieldOffice/${id}`, {
                withCredentials: true
            })
            if(res.status === 200) {
                setIsLoading(false)
                return true
            }
        } catch(error) {
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setError(errorMessage);
            console.log(error)
        }
    }

    const updateFieldOffice = async(data) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await axios.patch(`${apiURL}/operator/updateFieldOffice/${data.id}`, data, {
                withCredentials: true
            })
            if(res.status === 200) {
                setIsLoading(false)
                return true
            }
        } catch(error) {
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setError(errorMessage);
            console.log(error)
        }
    }
      
    return {
        returnDoc, 
        inputOperator, 
        transferToHead, 
        appendDataToSheet, 
        AddControlBook,
        AddFieldOffice, 
        retrieveControlBooks, 
        updateControlBook, 
        deleteControlBook,
        deleteFieldOffice,
        updateFieldOffice,
        retrieveProjectName,
        updateASA_ORS,
        isLoading, 
        error
    }
}