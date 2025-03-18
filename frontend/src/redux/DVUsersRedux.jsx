import { createSlice } from '@reduxjs/toolkit'

export const DVUsersRedux = createSlice({
    name: 'dvrecords',
    initialState: null,
    reducers: {
        setDVRecords: (_, action) => action.payload,
        deleteDVrecords: (state, action) => {
            const uid = action.payload;
            const newState = { ...state }; 
            delete newState[uid]; 
            return newState;
        },
    }
})

export const { setDVRecords, deleteDVrecords } = DVUsersRedux.actions
export default DVUsersRedux.reducer