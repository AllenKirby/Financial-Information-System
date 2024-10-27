import {configureStore} from "@reduxjs/toolkit"
import permissionReducer from "./PermissionRedux"
import RecordsReducer from "./RecordsRedux"

export const store = configureStore({
    reducer : {
        permission: permissionReducer,
        records: RecordsReducer
    }
})