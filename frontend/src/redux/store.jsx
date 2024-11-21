import {configureStore} from "@reduxjs/toolkit"
import permissionReducer from "./PermissionRedux"
import RecordsReducer from "./RecordsRedux"
import ControlBookReducer from "./ControlBookRedux"
import TestForecastedReducer from "./TestForecastedRedux"
import TotalExpenseReducer from "./TotalExpenseRedux"
import AllVouchersReducer from './AllVouchersRedux'
import ResetPasswordRequestsReducer from "./ResetPasswordRequests"

export const store = configureStore({
    reducer : {
        permission: permissionReducer,
        records: RecordsReducer,
        controlBook: ControlBookReducer,
        testforecast: TestForecastedReducer,
        totalexpense: TotalExpenseReducer,
        vouchers: AllVouchersReducer,
        request: ResetPasswordRequestsReducer
    }
})
