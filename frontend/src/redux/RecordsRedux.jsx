import { createSlice } from "@reduxjs/toolkit";

export const RecordsRedux = createSlice({
    name: 'records',
    initialState: {},
    reducers : {
        setRecords : (state, action) => {
            return {...state, ...action.payload}
        }
    }
})

export const {setRecords} = RecordsRedux.actions
export default RecordsRedux.reducer