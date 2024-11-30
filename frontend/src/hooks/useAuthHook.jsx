import { useState } from "react"
import axios from "axios"
import {useNavigate} from 'react-router-dom';

import { useAuthContext } from "./useAuthContext"
import { useDisbursementContext } from './useDisbursementContext.jsx';
import { useOpDisbursementContext } from './useOpDisbursementContext.jsx';
import { useHeadDisbursementContext } from './useHeadDisbursementContext.jsx';

import { getAuth, sendPasswordResetEmail, signOut, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useDispatch } from "react-redux";
import { setPermission } from "../redux/PermissionRedux.jsx"; 
import { toggleChangePassFlag, resetChangePassFlag } from '../redux/ChangePasswordFlagRedux.jsx'

import Cookies from 'universal-cookie';
import { disableNetwork, getFirestore } from "firebase/firestore";

export const useAuthHook = () => {
    const {dispatch: dispatchAuth} = useAuthContext()
    const {dispatch: dispatchDocuments} = useDisbursementContext()
    const { dispatch: dispatchOpDocuments } = useOpDisbursementContext()
    const { dispatch: dispatchHeadDocuments } = useHeadDisbursementContext()
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const cookies = new Cookies();
    const navigate = useNavigate()
    const provider = new GoogleAuthProvider();

    const login = async (email, password) => {
        setIsLoading(true)
        setError(null)
        const auth = getAuth()
        try{
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          const token = await userCredential.user.getIdToken();

          if (user.emailVerified) {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/login`, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
              },
              withCredentials: true,
            });
            if (response.status === 200) {
              const userData = response.data
              const data = {
                success: userData.success,
                name: userData.name,
                uemail: userData.uemail,
                uid: userData.uid,
                role: userData.role,
                firstTimeLogin: userData.firstTimeLogin
              }
              if(userData.firstTimeLogin){
                setIsLoading(false)
                dispatch(toggleChangePassFlag())
              } else {
                cookies.set('user', JSON.stringify(data), { path: '/', secure: true, sameSite: 'Strict' });
                dispatchAuth({type: 'LOGIN', payload: data})
                setIsLoading(false)
              }
            }
          }else{
            setIsLoading(false)
            setError('Please verify your email.')
          }
        }
        catch(error){
          setIsLoading(false)
          const errorMessage = error.response?.data?.message || error.message || "An error occurred";
          setError(errorMessage);
          console.log(error)
        }
    }

    const logout = async () => {
        const auth = getAuth();  
        const db = getFirestore()
        try{
          await signOut(auth);
          await disableNetwork(db)
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/logout`, {
            withCredentials: true
          });
          if(response.status === 200){
            dispatch(resetChangePassFlag())
            dispatchAuth({type: 'LOGOUT', payload: null})
            dispatchDocuments({type: 'SET_DOCUMENTS', payload: null })
            dispatchOpDocuments({type: 'SET_OPDOCUMENTS', payload: null })
            dispatchHeadDocuments({type: 'SET_HEADDOCUMENTS', payload: null })
            dispatch(setPermission(null))
            cookies.remove('user', { path: '/' });
            navigate('/', {replace: true})
          }
        }catch(error){
          console.log(`error logging out ${error}`)
        }
      }

      const resetPassword = async(email) => {
        setIsLoading(true)
        setError(null)

        const auth = getAuth()

        try {
          await sendPasswordResetEmail(auth, email)
          setIsLoading(false);
          return true;
        } catch (error) {
          setIsLoading(false)
          const errorMessage = error.response?.data?.message || error.message || "An error occurred";
          setError(errorMessage);
          console.log(error)
        }
      } 

      const googleLogin = async () => {
        const auth = getAuth();  
        try{
            const result = await signInWithPopup(auth, provider);
            const token = await result.user.getIdToken()
            const user = result.user;
            if (user.emailVerified) {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, {}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token} `
                    },
                    withCredentials: true,
                });
          
                if (response.status === 200) {
                    cookies.set('user', JSON.stringify(response.data), { path: '/', secure: true, sameSite: 'strict' });
                    dispatch({type: 'LOGIN', payload: response.data})
                    setIsLoading(false)
                }
            }else{
                setIsLoading(false)
                setError('Please verify your email.')
            }


        }catch(error){
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setError(errorMessage);
            console.log(`error on google signup: ${error}`)
        }
    }

    const ChangePassword = async(newPassword, currentPassword) => {
      setIsLoading(true)
      setError(null)
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setIsLoading(false);
        setError("No user is currently logged in.");
        return;
      }

      try {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);

        const token = await user.getIdToken();
        await updatePassword(user, newPassword)
        const res = await axios.patch(`${import.meta.env.VITE_API_URL}/user/changePass`, {}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token} `
          }
        })
        if(res.status === 200){
          setIsLoading(false)
          cookies.set('user', JSON.stringify(res.data), { path: '/', secure: true, sameSite: 'Strict' });
          dispatchAuth({type: 'LOGIN', payload: res.data})
          dispatch(resetChangePassFlag())
        }
        return true
      } catch (error) {
        setIsLoading(false)
        const errorMessage = error.response?.data?.message || error.message || "An error occurred";
        setError(errorMessage);
        console.log(`Error changing password: ${error}`)
      }
    }

    return {login, logout, googleLogin,resetPassword, ChangePassword, isLoading, error}
}