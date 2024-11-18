import PropTypes from 'prop-types'
import { useEffect, useState, useRef } from 'react'
import Swal from 'sweetalert2'

import Loader from '../Loader'

import { useFundingHook } from '../../hooks/useFundingHook'
import { useAuthContext } from '../../hooks/useAuthContext'

const AddNewFieldOffice = (props) => {
    const {modal, ASANo, fieldOffice = {}, flag, fieldOfficeID = '', remainingASA = 0} = props

    const [fieldOfficeData, setFieldOfficeData] = useState({projectName: '', fieldOffice: '', ASA: 0})
    const [errorFlag, setErrorFlag] = useState(false)
    const prevData = useRef(null)
    const { user } = useAuthContext()
    
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

    useEffect(() => {
        if(flag && !prevData.current) {
            prevData.current = {
                RO: fieldOffice.ASA,
                projectID: `${ASANo},${fieldOffice.projectName}`,
                projectName: fieldOffice.projectName
            }
            console.log('ref', prevData.current)
        } else {
            prevData.current = null
        }
    }, [fieldOffice])

    useEffect(() => {
        if(remainingASA) {
            const ASA = parseFloat(fieldOfficeData.ASA)
            if(ASA > remainingASA) {
                setErrorFlag(true)
            } else {
                setErrorFlag(false)
            }
        }
    }, [fieldOfficeData.ASA, remainingASA])

    const handleFocus = () => {
        if (fieldOfficeData.ASA === 0) {
            setFieldOfficeData({...fieldOfficeData, ASA: ''});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = {
            data: fieldOfficeData,
            ASANo: ASANo,
            projectID: `${ASANo},${fieldOfficeData.projectName}`
        }
        if(errorFlag) {
            Swal.fire({
                title: "Error",
                text: "The input exceeds the remaining available ASA",
                icon: "error",
                confirmButtonColor: "#009933"
                });
        } else {
            const res = await AddFieldOffice(data)
            if(res) {
                Swal.fire({
                    title: "Saved",
                    text: "Field Office is successfully created!",
                    icon: "success",
                    confirmButtonColor: "#009933"
                    });
                modal()
            }
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        const data = {
            data: fieldOfficeData,
            id: `${ASANo}!${fieldOfficeID}`,
            prevData: prevData.current
        }
        const res = await updateFieldOffice(data)
        if(res) {
            Swal.fire({
                title: "Saved",
                text: "Field Office is successfully updated!",
                icon: "success",
                confirmButtonColor: "#009933"
                });
            modal()
        }
    }

  return (
    <form onSubmit={flag ? handleUpdate : handleSubmit} className="w-1/4 h-auto bg-white p-3 rounded-lg">
        <h1 className={`${user.role === '3' ? 'text-fundingBlueGreen' : 'text-preparerPrimary'} px-3 text-2xl font-semibold`}>{flag ? 'Edit Field Office' : 'Add Field Office'}</h1>
        <div className='w-full h-auto p-3'>
            <div className="w-full mt-2">
                <label>Project Name</label>
                <input 
                    type="text"
                    value={fieldOfficeData.projectName}
                    onChange={(e) => setFieldOfficeData({...fieldOfficeData, projectName: e.target.value.trimStart()})} 
                    className={`${user.role === '3' ? 'focus:outline-fundingBlueGreen' : 'focus:outline-preparerPrimary'} w-full px-4 py-2 rounded-lg border-2 transition-all duration-500`}
                    required />
            </div>
            <div className="w-full mt-2">
                <label>Field Office</label>
                <select 
                    required
                    value={fieldOfficeData.fieldOffice}
                    onChange={(e) => setFieldOfficeData({...fieldOfficeData, fieldOffice: e.target.value})} 
                    className={`${user.role === '3' ? 'focus:outline-fundingBlueGreen' : 'focus:outline-preparerPrimary'} w-full px-4 py-2 rounded-lg border-2 transition-all duration-500`}
                    >
                    <option value="" disabled>Select</option>
                    <option value="Cavite-Batangas">Cavite-Batangas IMO</option>
                    <option value="Laguna-Rizal">Laguna-Rizal</option>
                    <option value="Quezon">Quezon IMO</option>
                </select>
            </div>
            <div className="w-full mt-2">
                <label>ASA</label>
                <input 
                    type="number" 
                    value={fieldOfficeData.ASA}
                    onFocus={handleFocus}
                    onChange={(e) => setFieldOfficeData({...fieldOfficeData, ASA: e.target.value})} 
                    className={`${errorFlag ? 'focus:outline-red-500' : ''} ${user.role === '3' ? 'focus:outline-fundingBlueGreen' : 'focus:outline-preparerPrimary'} w-full px-4 py-2 rounded-lg border-2 transition-all duration-500`}
                    required />
            </div>
            {errorFlag && ( 
                <p className='text-red-500 text-sm my-2'>The input exceeds the remaining available ASA</p>
            )}
        </div>
        <div className='w-full h-auto flex items-center justify-end gap-2 my-2'>
            <button 
                type='submit' 
                disabled={isLoading} 
                className={`${user.role === '3' ? 'bg-fundingBlueGreen' : 'bg-preparerPrimary'} px-5 py-2 rounded-lg text-white font-semibold`}>{isLoading ? <Loader /> : 'Save'}</button>
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
    fieldOffice: PropTypes.object,
    flag: PropTypes.bool.isRequired,
    fieldOfficeID: PropTypes.string,
    remainingASA: PropTypes.number,
}

export default AddNewFieldOffice