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
            const [ASANo, projectID] = action.payload.split('!');
            return {
                ...state,
                [ASANo]: {
                    ...state[ASANo],
                    fieldOffices: Object.fromEntries(
                        Object.entries(state[ASANo]?.fieldOffices || {}).filter(
                            ([key]) => key !== projectID
                        )
                    ),
                },
            };
        }
    }
})

export const { setControlBook, deleteFolder, deleteProject } = ControlBookRedux.actions
export default ControlBookRedux.reducer