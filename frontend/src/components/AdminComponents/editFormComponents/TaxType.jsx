import { IoAdd } from "react-icons/io5";
import { MdRemove } from "react-icons/md";
import { useEffect, useState } from "react";

import { useApproverHook } from "../../../hooks/useApproverHook";
import { useAuthContext } from '../../../hooks/useAuthContext'

export const TaxType = () => {
    const { user } = useAuthContext()
    const [showInput, setShowInput] = useState(false)
    const {addTax, getTaxType, deleteTax} = useApproverHook()

    const [tax, setTax] = useState('')
    const [cost, setCost] = useState('')

    const [value1, setValue1] = useState("");
    const [value2, setValue2] = useState("");

    const [entries, setEntries] = useState({});

    const handleShowInput = () => {
        setShowInput(!showInput)
    }

    const capitalize = (str) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const handleKeyDown = (e) => {
        const allowedKeys = ["+", "-", "*", "/",".", "Backspace", "Delete", "ArrowLeft", "ArrowRight"];
        const isNumber = /^[0-9]$/; // Only allow digits (0-9)
    
        if (!allowedKeys.includes(e.key) && !isNumber.test(e.key)) {
          e.preventDefault(); // Prevents the default action for unwanted keys
        }
    };

    const handleSubmit = () => {
        if(tax && cost && value1 && value2){
            const key = tax+cost;
            if(!(key in entries)){
                addTax(tax, cost, value1, value2, key)
                setShowInput(false)
                setEntries((prev) => {
                    const newObj = {...prev}
                    newObj[key] = {tax, cost, value1, value2}
                    return newObj
                })
                setTax('')
                setCost('')
                setValue1('')
                setValue2('')
                sessionStorage.removeItem('TaxTypeData')
            }else{
                alert("Please choose another title for cost category.");
            }
        }else{
            alert(`${cost} is already existing on ${tax}`);
        }
    }

    useEffect(() => {
        const gettingData = async () => {
            const TaxTypeData = sessionStorage.getItem('TaxTypeData')
            

            if(!TaxTypeData){
                const taxtype = await getTaxType()
                addObjectToEntries(taxtype)
            }else{
                const parsedTaxType = JSON.parse(TaxTypeData);
                addObjectToEntries(parsedTaxType)
            }
        }
        gettingData()
    }, [])

    const addObjectToEntries = (dataObject) => {
        const updatedEntries = Object.entries(dataObject).reduce((acc, [key, value]) => {
            acc[key] = { tax: value[0], cost: value[1], value1: value[2], value2: value[3] };
            return acc
        }, {})

        setEntries(prevEntries => ({
            ...prevEntries,
            ...updatedEntries
        }));
      };

      const handleRemoveEntry = (keyToRemove) => {
        const deleting = async () => {
            const res_bool = await deleteTax(keyToRemove)
            console.log('deleted?', res_bool)
            setEntries((prevEntries) => {
                const newEntries = { ...prevEntries };
                delete newEntries[keyToRemove];
                return newEntries;
            });
            sessionStorage.removeItem('TaxTypeData')
        }
        deleting()
      }

    return (
        <div className="w-full h-full rounded-lg bg-white border-[1px]">
            <div className={`${user?.role === '1' ? 'bg-customgreen' : 'bg-BOGreen'} w-full h-auto flex px-2 py-2 rounded-t-lg text-white`}>
                <h1 className='w-1/3 text-center font-bold px-2'>Tax Type</h1>
                <h1 className='w-1/3 text-center font-bold'>Cost Category</h1>
                <h1 className='w-1/3 text-center font-bold'>Computation</h1>
                <button 
                className='text-white text-2xl rounded-full'
                onClick={handleShowInput}
                ><IoAdd/></button>
            </div>
            {showInput && (
                    <div className="px-2 py-2 bg-gray-200 flex gap-1">
                        <select
                            value={tax}
                            onChange={(e) => setTax(e.target.value)}
                            className="border border-gray-300 p-2 rounded w-1/5"
                        >
                            <option value="" disabled>Select Tax Type</option>
                            <option value="VAT">VAT</option>
                            <option value="NONVAT">NON VAT</option>
                        </select>
                        <input
                            type="text"
                            value={cost}
                            onChange={(e) => setCost(capitalize(e.target.value))}
                            placeholder="e.g. Services"
                            className="border border-gray-300 p-2 rounded w-1/5"
                        />
                        <input
                            type="text"
                            value={value1}
                            onChange={(e) => setValue1(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="e.g. /1.12 * 0.05"
                            className="border border-gray-300 p-2 rounded w-1/5"
                        />
                        <input
                            type="text"
                            value={value2}
                            onChange={(e) => setValue2(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="e.g. /1.12 * 0.05"
                            className="border border-gray-300 p-2 rounded w-1/5"
                        />
                        <button
                            onClick={handleSubmit}
                            className="w-1/5 bg-adminBlue text-white rounded"
                        >
                            Submit
                        </button>
                    </div>
                )}
                <div className="h-80 overflow-y-auto">
                    {Object.entries(entries).map(([key, entry]) => (
                        <div key={key} className="flex border p-2 my-1 rounded-md">
                            <p className="w-1/3 flex justify-center items-center">{entry.tax}</p>
                            <p className="w-1/3 flex justify-center items-center">{entry.cost}</p>
                            <p className="w-1/3 flex justify-center items-center">gross{entry.value1}<br />gross{entry.value2}</p>
                            <div className="flex justify-center items-center">
                                <button
                                    className="text-red-500 w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-500 hover:text-white"
                                    onClick={() => handleRemoveEntry(key)}
                                >
                                    <MdRemove/>
                                </button>
                            </div>
                        </div>
                    ))}
                    
                </div>
            
        </div>
    )
 }