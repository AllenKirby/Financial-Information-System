import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

import Loader from '../Loader'
import { useFundingHook } from '../../hooks/useFundingHook'
import { useAuthContext } from '../../hooks/useAuthContext'

const AddControlBook = (props) => {
    const { modal, controlBook = {}, flag, ASANo = '' } = props

    const { AddControlBook, updateControlBook, isLoading, error } = useFundingHook()
    const { user } = useAuthContext()
    
    const [controlBookData, setControlBookData] = useState({ASANo: '', date: '', SARONo: '', TotalASA: 0, description: '', RO: 0, FO: 0, endDate: ''})

    useEffect(() => {
        if(flag && controlBook) {
            setControlBookData({
                ASANo: controlBook.ASANo.split('|').slice()[0] || '',
                date: formatDateforUpdate(controlBook.DateOfAsa) || '',
                SARONo: controlBook.SARONo || '',
                TotalASA: controlBook.TotalASA || 0,
                description: controlBook.description || ''
            })
        }
    }, [controlBook, flag])

    const handleFocus = () => {
        if (controlBookData.TotalASA === 0) {
            setControlBookData({...controlBookData, TotalASA: ''});
        }
    };

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

        const data = {
            data: controlBookData
        }
        
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
                text: "Control Book is successfully updated!",
                icon: {error},
                confirmButtonColor: "#009933"
                });
        }
    }
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
    <form onSubmit={flag ? handleUpdate : handleSumit} className="w-2/5 h-auto p-3 bg-white rounded-lg">
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
                            className={`${user.role === '3' ? 'focus:outline-fundingBlueGreen' : 'focus:outline-preparerPrimary'} w-full px-4 py-2 rounded-lg border-2 transition-all duration-500`}/>
                </div>
                <div className="w-1/2 flex flex-col">
                    <label className="font-semibold">End of ASA</label>
                    <input 
                        type="date"
                        value={controlBookData.endDate}
                        onChange={(e) => setControlBookData({...controlBookData, endDate: e.target.value})}
                        required
                        min={new Date().toISOString().split("T")[0]}
                        className={`${user.role === '3' ? 'focus:outline-fundingBlueGreen' : 'focus:outline-preparerPrimary'} w-full px-4 py-2 rounded-lg border-2 transition-all duration-500`}/>
                </div>
            </div>
            <div className="w-full flex flex-col mt-2">
                <label className="font-semibold">SARO No.</label>
                <input 
                    type="text"
                    value={controlBookData.SARONo}
                    onChange={(e) => setControlBookData({...controlBookData, SARONo: e.target.value.trimStart()})}
                    required
                    className={`${user.role === '3' ? 'focus:outline-fundingBlueGreen' : 'focus:outline-preparerPrimary'} w-full px-4 py-2 rounded-lg border-2 transition-all duration-500`}/>
            </div>
            <div className="w-full flex flex-col mt-2">
                <label className="font-semibold">Total ASA</label>
                <input 
                    type="number"
                    value={controlBookData.TotalASA}
                    onFocus={handleFocus}
                    onChange={(e) => setControlBookData({...controlBookData, TotalASA: e.target.value})}
                    required
                    className={`${user.role === '3' ? 'focus:outline-fundingBlueGreen' : 'focus:outline-preparerPrimary'} w-full px-4 py-2 rounded-lg border-2 transition-all duration-500`}/>
            </div>
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
                type="submit"
                disabled={isLoading}
                className={`${user.role === '3' ? 'bg-fundingBlueGreen' : 'bg-preparerPrimary'} px-5 py-2 rounded-lg text-white font-semibold`}>{isLoading ? <Loader/> : 'Save'}</button>
            <button 
                onClick={modal}
                className="px-5 py-2 rounded-lg font-semibold">Back</button>
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
    modal: PropTypes.func.isRequired,
    flag: PropTypes.bool.isRequired,
    controlBook: PropTypes.object,
    ASANo: PropTypes.string
}

export default AddControlBook