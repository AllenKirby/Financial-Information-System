import { IoAdd } from "react-icons/io5";
import { MdRemove } from "react-icons/md";
import { useState } from "react";

 export const TaxType = () => {
    
    const [showInput, setShowInput] = useState(false)

    const [tax, setTax] = useState('')
    const [cost, setCost] = useState('')

    const handleShowInput = () => {
        setShowInput(!showInput)
    }

    const handleInputChangeTax = (e) => {
        setTax(e.target.value)
    }

    const handleInputChangeCost = (e) => {
        setCost(e.target.value)
    }

    return (
        <div className="w-full h-full rounded-lg bg-white border-[1px]">
            <div className='w-full h-auto flex px-2 py-2 rounded-t-lg bg-customgreen text-white'>
                <h1 className='w-1/3 text-left font-bold px-2'>Tax Type</h1>
                <h1 className='w-1/3 text-center font-bold'>Cost Category</h1>
                <h1 className='w-1/3 text-center font-bold'>Computation</h1>
                <button 
                className='bg-customgreen text-white text-2xl rounded-full hover:bg-white hover:text-customgreen'
                onClick={handleShowInput}
                ><IoAdd/></button>
            </div>
            {showInput && (
                    <div className="px-2 py-2 bg-gray-200 flex gap-1">
                        <select
                            value={tax}
                            onChange={handleInputChangeTax}
                            className="border border-gray-300 p-2 rounded w-1/5"
                        >
                            <option value="" disabled>Select Tax Type</option>
                            <option value="VAT">VAT</option>
                            <option value="NON-VAT">NON-VAT</option>
                        </select>
                        <input
                            type="text"
                            value={cost}
                            onChange={handleInputChangeCost}
                            placeholder="Title for Cost Category"
                            className="border border-gray-300 p-2 rounded w-1/5"
                        />
                        <input
                            type="text"
                            // value={cost}
                            // onChange={handleInputChangeCost}
                            placeholder="e.g. /1.12 * 0.05"
                            className="border border-gray-300 p-2 rounded w-1/5"
                        />
                        <input
                            type="number"
                            // value={cost}
                            // onChange={handleInputChangeCost}
                            placeholder="e.g. /1.12 * 0.05"
                            className="border border-gray-300 p-2 rounded w-1/5"
                        />
                        <button
                            // onClick={handleSubmit}
                            className="w-1/5 bg-blue-500 text-white rounded"
                        >
                            Submit
                        </button>
                    </div>
                )}
            
        </div>
    )
 }