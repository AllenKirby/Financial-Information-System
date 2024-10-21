import { createSlice } from '@reduxjs/toolkit'

export const PermissionRedux = createSlice({
    name: 'permission',
    initialState: null,
    reducers: {
        setPermission: (state, action) => {
            return {...state, ...action.payload}
        }
    }
})

export const { setPermission } = PermissionRedux.actions
export default PermissionRedux.reducer