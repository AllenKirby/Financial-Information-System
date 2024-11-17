import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    monthly: {}
}

export const TotalExpenseRedux = createSlice({
    name: 'totalexpense',
    initialState,
    reducers: {
        setExpense : (state, action) => {
            state.monthly = action.payload
        },
        resetExpense: () => initialState
    }

})

export const {setExpense, resetExpense} = TotalExpenseRedux.actions
export default TotalExpenseRedux.reducer