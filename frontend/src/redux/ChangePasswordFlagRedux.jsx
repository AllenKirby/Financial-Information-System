import { createSlice } from '@reduxjs/toolkit'

export const ChangePassFlagRedux = createSlice({
    name: 'changePass',
    initialState: false,
    reducers: {
        toggleChangePassFlag: () => {
            return true; 
        },
        resetChangePassFlag: () => {
            return false; 
        }
    }
})

export const { toggleChangePassFlag, resetChangePassFlag } = ChangePassFlagRedux.actions
export default ChangePassFlagRedux.reducer