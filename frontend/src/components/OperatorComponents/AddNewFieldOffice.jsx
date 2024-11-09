import PropTypes from 'prop-types'
import { useState } from 'react'
import Swal from 'sweetalert2'
import { useFundingHook } from '../../hooks/useFundingHook'

const AddNewFieldOffice = ({modal, ASANo}) => {
    const [fieldOfficeData, setFieldOfficeData] = useState({projectName: '', fieldOffice: '', ASA: 0})
    const { AddFieldOffice, isLoading, error } = useFundingHook()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = {
            data: fieldOfficeData,
            ASANo: ASANo
        }
        const res = await AddFieldOffice(data)
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
    <form onSubmit={handleSubmit} className="w-1/4 h-auto bg-white p-3 rounded-lg">
        <h1 className="text-center text-2xl font-bold text-fundingBlueGreen">Add New Field Office</h1>
        <div className='w-full h-auto p-2'>
            <div className="w-full mt-2">
                <label>Project Name</label>
                <input 
                    type="text"
                    onChange={(e) => setFieldOfficeData({...fieldOfficeData, projectName: e.target.value})} 
                    className="w-full px-4 py-2 rounded-lg border-2 focus:outline-fundingBlueGreen transition-all duration-500"
                    required />
            </div>
            <div className="w-full mt-2">
                <label>Field Office</label>
                <select 
                    required
                    onChange={(e) => setFieldOfficeData({...fieldOfficeData, fieldOffice: e.target.value})} 
                    className="w-full px-4 py-2 rounded-lg border-2 focus:outline-fundingBlueGreen transition-all duration-500"
                    >
                    <option value="" disabled>Select</option>
                    <option value="Batangas">Batangas</option>
                    <option value="Cavite">Cavite</option>
                    <option value="Rizal">Rizal</option>
                    <option value="Rizal">Laguna</option>
                </select>
            </div>
            <div className="w-full mt-2">
                <label>ASA</label>
                <input 
                    type="number" 
                    onChange={(e) => setFieldOfficeData({...fieldOfficeData, ASA: e.target.value})} 
                    className="w-full px-4 py-2 rounded-lg border-2 focus:outline-fundingBlueGreen transition-all duration-500"
                    required />
            </div>
        </div>
        <div className='w-full h-auto flex items-center justify-end gap-2 py-2'>
            <button type='submit' disabled={isLoading} className='px-5 py-2 rounded-lg bg-fundingBlueGreen text-white font-semibold'>Save</button>
            <button onClick={modal} className='px-5 py-2 rounded-lg font-semibold'>Back</button>
        </div>
        {error && (
            <div className="w-full text-center">
            <h4 className="text-sm text-red-500">{error}</h4>
            </div>
        )}
    </form>
  )
}

AddNewFieldOffice.propTypes = {
    modal: PropTypes.func.isRequired,
    ASANo: PropTypes.string.isRequired
}

export default AddNewFieldOffice