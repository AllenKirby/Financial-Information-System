import { createSlice } from "@reduxjs/toolkit";

export const superAdminRedux = createSlice({
    name: 'permission',
    initialState: null,
    reducers: {
        setPermissionAndRole: (state, action) => {
            return {...state, ...action.payload}
        }
    }
})

export const {setPermissionAndRole} =superAdminRedux.actions

export default superAdminRedux.reducer