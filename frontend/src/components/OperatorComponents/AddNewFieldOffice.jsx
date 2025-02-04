import PropTypes from 'prop-types'
import { useEffect, useState, useRef } from 'react'
import Swal from 'sweetalert2'

import LargeLoader from '../Loaders/LargeLoader'

import { useFundingHook } from '../../hooks/useFundingHook'
import { useAuthContext } from '../../hooks/useAuthContext'

const AddNewFieldOffice = (props) => {
    const {modal, ASANo, fieldOffice = {}, flag, fieldOfficeID = '', remainingASA = 0, tabs = [{}], cbFO = 0, test} = props

    const [fieldOfficeData, setFieldOfficeData] = useState({projectName: '', fieldOffice: '', ASA: 0, tabStatus: '', tabAmount: 0})
    const [errorFlag, setErrorFlag] = useState(false)
    const [currASA, setCurrASA] = useState('')
    const prevData = useRef(null)
    const { user } = useAuthContext()
    const [usedAmountPerTab, setUsedAmountPerTab] = useState({})
    const [allowInput, setAllowInput] =useState(true)
    const [recordedASA, setRecordedASA] = useState(0)
    
    
    const { AddFieldOffice, updateFieldOffice, isLoading, error } = useFundingHook()

    useEffect(() => {
        if(flag && fieldOffice) {
            setFieldOfficeData({
                projectName: fieldOffice.projectName || '', 
                fieldOffice: fieldOffice.fieldOffice || '',
                ASA: fieldOffice.ASA || 0,
                tabStatus: fieldOffice.tabStatus || '',

            })
            setCurrASA(fieldOffice.RO)
            setRecordedASA(fieldOffice.RO)

        }
    }, [flag, fieldOffice]) 

    useEffect(() => {
        //getting all of the used amount per project then organized by their respective tab status
        console.log(test)
        const arrOne = Object.entries(test)
        let data = {}
        for(let i = 0; i < arrOne.length; i++){
            if(arrOne[i][1].tabStatus in data){
                data[arrOne[i][1].tabStatus] += parseFloat(arrOne[i][1].ASA)
            }else{
                data[arrOne[i][1].tabStatus] = parseFloat(arrOne[i][1].ASA)
            }
        }
        setUsedAmountPerTab(data)
        }, [test])

    useEffect(() => {
        if(flag && !prevData.current) {
            prevData.current = {
                RO: fieldOffice.ASA,
                projectID: `${ASANo},${fieldOffice.projectName}>${fieldOffice.tabStatus}`,
                projectName: fieldOffice.projectName,
                tabStatus: fieldOffice.tabStatus
            }
        } else {
            prevData.current = null
        }
    }, [fieldOffice])

    const handleLimitASA = (e) => {
        const value = e.target.value
        if(flag){
            const title = fieldOfficeData.tabStatus
            const usedAmount = parseFloat(usedAmountPerTab[title])
            const result = tabs.find(item => item.title === title)
            const totalAmount = parseFloat(result.amount)

            //formula:
            //avaialable =  usedamount - previous amount
            // limit = totalAmount - avaialable
            const available = usedAmount - parseFloat(recordedASA)
            const limit = totalAmount - available
            if(value > limit){
                setErrorFlag(true)
            }else{
                setErrorFlag(false)
            }
            setCurrASA(value)
            
        }else{
            const title = fieldOfficeData.tabStatus
            const totalAmount = fieldOfficeData.tabAmount
            const usedAmount = parseFloat(usedAmountPerTab[title] || 0)
            const unused = totalAmount - usedAmount
            
            if(value > unused){
                setErrorFlag(true)
            }else{
                setErrorFlag(false)
            }
            setFieldOfficeData({...fieldOfficeData, ASA: value})
        }
    }

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
            projectID: `${ASANo},${fieldOfficeData.projectName}>${fieldOfficeData.tabStatus}`
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
            Swal.fire({
                title: "Saved",
                text: "Field Office is successfully created!",
                icon: "success",
                confirmButtonColor: "#009933"
                });
            modal()
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        const updatedFieldOfficeData = {...fieldOfficeData, ASA: currASA}
        const data = {
            data: updatedFieldOfficeData,
            id: `${ASANo}!${fieldOfficeID}`,
            prevData: prevData.current,
            leftBudget: remainingASA
        }
        if(errorFlag) {
            Swal.fire({
                title: "Error",
                text: "The input exceeds the remaining available ASA",
                icon: "error",
                confirmButtonColor: "#009933"
                });
        } else {
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
    }

  return (
    <form onClick={(e) => e.stopPropagation()} onSubmit={flag ? handleUpdate : handleSubmit} className="w-3/4 md:w-2/4 lg:w-1/4 h-auto bg-white p-3 rounded-lg">
        <h1 className={`${user.role === '3' ? 'text-fundingBlueGreen' : 'text-preparerPrimary'} px-3 text-2xl font-semibold`}>{flag ? 'Edit Project' : 'Add Project'}</h1>
        <div className='w-full h-auto p-3'>
            <div className="w-full mt-2">
                <label>Project Name</label>
                <input
                    disabled={flag} 
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
                <label>Select Tab</label>
                <select 
                    disabled={flag}
                    required
                    value={fieldOfficeData.tabStatus}
                    onChange={(e) => {
                        const selectedOption = e.target.options[e.target.selectedIndex]
                        const amount = selectedOption.getAttribute('amount')
                        setFieldOfficeData({...fieldOfficeData, tabStatus: e.target.value, tabAmount: amount})
                        setAllowInput(false)
                    }}
                    className={`${user.role === '3' ? 'focus:outline-fundingBlueGreen' : 'focus:outline-preparerPrimary'} w-full px-4 py-2 rounded-lg border-2 transition-all duration-500`}
                    >
                    <option value="" disabled>Select</option>
                    {tabs.length > 0 ? (
                        tabs.map((tab, index) => (
                        <option key={index} value={tab.title} amount={tab.amount} disabled={(parseFloat(tab.amount) - parseFloat(usedAmountPerTab[tab.title] || 0)) === 0}>
                            {tab.title} {parseFloat(tab.amount) - parseFloat(usedAmountPerTab[tab.title] || 0)}  
                        </option>
                        ))
                    ) : (
                        <option value="" disabled>
                            No options available
                        </option>
                    )}
                </select>
            </div>
            <div className="w-full mt-2">
                <label>ASA</label>
                <input 
                    disabled={flag ? false : allowInput}
                    type="number" 
                    value={flag ? currASA : fieldOfficeData.ASA}
                    onFocus={handleFocus}
                    onChange={(e) => handleLimitASA(e)} 
                    className={`${errorFlag ? 'focus:outline-red-500' : ''} ${user.role === '3' ? 'focus:outline-fundingBlueGreen' : 'focus:outline-preparerPrimary'} w-full px-4 py-2 rounded-lg border-2 transition-all duration-500`}
                    required />
            </div>
            {errorFlag && ( 
                <p className='text-red-500 text-sm my-2'>The input exceeds the remaining available ASA</p>
            )}
        </div>
        <div className='w-full h-auto flex items-center justify-end gap-2 my-2'>
            <button 
                onClick={modal} 
                className='px-5 py-2 rounded-lg font-semibold border-2 hover:bg-gray-200 transition-all duration-150'>Back</button>
            <button 
                type='submit' 
                disabled={isLoading}  
                className={`${user.role === '3' ? 'bg-fundingBlueGreen border-fundingBlueGreen hover:bg-white hover:text-fundingBlueGreen' : 'bg-preparerPrimary border-preparerPrimary hover:bg-white hover:text-preparerPrimary'} border-2 px-5 py-2 rounded-lg text-white font-semibold transition-all duration-150`}>Save</button>
        </div>
        {error && (
            <div className="w-full text-center">
                <h4 className="text-sm text-red-500">{error}</h4>
            </div>
        )}
        {isLoading && (
            <LargeLoader/>
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