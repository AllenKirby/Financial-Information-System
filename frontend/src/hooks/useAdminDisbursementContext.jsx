import { AdminDisbursementContext } from "../context/AdminDisbursementContext";
import { useContext } from "react";

export const useAdminDisbursementContext = () =>{
    const context = useContext(AdminDisbursementContext)

    if(!context){
        throw Error('AdminDisbursementContext is not found.')
    }
    return context
}
