import axios from "axios"
import { useState } from "react"

export const useDeleteUser = () => {
    const [isLoadingDelete, setIsLoadingDelete] = useState(false)

    const deleteUser = async(role, uid) => {
        setIsLoadingDelete(true)
        try {
            const res = await axios.delete(`http://localhost:4000/superadmin/deleteAcc/${uid}|${role}` ,{
                withCredentials: true
            })
            if(res.status === 200){
                const user = res.data
                console.log(user)
                return true
            }
        } catch (error) {
            setIsLoadingDelete(false)
            console.log(error.response ? error.response.data : error.message)
        }
    }
  return {deleteUser, isLoadingDelete}
}
