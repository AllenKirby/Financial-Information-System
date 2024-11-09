import { createSlice } from '@reduxjs/toolkit'

export const ControlBookRedux = createSlice({
    name: 'controlBook',
    initialState: null,
    reducers: {
        setControlBook: (state, action) => {
            return {...state, ...action.payload}
        }
    }
})

export const { setControlBook } = ControlBookRedux.actions
export default ControlBookRedux.reducer