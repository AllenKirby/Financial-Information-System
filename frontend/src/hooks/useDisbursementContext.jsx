import { DisbursementContext } from "../context/DisbursementContext";
import { useContext } from "react";

export const useDisbursementContext = () =>{
    const context = useContext(DisbursementContext)

    if(!context){
        throw Error('DisbursementContext is not found.')
    }
    return context
}