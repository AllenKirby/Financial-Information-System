import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { useFundingHook } from '../../hooks/useFundingHook'

const AddNewFieldOffice = ({modal, ASANo, fieldOffice = {}, flag}) => {
    const [fieldOfficeData, setFieldOfficeData] = useState({projectName: '', fieldOffice: '', ASA: 0})
    const { AddFieldOffice, updateFieldOffice, isLoading, error } = useFundingHook()

    useEffect(() => {
        if(flag && fieldOffice) {
            setFieldOfficeData({
                projectName: fieldOffice.projectName || '', 
                fieldOffice: fieldOffice.fieldOffice || '',
                ASA: fieldOffice.ASA || 0
            })
        }
    }, [flag, fieldOffice]) 

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

    const handleUpdate = async (e) => {
        e.preventDefault()
        const data = {
            data: fieldOfficeData,
            id: `${ASANo},${fieldOffice.fieldOffice}`
        }
        const res = await updateFieldOffice(data)
        if(res) {
            Swal.fire({
                title: "Saved",
                text: "Control Book is successfully updated!",
                icon: "success",
                confirmButtonColor: "#009933"
                });
            modal()
        }
    }

  return (
    <form onSubmit={flag ? handleUpdate : handleSubmit} className="w-1/4 h-auto bg-white p-3 rounded-lg">
        <h1 className="text-center text-2xl font-bold text-fundingBlueGreen">Add New Field Office</h1>
        <div className='w-full h-auto p-2'>
            <div className="w-full mt-2">
                <label>Project Name</label>
                <input 
                    type="text"
                    value={fieldOfficeData.projectName}
                    onChange={(e) => setFieldOfficeData({...fieldOfficeData, projectName: e.target.value})} 
                    className="w-full px-4 py-2 rounded-lg border-2 focus:outline-fundingBlueGreen transition-all duration-500"
                    required />
            </div>
            <div className="w-full mt-2">
                <label>Field Office</label>
                <select 
                    required
                    value={fieldOfficeData.fieldOffice}
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
                    value={fieldOfficeData.ASA}
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
    ASANo: PropTypes.string.isRequired,
    fieldOffice: PropTypes.object.isRequired,
    flag: PropTypes.bool.isRequired,
}

export default AddNewFieldOffice