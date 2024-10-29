import {useState} from 'react'
import {auth} from '../config/firebase-config';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import axios from 'axios'

export const useSuperAdminHook = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const apiURL = import.meta.env.VITE_API_URL

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

    return{ createAcc, deleteUser, disableAcc, changeAccess, isLoading, error }
}
