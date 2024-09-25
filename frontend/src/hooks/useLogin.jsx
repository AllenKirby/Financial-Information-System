import { useState } from "react"
import axios from "axios"
import { useAuthContext } from "./useAuthContext"
import {auth} from '../config/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const useLogin = () => {
    const {dispatch} = useAuthContext()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const login = async (email, password) => {
        setIsLoading(true)
        setError(null)
        try{
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          console.log(`user credential: ${JSON.stringify(userCredential, null, 2)}`)
          const token = await userCredential.user.getIdToken();
          console.log(`credential token: ${token}`)
          const data = {
            uid: userCredential.user.uid,
            role: 'admin'
          }
          const response = await axios.post('http://localhost:4000/api/user/', data, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
            }
          });
          
          console.log(response)
          if (response.status === 200) {
            console.log("success")
            dispatch({type: 'LOGIN', payload: response.data})
            setIsLoading(false)
          } 
        }
        catch(error){
          setIsLoading(false)
          setError(error);
          console.error(error)
        }
    }
    return {login, isLoading, error}
}