import axios from 'axios'
import { useState } from 'react'

export const useDisableUser = () => {
    const [isLoading, setIsLoading] = useState(false)
    const disableAcc = async(uid, flag) => {
        console.log(flag)
        setIsLoading(true)
        try{
            const res = await axios.patch(`http://localhost:4000/superadmin/disableAcc/${uid}`, {flag}, {
                withCredentials: true
            })
            if(res.status == 200){
                setIsLoading(false)
                const user = res.data
                console.log('Account Disable', user)
                return true
            }
        }catch(error){
            setIsLoading(false)
            console.log(error.response ? error.response.data : error.message)
        }
    }
  return {disableAcc, isLoading}
}
