import axios from "axios"
import { useState } from "react"

export const useChangeAccess = () => {  
    const [isLoading, setIsLoading] = useState(false)

    const changeAccess = async(roleName, newPermission) => {
        setIsLoading(true)
        try {
            const res = await axios.patch(`http://localhost:4000/superadmin/changePermission/${roleName}`, {newPermission}, {
                withCredentials: true
            })
            if(res.status === 200){
                const data = res.data
                console.log(data)
                return true
            }
        } catch (error) {
            setIsLoading(false)
            console.log(error)
        }
    }
    return {changeAccess, isLoading}
}
