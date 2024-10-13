import { createContext, useReducer } from "react";
import PropTypes from 'prop-types'

export const HeadDisbursementContext = createContext()
export const HeadDisbursementReducer = (state, action) => {
    switch (action.type) {  
        case 'SET_HEADDOCUMENTS':
            return {
                ...state, HeadDocuments: action.payload
            }
        case 'DELETE_HEADDOCUMENT':
            {const { [action.payload]: deletedDocument, ...remainingDocuments } = state.HeadDocuments;
            return {
                ...state,
                documents: remainingDocuments, 
            }}
        default:
            return state
    }
}
export const HeadDisbursementContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(HeadDisbursementReducer, {
        HeadDocuments: null
    })
    // console.log('Head Disbursement Context', state.HeadDocuments)

    return(
        <HeadDisbursementContext.Provider value={{...state, dispatch}}>
            {children}
        </HeadDisbursementContext.Provider>
    )
}

HeadDisbursementContextProvider.propTypes = {
    children: PropTypes.node.isRequired
}