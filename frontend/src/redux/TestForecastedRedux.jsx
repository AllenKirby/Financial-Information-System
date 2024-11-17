import { createSlice } from "@reduxjs/toolkit";

const initialState = {sample: {}, sampleoutcome: {}}

export const TestForecastedRedux = createSlice({
    name: 'testforecast',
    initialState,
    reducers: {
        setTestForecast: (state, action) => {
            state.sampleoutcome = action.payload;
        },
        setSample: (state, action) => {
            state.sample = action.payload;
        },
        resetTestForecast: () => initialState
    }
})

export const {setTestForecast,setSample, resetTestForecast} = TestForecastedRedux.actions
export default TestForecastedRedux.reducer