import { createSlice } from '@reduxjs/toolkit'

export const AllVouchersRedux = createSlice({
    name: 'vouchers',
    initialState: null,
    reducers: {
        setVouchers: (state, action) => {
            return {...state, ...action.payload}
        }
    }
})

export const { setVouchers } = AllVouchersRedux.actions
export default AllVouchersRedux.reducer