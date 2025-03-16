import { useState } from "react";
import axios from "axios";
import { firestore } from "../config/firebase-config"
import { collection, query, onSnapshot, doc, getDocs } from "firebase/firestore"
import { setControlBook, deleteFolder, deleteProject } from '../redux/ControlBookRedux' 
import { useDispatch } from "react-redux";
import { deleteDVrecords } from '../redux/DVUsersRedux'

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

    const updateCASH = async(data, DV) => {
        setIsLoading(true)
        setError(null)
        try{
            const res = await axios.patch(`${apiURL}/operator/handleCash/${DV}`, data, {
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
                dispatchFolder(deleteDVrecords(data.data.DV))
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
            return false
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

    

    const retrieveDvData = async (id, fieldID, callback) => {
        try{
            const q = query(collection(firestore, "ControlBook", id, "FieldOffices", fieldID, "DV"));
            const querySnapshot = await getDocs(q);
            const dvData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            callback(dvData);

        }catch(err){
            console.log(`error on retrieving dv data ${id} : `, err)
        }
    }

    const retrieveChosenCB = (id, callback) => {

        if (!id) {
            return () => {};
        }

        try{
            const q = query(collection(firestore, "ControlBook", id, "FieldOffices"));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const fieldOffices = {}
                snapshot.docs.forEach(doc => {
                    fieldOffices[doc.id] = {...doc.data()}
                });
                callback(fieldOffices);
              });
              return unsubscribe;
        }catch(err){
            console.log(`error on retrieving ${id} : `, err)
            return () => {};
        }
    }

    const retrieveControlBooks = (dispatch) => {
        const q = query(collection(firestore, 'ControlBook'));
        const unsubscribeControlBook = onSnapshot(q, (snapshot) => {
            const controlBooks = snapshot.docs.reduce((acc, doc) => {
                acc[doc.id] = doc.data()
                return acc
            }, {})
            dispatch(setControlBook(controlBooks));
        });

        return unsubscribeControlBook
        
    }

    const EretrieveControlBooks = async (dispatch) => {
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
            //   dispatch(setControlBook(updatedControlBooks));
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
                //   console.log(updatedControlBooks)
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

    // const retrieveControlBooks = async (dispatch) => {
    //     const q = query(collection(firestore, 'ControlBook'));
    //     const controlBookSnapshot = await getDocs(q);
    //     console.log(controlBookSnapshot)
    //     let controlBooks = {};
      
    //     for (const doc of controlBookSnapshot.docs) {
    //       const controlBookId = doc.id;
    //       controlBooks[controlBookId] = { ...doc.data(), fieldOffices: {} };
      
    //       // Fetch FieldOffices sub-collection
    //       const fieldOfficesSnapshot = await getDocs(collection(firestore, 'ControlBook', controlBookId, 'FieldOffices'));
    //       let fieldOfficesData = {};
      
    //       for (const fieldOfficeDoc of fieldOfficesSnapshot.docs) {
    //         const fieldOfficeId = fieldOfficeDoc.id;
    //         fieldOfficesData[fieldOfficeId] = { ...fieldOfficeDoc.data(), dvCollection: {} };
      
    //         // Fetch DV sub-collection
    //         const dvSnapshot = await getDocs(collection(firestore, 'ControlBook', controlBookId, 'FieldOffices', fieldOfficeId, 'DV'));
    //         const dvData = {};
    //         dvSnapshot.docs.forEach((dvDoc) => {
    //           dvData[dvDoc.id] = dvDoc.data();
    //         });
      
    //         fieldOfficesData[fieldOfficeId].dvCollection = dvData;
    //       }
      
    //       controlBooks[controlBookId].fieldOffices = fieldOfficesData;
    //     }
      
    //     dispatch(setControlBook(controlBooks)); // Dispatch once instead of on every update
    //   };
      
    
      
      
      

    // const retrieveProjectName = async (setASANo) => {
    //     const docRef = doc(firestore,'formData', 'ControlBook');
    //     const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
    //         if (docSnapshot.exists()) {
    //             const projectData = docSnapshot.data()
    //             sessionStorage.setItem('ProjectName', JSON.stringify(projectData))
    //             setASANo(projectData)

    //         } else {
    //             // Document does not exist
    //             console.log("Document not found");
    //         }

    //         return unsubscribe
    //     })
    // }

    const retrieveProjectName = async (setASANo) => {
        const docRef = doc(firestore,'formData', 'ControlBook');
        const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const projectData = docSnapshot.data()
                sessionStorage.setItem('ProjectName', JSON.stringify(projectData))
                const newData = transformData(projectData)
                setASANo(newData)

            } else {
                // Document does not exist
                console.log("Document not found");
            }

            return unsubscribe
        })
    }

    const transformData = (projData) => {
        const transformed = {};
        for(const [mainKey, projArray] of Object.entries(projData)){
            transformed[mainKey] = {};
            projArray.forEach((project) => {
                const projectID = project.projectID;
                transformed[mainKey][projectID] = {
                    RO: project.RO,
                    projectName: project.projectName,
                    tabStatus: project.tabStatus,
                    cash: project.cash
                };
            })
        }
        return transformed
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
                // dispatchFolder(deleteProject(id))
                return true
            }
        } catch(error) {
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setError(errorMessage);
            console.log(error)
        }
    }

    const deleteASA_COB = async(id) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await axios.delete(`${apiURL}/operator/deleteASA_COB/${id}`, {
                withCredentials: true
            })
            if(res.status === 200) {
                setIsLoading(false)
                // dispatchFolder(deleteProject(id))
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
            return false
        }
    }

    const addingTab = async(tab, ASANo) => {
        setIsLoading(true)
        setError(null)
        try{
            const res = await axios.post(`${apiURL}/operator/addTab/${ASANo}`, tab, {
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
            console.log(error)
            return false
        }
    }

    const disableCB = async (data) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await axios.patch(`${apiURL}/operator/change-status/${data.id}`, data, {
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
            console.log(error.message)
        }
    }

    const addIMO = async(data, id) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await axios.patch(`${apiURL}/operator/add-imo/${id}`, data, {
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
            console.log(error.message)
        }
    }

    const AddNewUtility = async(data) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await axios.post(`${apiURL}/operator/addNewUtility/${data.ASANo}`, data, {
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

    const add_ASA_cashFO = async(data) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await axios.post(`${apiURL}/operator/add_ASA_cashFO`, data, {
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

    const handleBURCreation = async(data) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await axios.post(`${apiURL}/operator/createBUR`, data, {
                withCredentials: true
            })

            if(response.status === 200) {
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

    const handleBURDeletion = async(id) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await axios.delete(`${apiURL}/operator/deleteBUR/${id}`, {
                withCredentials: true
            })

            if(response.status === 200) {
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

    const handleBURUpdate = async(data, id) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await axios.patch(`${apiURL}/operator/updateBUR/${id}`, data, {
                withCredentials: true
            })

            if(response.status === 200) {
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

    const submitBURToBO = async(data) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await axios.post(`${apiURL}/operator/passBUR/`, data, {
                withCredentials: true
            })

            if(response.status === 200) {
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
        returnDoc, 
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
        addingTab,
        retrieveChosenCB,
        retrieveDvData,
        updateCASH,
        disableCB,
        addIMO,
        AddNewUtility,
        deleteASA_COB,
        add_ASA_cashFO,
        handleBURCreation,
        handleBURDeletion,
        handleBURUpdate,
        submitBURToBO,
        isLoading, 
        error
    }
}