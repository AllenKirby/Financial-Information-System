import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebase-config';
import Cookies from 'universal-cookie';
import { useState } from "react"
import { useAuthContext } from "./useAuthContext"
import axios from "axios"

export const useGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    const {dispatch} = useAuthContext()
    const [isLoadingGoogle, setIsLoading] = useState(false)
    const [errorGoogle, setError] = useState(null)
    const cookies = new Cookies();
    const googleLogin = async () => {
        
        try{
            const result = await signInWithPopup(auth, provider);
            const token = await result.user.getIdToken()
            const user = result.user;
            if (user.emailVerified) {
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


        }catch(error){
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setError(errorMessage);
            console.log(`error on google signup: ${error}`)
        }
    }
    return {googleLogin, isLoadingGoogle, errorGoogle}
}