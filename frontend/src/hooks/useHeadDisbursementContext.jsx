import { HeadDisbursementContext } from "../context/HeadDisbursementContext";
import { useContext } from "react";

export const useHeadDisbursementContext = () =>{
    const context = useContext(HeadDisbursementContext)

    if(!context){
        throw Error('HeadDisbursementContext is not found.')
    }
    return context
}