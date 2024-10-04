import { createContext, useReducer } from "react";
import PropTypes from 'prop-types'

export const OpDisbursementContext = createContext()
export const OpDisbursementReducer = (state, action) => {
    switch (action.type) {  
        case 'SET_OPDOCUMENTS':
            return {
                OpDocuments: action.payload
            }
        case 'CREATE_OPDOCUMENT':
            return {
                OpDocuments: [action.payload, ...state.OpDocuments]
            }
        case 'UPDATE_OPDOCUMENT':
            return {
                ...state,
                OpDocuments: state.OpDocuments.map(document => 
                    document._id === action.payload._id ? action.payload :document
                )
            }
        case 'DELETE_OPDOCUMENT':
            return {
                ...state,
                OpDocuments: state.OpDocuments.filter(document => document.data.DV !== action.payload)
            };
        default:
            return state
    }
}
export const OpDisbursementContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(OpDisbursementReducer, {
        OpDocuments: null
    })

    console.log('Disbursement Context', state.OpDocuments)

    return(
        <OpDisbursementContext.Provider value={{...state, dispatch}}>
            {children}
        </OpDisbursementContext.Provider>
    )
}

OpDisbursementContextProvider.propTypes = {
    children: PropTypes.node.isRequired
}