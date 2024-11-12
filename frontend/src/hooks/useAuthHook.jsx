import { useState } from "react"
import axios from "axios"
import {useNavigate} from 'react-router-dom';

import { useAuthContext } from "./useAuthContext"
import { useDisbursementContext } from './useDisbursementContext.jsx';
import { useOpDisbursementContext } from './useOpDisbursementContext.jsx';
import { useHeadDisbursementContext } from './useHeadDisbursementContext.jsx';

import {auth} from '../config/firebase-config';
import { getAuth, signOut } from "firebase/auth"; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useDispatch } from "react-redux";
import { setPermission } from "../redux/PermissionRedux.jsx"; 

import Cookies from 'universal-cookie';

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
        try{
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          const token = await userCredential.user.getIdToken();

          //remove !
          if (user.emailVerified) {
            console.log('hit')
            // const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, {}, {
            //   headers: {
            //     'Content-Type': 'application/json',
            //     'Authorization': `Bearer ${token}` 
            //   },
            //   withCredentials: true,
            // });
          
            // console.log(response)
            // if (response.status === 200) {
            //   cookies.set('user', JSON.stringify(response.data), { path: '/', secure: true, sameSite: 'None' });
            //   dispatchAuth({type: 'LOGIN', payload: response.data})
            //   setIsLoading(false)
            // }
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
        try{
          await signOut(auth);
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/logout`, {}, {
            withCredentials: true
          });
          if(response.status === 200){
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

      const googleLogin = async () => {
        
        try{
            const result = await signInWithPopup(auth, provider);
            const token = await result.user.getIdToken()
            const user = result.user;
            if (user.emailVerified) {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, {}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    withCredentials: true,
                });
            
                console.log(response)
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

    return {login, logout, googleLogin,isLoading, error}
}