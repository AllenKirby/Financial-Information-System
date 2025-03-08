import { createSlice } from '@reduxjs/toolkit'

export const BURRecordsRedux = createSlice({
    name: 'burRecords',
    initialState: [],
    reducers: {
        setBURs: (state, action) => {
            return action.payload
        },
    }
})

export const { setBURs } = BURRecordsRedux.actions
export default BURRecordsRedux.reducer