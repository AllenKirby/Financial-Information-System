import { createSlice } from "@reduxjs/toolkit";

export const ResetPasswordRequestsRedux = createSlice({
    name: 'requests',
    initialState: {},
    reducers : {
        setRequests : (state, action) => {
            return {...state, ...action.payload}
        },
        deleteRequest : (state, action) => {
            const uid = action.payload;
            console.log(uid)
            const newState = { ...state }; 
            delete newState[uid]; 
            return newState;
        }
    }
})

export const {setRequests, deleteRequest} = ResetPasswordRequestsRedux.actions
export default ResetPasswordRequestsRedux.reducer