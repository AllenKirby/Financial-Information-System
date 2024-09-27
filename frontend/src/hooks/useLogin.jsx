import { useState } from "react"
import axios from "axios"
import { useAuthContext } from "./useAuthContext"
import {auth} from '../config/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Cookies from 'universal-cookie';

export const useLogin = () => {
    const {dispatch} = useAuthContext()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const cookies = new Cookies();

    const login = async (email, password) => {
        setIsLoading(true)
        setError(null)
        try{
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const token = await userCredential.user.getIdToken();
          const data = {
            uid: userCredential.user.uid
          }
          const response = await axios.post('http://localhost:4000/', data, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
            }
          });
          
          console.log(response)
          if (response.status === 200) {
            console.log("success")
            cookies.set('user', JSON.stringify(response.data), { path: '/', maxAge: 86400, secure: true, sameSite: 'strict' });
            dispatch({type: 'LOGIN', payload: response.data})
            setIsLoading(false)
          } 
        }
        catch(error){
          setIsLoading(false)
          const errorMessage = error.response?.data?.message || error.message || "An error occurred";
          setError(errorMessage);
          console.log(error)
        }
    }
    return {login, isLoading, error}
}