import { createContext, useReducer } from "react";
import PropTypes from 'prop-types'

export const AdminDisbursementContext = createContext()
export const AdminDisbursementReducer = (state, action) => {
    switch (action.type) {  
        case 'SET_ADMINDOCUMENTS':
            return {
                ...state, AdminDocuments: action.payload
            }
        default:
            return state
    }
}
export const AdminDisbursementContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(AdminDisbursementReducer, {
        AdminDocuments: null
    })

    return(
        <AdminDisbursementContext.Provider value={{...state, dispatch}}>
            {children}
        </AdminDisbursementContext.Provider>
    )
}

AdminDisbursementContextProvider.propTypes = {
    children: PropTypes.node.isRequired
}