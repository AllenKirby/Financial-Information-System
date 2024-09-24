import { AuthContext } from '../context/AuthContext'
import { useContext } from "react";

export const useAuthContext = () =>{
    const context = useContext(AuthContext)

    if(!context){
        throw Error('AuthContext is not found.')
    }
    return context
}