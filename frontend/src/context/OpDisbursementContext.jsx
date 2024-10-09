import { createContext, useReducer } from "react";
import PropTypes from 'prop-types'

export const OpDisbursementContext = createContext()
export const OpDisbursementReducer = (state, action) => {
    switch (action.type) {  
        case 'SET_OPDOCUMENTS':
            return {
                ...state,
                OpDocuments: action.payload ? action.payload : { documents: {} }
            }
        case 'CREATE_OPDOCUMENT':
            {const new_key = Object.keys(action.payload)[0]
            const new_value = Object.values(action.payload)[0]

            return {
                ...state, 
                OpDocuments: {
                    ...state.OpDocuments,
                    [new_key]: new_value
                }
            }}
        case 'UPDATE_OPDOCUMENT': {
            const updatedKey = Object.keys(action.payload)[0];
            const updatedValue = Object.values(action.payload)[0];
            return {
                ...state,
                documents: {
                    ...state.documents,
                    [updatedKey]: {
                        ...updatedValue
                    }
                }
            };
        }
        case 'DELETE_OPDOCUMENT':
            {const { [action.payload]: deletedDocument, ...remainingDocuments } = state.documents;
            return {
                ...state,
                documents: remainingDocuments, 
            }}
        default:
            return state
    }
}
export const OpDisbursementContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(OpDisbursementReducer, {
        OpDocuments: { documents: {} } 
    })

    console.log('op-Disbursement Context', state.OpDocuments)

    return(
        <OpDisbursementContext.Provider value={{...state, dispatch}}>
            {children}
        </OpDisbursementContext.Provider>
    )
}

OpDisbursementContextProvider.propTypes = {
    children: PropTypes.node.isRequired
}