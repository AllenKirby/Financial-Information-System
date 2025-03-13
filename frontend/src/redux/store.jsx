import {configureStore} from "@reduxjs/toolkit"
import permissionReducer from "./PermissionRedux"
import RecordsReducer from "./RecordsRedux"
import ControlBookReducer from "./ControlBookRedux"
import TestForecastedReducer from "./TestForecastedRedux"
import TotalExpenseReducer from "./TotalExpenseRedux"
import AllVouchersReducer from './AllVouchersRedux'
import ResetPasswordRequestsReducer from "./ResetPasswordRequests"
import ChangePassFlagReducer from "./ChangePasswordFlagRedux"
import DVUsersReducer from "./DVUsersRedux"
import BURRecordsReducer from "./BURRecordsRedux"

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Using local storage
import { combineReducers } from 'redux';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: []
  };

  const rootReducer = combineReducers({
      permission: permissionReducer,
      records: RecordsReducer,
      controlBook: ControlBookReducer,
      testforecast: TestForecastedReducer,
      totalexpense: TotalExpenseReducer,
      vouchers: AllVouchersReducer,
      request: ResetPasswordRequestsReducer,
      changePass: ChangePassFlagReducer,
      dvrecords: DVUsersReducer,
      burRecords: BURRecordsReducer
  });
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  

export const store = configureStore({
    reducer: persistedReducer,
})

export const persistor = persistStore(store);
