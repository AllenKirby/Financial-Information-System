import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

import Loader from '../Loader'
import { useFundingHook } from '../../hooks/useFundingHook'

const AddControlBook = ({modal, controlBook = {}, flag}) => {
    const { AddControlBook, updateControlBook, isLoading, error } = useFundingHook()
    const [controlBookData, setControlBookData] = useState({ASANo: '', date: '', SARONo: '', TotalASA: 0, description: ''})

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

        const res = await updateControlBook(data, controlBook.ASANo)
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
        <h1 className="px-3 text-3xl font-bold text-fundingBlueGreen">Add Control Book</h1>
        <div className="w-full h-auto p-3">
            <div className="flex w-full h-auto gap-2">
                <div className="w-1/2 flex flex-col">
                    <label className="font-semibold">ASA No.</label>
                    <input 
                        type="text"
                        value={controlBookData.ASANo}
                        onChange={(e) => setControlBookData({...controlBookData, ASANo: e.target.value})}
                        required
                        className="w-full px-4 py-2 rounded-lg border-2 focus:outline-customgreen transition-all duration-500"  />
                </div>
                <div className="w-1/2 flex flex-col">
                    <label className="font-semibold">Date of ASA</label>
                    <input 
                        type="date"
                        value={controlBookData.date}
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
                        value={controlBookData.SARONo}
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
                        value={controlBookData.TotalASA}
                        onChange={(e) => setControlBookData({...controlBookData, TotalASA: e.target.value})}
                        required
                        className="w-full px-4 py-2 rounded-lg border-2 focus:outline-customgreen transition-all duration-500"  />
                </div>
            </div>
            <div className="flex w-full h-auto gap-2">
                <div className="w-full flex flex-col">
                    <label className="font-semibold">Description</label>
                    <textarea 
                        value={controlBookData.description}
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
    modal: PropTypes.func.isRequired,
    flag: PropTypes.bool.isRequired,
    controlBook: PropTypes.object
}

export default AddControlBook