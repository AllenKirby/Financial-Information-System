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
            const new_key = Object.keys(action.payload)[0]
            const new_value = Object.values(action.payload)[0]
            return {
                ...state, 
                documents: {
                    ...state.documents,
                    [new_key]: new_value
                }
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
                documents: state.documents.filter(document => document.data.DV !== action.payload)
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
    console.log('Disbursement Context', state.documents)

    return(
        <DisbursementContext.Provider value={{...state, dispatch}}>
            {children}
        </DisbursementContext.Provider>
    )
}

DisbursementContextProvider.propTypes = {
    children: PropTypes.node.isRequired
}