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
          const user = userCredential.user;
          const token = await userCredential.user.getIdToken();

          //remove !
          if (user.emailVerified) {
            console.log('hit')
            const response = await axios.post('http://localhost:4000/user/login', {}, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
              },
              withCredentials: true,
            });
          
            console.log(response)
            if (response.status === 200) {
              console.log("success")
              console.log(response.data)
              cookies.set('user', JSON.stringify(response.data), { path: '/', secure: true, sameSite: 'strict' });
              dispatch({type: 'LOGIN', payload: response.data})
              setIsLoading(false)
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
    return {login, isLoading, error}
}