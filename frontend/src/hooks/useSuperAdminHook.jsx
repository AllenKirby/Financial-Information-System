import {useState} from 'react'
import {auth} from '../config/firebase-config';
import { firestore } from "../config/firebase-config"
import { collection, query, onSnapshot } from "firebase/firestore"
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import {setRequests, deleteRequest} from '../redux/ResetPasswordRequests'
import axios from 'axios'
import {useDispatch} from 'react-redux'

export const useSuperAdminHook = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const apiURL = import.meta.env.VITE_API_URL
    const dispatchRequest = useDispatch()

    const createAcc = async(userData) =>{   
        setIsLoading(true)
        setError(null)
        try {
            const newUser = await createUserWithEmailAndPassword(auth, userData.email, userData.password)
            console.log(newUser)
            sendEmailVerification(newUser.user);
            const newUser_token = await newUser.user.getIdToken();
            const data = {
                role: userData.role,
                name: `${userData.firstname},${userData.lastname}`
            }
            const res = await axios.post(`${apiURL}/superadmin/create`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${newUser_token}` 
                },
                withCredentials: true
            })

            if(res.status === 200){
                setIsLoading(false)
                return true;
            }
            return false
            
        } catch (error) {
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setError(errorMessage);
            console.log(errorMessage)
        }
    }

    const deleteUser = async(uid) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await axios.delete(`${apiURL}/superadmin/deleteAcc/${uid}` ,{
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

    const disableAcc = async(uid, flag) => {
        setIsLoading(true)
        setError(null)
        try{
            const res = await axios.patch(`${apiURL}/superadmin/disableAcc/${uid}`, {flag}, {
                withCredentials: true
            })
            if(res.status == 200){
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

    const changeAccess = async(roleName, newPermission) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await axios.patch(`${apiURL}/superadmin/changePermission/${roleName}`, {newPermission}, {
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

    const getRequest = async(dispatch) => {
        const q = query(collection(firestore, 'resetPasswordRequest'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
        const requests = snapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = {...doc.data()}
            return acc;
        }, {});
            dispatch(setRequests(requests))
        })

        return () => unsubscribe()  
    }

    const updateRequest = async(id, flag, email = '') => {
        setIsLoading(true)
        setError(null)
        try {
            if(flag) {
                const auth = getAuth()
                await sendPasswordResetEmail(auth, email)
            }
            const res = await axios.delete(`${apiURL}/superadmin/deleteRequest/${id}`, {
                withCredentials: true
            })
            if(res.status === 200) {
                console.log(res.data)
                dispatchRequest(deleteRequest(id))
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

    return{ createAcc, deleteUser, disableAcc, changeAccess, getRequest, updateRequest, isLoading, error }
}
