import {useState} from 'react'
import {auth} from '../config/firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios'

export const useCreateAcc = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const createAcc = async(userData) =>{   
        console.log('creating Account')
        setIsLoading(true)
        setError(null)
        try {
            const newUser = await createUserWithEmailAndPassword(auth, userData.email, userData.password)

            // const uid = newUser.user.uid
            const newUser_token = await newUser.user.getIdToken();
            const data = {
                role: userData.role,
                name: `${userData.firstname} ${userData.lastname}`
            }
            console.log(`userCreateAcc ${userData.role}`)
            const res = await axios.post('http://localhost:4000/admin/create', data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${newUser_token}` 
                },
                withCredentials: true
            })

            if(res.status === 200){
                console.log(res.data)
                setIsLoading(false)
                return true;
            }
            return false
            
        } catch (error) {
            setIsLoading(false)
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            setError(errorMessage);
            console.log(error)
        }
    }
    return{ createAcc, isLoading, error }
}
