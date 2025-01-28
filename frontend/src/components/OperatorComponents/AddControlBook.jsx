import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

import LargeLoader from '../Loaders/LargeLoader'

import { useFundingHook } from '../../hooks/useFundingHook'
import { useAuthContext } from '../../hooks/useAuthContext'

const AddControlBook = (props) => {
    const { modal, controlBook = {}, flag, ASANo = '' } = props

    const { AddControlBook, updateControlBook, isLoading, error } = useFundingHook()
    const { user } = useAuthContext()
    
    const [controlBookData, setControlBookData] = useState({ASANo: '', date: '', SARONo: '', fundCluster: '', TotalASA: 0, description: '', RO: 0, FO: 0, endDate: ''})
    const [errorFlag, setErrorFlag] = useState(false)


    useEffect(() => {
        if(flag && controlBook) {
            setControlBookData({
                ASANo: controlBook.ASANo.split('|').slice()[0] || '',
                date: formatDateforUpdate(controlBook.DateOfAsa) || '',
                SARONo: controlBook.SARONo || '',
                TotalASA: controlBook.TotalASA || 0,
                fundCluster: controlBook.FundCluster || '',
                description: controlBook.description || '',
                endDate: formatDateforUpdate(controlBook.endDate) || ''
            })
        }
    }, [controlBook, flag])

    const handleFocus = () => {
        if (controlBookData.TotalASA === 0) {
            setControlBookData({...controlBookData, TotalASA: ''});
        }
    };

    useEffect(() => {
        const totalAsa = parseFloat(controlBookData.TotalASA)
        const prevtotalASA= parseFloat(controlBook.TotalASA)
        const leftBudget = parseFloat(controlBook.leftBudget)
        if(totalAsa >= (prevtotalASA - leftBudget) || (!prevtotalASA || !leftBudget)){
            setErrorFlag(false)
        }else{
            setErrorFlag(true)
        }
    }, [controlBookData.TotalASA])

    const formatDateforUpdate = (rawDate) => {
        if (typeof rawDate === 'string') {
          const date = new Date(rawDate);
      
          if (!isNaN(date)) {
            const formattedDate = date.toISOString().split('T')[0];
            return formattedDate;
          }
        }
        return 
      };

    const handleUpdate = async(e) => {
        e.preventDefault()
        const prevtotalASA= parseFloat(controlBook.TotalASA)
        const leftBudget = parseFloat(controlBook.leftBudget)
        const data = {
            data: controlBookData
        }
        
        if(errorFlag) {
            Swal.fire({
                title: "Error",
                text: `Cannot update total ASA with below ${prevtotalASA - leftBudget}`,
                icon: "error",
                confirmButtonColor: "#009933"
                });
        } else {
            const res = await updateControlBook(data, ASANo)
            if(res) {
                Swal.fire({
                    title: "Saved",
                    text: "Control Book is successfully updated!",
                    icon: "success",
                    confirmButtonColor: "#009933"
                    });
                modal()
            } else {
                Swal.fire({
                    title: "Error",
                    text: {error},
                    icon: "error",
                    confirmButtonColor: "#009933"
                    });
            }
        }
    }
    const handleSumit = async(e) => {
        e.preventDefault()

        const data = {
            data: controlBookData
        }
        
        if(errorFlag) {
            Swal.fire({
                title: "Error",
                text: "The input exceeds the remaining available ASA",
                icon: "error",
                confirmButtonColor: "#009933"
                });
        } else {
            const res = await AddControlBook(data)
            if(res) {
                Swal.fire({
                    title: "Saved",
                    text: "Control Book is successfully created!",
                    icon: "success",
                    confirmButtonColor: "#009933"
                    });
                modal()
            } else {
                Swal.fire({
                    title: "Error",
                    text: error,
                    icon: "error",
                    confirmButtonColor: "#009933"
                });
            }
        }
    }

  return (
    <form onSubmit={flag ? handleUpdate : handleSumit} className="w-full sm:w-2/5 h-auto p-3 bg-white rounded-lg text-gray-500">
        <h1 className={`${user.role === '3' ? 'text-fundingBlueGreen' : 'text-preparerPrimary'} px-3 text-2xl font-semibold`}>Add Control Book</h1>
        <div className="w-full h-auto p-3">
            <div className=''>
                <label className="font-semibold">ASA No.</label>
                    <input 
                        type="text"
                        value={controlBookData.ASANo}
                        onChange={(e) => setControlBookData({...controlBookData, ASANo: e.target.value.trimStart()})}
                        required
                        className={`${user.role === '3' ? 'focus:outline-fundingBlueGreen' : 'focus:outline-preparerPrimary'} w-full px-4 py-2 rounded-lg border-2 transition-all duration-500`}/>

            </div>
            <div className="flex w-full h-auto gap-2 mt-2">
                <div className="w-1/2 flex flex-col">
                    <label className="font-semibold">Date of ASA</label>
                        <input 
                            type="date"
                            value={controlBookData.date}
                            onChange={(e) => setControlBookData({...controlBookData, date: e.target.value})}
                            required
                            max={new Date().toISOString().split("T")[0]}
                            className={`${user.role === '3' ? 'focus:outline-fundingBlueGreen' : 'focus:outline-preparerPrimary'} w-full px-4 py-2 rounded-lg border-2 transition-all duration-500`}/>
                </div>
                <div className="w-1/2 flex flex-col">
                    <label className="font-semibold">End of ASA</label>
                    <input 
                        type="date"
                        value={controlBookData.endDate}
                        onChange={(e) => setControlBookData({...controlBookData, endDate: e.target.value})}
                        required
                        min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0]}
                        className={`${user.role === '3' ? 'focus:outline-fundingBlueGreen' : 'focus:outline-preparerPrimary'} w-full px-4 py-2 rounded-lg border-2 transition-all duration-500`}/>
                </div>
            </div>
            <div className='w-full h-auto flex items-center justify-center gap-2 '>
                <div className="w-1/3 flex flex-col mt-2">
                    <label className="font-semibold">SARO No.</label>
                    <input 
                        type="text"
                        value={controlBookData.SARONo}
                        onChange={(e) => setControlBookData({...controlBookData, SARONo: e.target.value.trimStart()})}
                        required
                        className={`${user.role === '3' ? 'focus:outline-fundingBlueGreen' : 'focus:outline-preparerPrimary'} w-full px-4 py-2 rounded-lg border-2 transition-all duration-500`}/>
                </div>
                <div className="w-1/3 flex flex-col mt-2">
                    <label className="font-semibold">Total ASA</label>
                    <input 
                        type="number"
                        value={controlBookData.TotalASA}
                        onFocus={handleFocus}
                        onChange={(e) => setControlBookData({...controlBookData, TotalASA: e.target.value})}
                        required
                        className={`${errorFlag ? 'focus:outline-red-500' : ''} ${user.role === '3' ? 'focus:outline-fundingBlueGreen' : 'focus:outline-preparerPrimary'} w-full px-4 py-2 rounded-lg border-2 transition-all duration-500`}/>
                </div>
                <div className="w-1/3 flex flex-col mt-2">
                    <label className="font-semibold">Fund Cluster</label>
                    <select 
                        value={controlBookData.fundCluster}
                        onChange={(e) => setControlBookData({...controlBookData, fundCluster: e.target.value})}
                        required
                        className={`${errorFlag ? 'focus:outline-red-500' : ''} ${user.role === '3' ? 'focus:outline-fundingBlueGreen' : 'focus:outline-preparerPrimary'} w-full px-4 py-2 rounded-lg border-2 transition-all duration-500`}>
                            <option disabled value="">Select</option>
                            <option value="501 COB">501 COB</option>
                            <option value="501 CARP">501 CARP</option>
                            <option value="501 LFP">501 LFP</option>
                            <option value="Contract Farming">Farming Support Services Program</option>
                    </select>
                </div>
            </div>
            {errorFlag && (
                <p className='text-red-500 text-sm mt-2 text-right'>The input exceeds the remaining available ASA</p>
            )}
            <div className="w-full flex flex-col mt-2">
                <label className="font-semibold">Description</label>
                <textarea 
                    value={controlBookData.description}
                    onChange={(e) => setControlBookData({...controlBookData, description: e.target.value.trimStart()})}
                    required
                    className={`${user.role === '3' ? 'focus:outline-fundingBlueGreen' : 'focus:outline-preparerPrimary'} w-full resize-none p-2 rounded-lg border-2 transition-all duration-500`}/>
            </div>
        </div>
        <div className="flex items-center justify-end w-full h-auto gap-2 my-2">
            <button 
                onClick={modal}
                className="px-5 py-2 rounded-lg font-semibold border-2 hover:bg-gray-200 transition-all duration-150">Back</button>
            <button 
                type="submit"
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

AddControlBook.propTypes = {
    modal: PropTypes.func.isRequired,
    flag: PropTypes.bool.isRequired,
    controlBook: PropTypes.object,
    ASANo: PropTypes.string
}

export default AddControlBook