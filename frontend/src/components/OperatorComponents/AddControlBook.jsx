import PropTypes from 'prop-types'
import { useState } from 'react'
import Swal from 'sweetalert2'

import Loader from '../Loader'
import { useFundingHook } from '../../hooks/useFundingHook'

const AddControlBook = ({modal}) => {
    const { AddControlBook, isLoading, error } = useFundingHook()
    const [controlBookData, setControlBookData] = useState({ASANo: '', date: '', SARONo: '', TotalASA: 0, description: ''})

    const handleSumit = async(e) => {
        e.preventDefault()

        const data = {
            data: controlBookData
        }
        
        const res = await AddControlBook(data)
        if(res) {
            Swal.fire({
                title: "Saved",
                text: "Control Book is successfully created!",
                icon: "success",
                confirmButtonColor: "#009933"
                });
            modal()
        }
    }

  return (
    <form onSubmit={handleSumit} className="w-2/5 h-auto p-3 bg-white rounded-lg">
        <h1 className="text-center text-2xl font-bold text-fundingBlueGreen">Add Control Book</h1>
        <div className="w-full h-auto p-3">
            <div className="flex w-full h-auto gap-2">
                <div className="w-1/2 flex flex-col">
                    <label className="font-semibold">ASA No.</label>
                    <input 
                        type="text"
                        onChange={(e) => setControlBookData({...controlBookData, ASANo: e.target.value})}
                        required
                        className="w-full px-4 py-2 rounded-lg border-2 focus:outline-customgreen transition-all duration-500"  />
                </div>
                <div className="w-1/2 flex flex-col">
                    <label className="font-semibold">Date of ASA</label>
                    <input 
                        type="date"
                        onChange={(e) => setControlBookData({...controlBookData, date: e.target.value})}
                        required
                        className="w-full px-4 py-2 rounded-lg border-2 focus:outline-customgreen transition-all duration-500" />
                </div>
            </div>
            <div className="flex w-full h-auto gap-2">
                <div className="w-full flex flex-col">
                    <label className="font-semibold">SARO No.</label>
                    <input 
                        type="text"
                        onChange={(e) => setControlBookData({...controlBookData, SARONo: e.target.value})}
                        required
                        className="w-full px-4 py-2 rounded-lg border-2 focus:outline-customgreen transition-all duration-500"  />
                </div>
            </div>
            <div className="flex w-full h-auto gap-2">
                <div className="w-full flex flex-col">
                    <label className="font-semibold">Total ASA</label>
                    <input 
                        type="number"
                        onChange={(e) => setControlBookData({...controlBookData, TotalASA: e.target.value})}
                        required
                        className="w-full px-4 py-2 rounded-lg border-2 focus:outline-customgreen transition-all duration-500"  />
                </div>
            </div>
            <div className="flex w-full h-auto gap-2">
                <div className="w-full flex flex-col">
                    <label className="font-semibold">Description</label>
                    <textarea 
                        onChange={(e) => setControlBookData({...controlBookData, description: e.target.value})}
                        required
                        className="w-full resize-none p-2 rounded-lg border-2 focus:outline-customgreen transition-all duration-500"  />
                </div>
            </div>
        </div>
        <div className="flex items-center justify-end w-full h-auto gap-2">
            <button 
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 rounded-lg bg-fundingBlueGreen text-white text-xl font-semibold">{isLoading ? <Loader/> : 'Save'}</button>
            <button 
                onClick={modal}
                className="px-5 py-2 rounded-lg text-xl font-semibold">Back</button>
        </div>
        {error && (
            <div className="w-full text-center">
            <h4 className="text-sm text-red-500">{error}</h4>
            </div>
        )}
    </form>
  )
}

AddControlBook.propTypes = {
    modal: PropTypes.func.isRequired
}

export default AddControlBook