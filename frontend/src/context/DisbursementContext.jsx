import { createContext, useReducer } from "react";
import PropTypes from 'prop-types'

export const DisbursementContext = createContext()
export const DisbursementReducer = (state, action) => {
    switch (action.type) {  
        case 'SET_DOCUMENTS':
            return {
                documents: action.payload
            }
        case 'CREATE_DOCUMENT':
            return {
                documents: [action.payload, ...state.documents]
            }
        case 'UPDATE_DOCUMENT':
            return {
                ...state,
                documents: state.documents.map(document => 
                    document._id === action.payload._id ? action.payload :document
                )
            }
        case 'DELETE_DOCUMENT':
            return {
                ...state,
                documents: state.documents.documents.filter(document => document.data.DV !== action.payload)
            };
        default:
            return state
    }
}
export const DisbursementContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(DisbursementReducer, {
        documents: null
    })

    console.log('Disbursement Context', state)

    return(
        <DisbursementContext.Provider value={{...state, dispatch}}>
            {children}
        </DisbursementContext.Provider>
    )
}

DisbursementContextProvider.propTypes = {
    children: PropTypes.node.isRequired
}