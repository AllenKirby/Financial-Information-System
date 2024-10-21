import {configureStore} from "@reduxjs/toolkit"
import permissionReducer from "./PermissionRedux"

export const store = configureStore({
    reducer : {
        permission: permissionReducer
    }
})