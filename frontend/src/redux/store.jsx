import {configureStore} from "@reduxjs/toolkit"
import permissionReducer from "./PermissionRedux"
import RecordsReducer from "./RecordsRedux"
import ControlBookReducer from "./ControlBookRedux"

export const store = configureStore({
    reducer : {
        permission: permissionReducer,
        records: RecordsReducer,
        controlBook: ControlBookReducer
    }
})