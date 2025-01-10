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
        },
        deleteProject: (state, action) => {
            const ASANo = action.payload.split('!')[0]
            const projectID = action.payload.split('!')[1]
            const newState = { ...state };
            delete newState[ASANo].fieldOffices[projectID]
            return newState;
        }
    }
})

export const { setControlBook, deleteFolder, deleteProject } = ControlBookRedux.actions
export default ControlBookRedux.reducer