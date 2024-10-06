import { OpDisbursementContext } from '../context/OpDisbursementContext'
import { useContext } from "react";

export const useOpDisbursementContext = () =>{
    const context = useContext(OpDisbursementContext)

    if(!context){
        throw Error('OpDisbursementContext is not found.')
    }
    return context
}