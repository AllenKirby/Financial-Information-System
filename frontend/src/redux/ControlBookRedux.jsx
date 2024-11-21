import { createSlice } from '@reduxjs/toolkit'

export const ControlBookRedux = createSlice({
    name: 'controlBook',
    initialState: null,
    reducers: {
        setControlBook: (state, action) => {
            return {...state, ...action.payload}
        },
        deleteFolder: (state, action) => {
            const uid = action.payload;
            const newState = { ...state }; 
            delete newState[uid]; 
            return newState;
        }
    }
})

export const { setControlBook, deleteFolder } = ControlBookRedux.actions
export default ControlBookRedux.reducer