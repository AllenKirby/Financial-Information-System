import {configureStore} from "@reduxjs/toolkit"
import superAdminReducer from "./superAdminRedux"

export const store = configureStore({
    reducer : {
        permission: superAdminReducer
    }
})