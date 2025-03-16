import { useState, useEffect } from "react";

import { IoAdd } from "react-icons/io5";
import { MdOutlineEdit, MdRemove } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";

import { useApproverHook } from "../../../hooks/useApproverHook";
import { useAuthContext } from '../../../hooks/useAuthContext'
import LargeLoader from '../../Loaders/LargeLoader'

export const TaxType = () => {
    const { user } = useAuthContext()
    const [showInput, setShowInput] = useState(false)
    const {addTax, getTaxType, deleteTax, updateTaxType,isLoading} = useApproverHook()

    const [tax, setTax] = useState('')
    const [cost, setCost] = useState('')

    const [value1, setValue1] = useState("");
    const [value2, setValue2] = useState("");

    const [entries, setEntries] = useState({});
    const [updateFlag, setUpdateFlag] = useState(false)
    const [key, setKey] = useState('')

    useEffect(() => {
        if(!showInput) {
            setTax('')
            setCost('')
            setValue1('')
            setValue2('')
        }
    }, [updateFlag, tax, cost, value1, value2, showInput])

    const handleShowInput = (flag, Tax = '', Cost = '', Value1 = '', Value2 = '', key = '') => {
        if(flag) { 
            setTax(Tax)
            setCost(Cost)
            setValue1(Value1)
            setValue2(Value2)
            setKey(key)
            setUpdateFlag(true)  
        } else {
            setTax("")
            setCost("")
            setValue1("")
            setValue2("")
            setKey("")   
            setUpdateFlag(false); 
        }
        setShowInput(!showInput);
    };

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

    const handleSubmit = (e) => {
        e.preventDefault()
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
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        await updateTaxType(key, tax, cost, value1, value2)
        setTax('')
        setCost('')
        setValue1('')
        setValue2('')
        setUpdateFlag(false)
        setShowInput(false)
        setEntries((prev) => {
            const newObj = {...prev}
            newObj[key] = {tax, cost, value1, value2}
            return newObj
        })
        sessionStorage.removeItem('TaxTypeData')
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
            await deleteTax(keyToRemove)
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
        <div className="w-full h-auto flex flex-col rounded-lg">
            <div className="w-full h-auto flex items-center justify-between px-2 py-1 rounded-lg bg-gray-200 text-gray-500">
                <h1 className='hidden sm:block w-[30%] text-center font-bold px-2'>Tax Type</h1>
                <h1 className='hidden sm:block w-[30%] text-center font-bold'>Cost Category</h1>
                <h1 className='hidden sm:block w-[30%] text-center font-bold'>Computation</h1>
                <button 
                    className='w-[10%] text-2xl rounded-full flex items-center justify-center'
                    onClick={() => handleShowInput(false)}>{showInput ? <IoIosClose />: <IoAdd/>}</button>
            </div>
            {showInput && (
                    <form onSubmit={updateFlag ? handleUpdate : handleSubmit} className="px-2 py-2 bg-gray-100 gap-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                        <select
                            value={tax}
                            required
                            onChange={(e) => setTax(e.target.value)}
                            className={`${user?.role === '1' ? 'outline-customgreen' : 'outline-BOGreen'} border border-gray-300 p-2 rounded-lg`}
                        >
                            <option value="" disabled>Select Tax Type</option>
                            <option value="VAT">VAT</option>
                            <option value="NONVAT">NON VAT</option>
                        </select>
                        <input
                            type="text"
                            value={cost}
                            required
                            onChange={(e) => setCost(capitalize(e.target.value))}
                            placeholder="e.g. Services"
                            className={`${user?.role === '1' ? 'outline-customgreen' : 'outline-BOGreen'} border border-gray-300 p-2 rounded-lg`}
                        />
                        <input
                            type="text"
                            value={value1}
                            required
                            onChange={(e) => setValue1(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="e.g. /1.12 * 0.05"
                            className={`${user?.role === '1' ? 'outline-customgreen' : 'outline-BOGreen'} border border-gray-300 p-2 rounded-lg`}
                        />
                        <input
                            type="text"
                            value={value2}
                            required
                            onChange={(e) => setValue2(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="e.g. /1.12 * 0.05"
                            className={`${user?.role === '1' ? 'outline-customgreen' : 'outline-BOGreen'} border border-gray-300 p-2 rounded-lg`}
                        />
                        <button
                            type="submit"
                            className={`${user?.role === '1' ? 'bg-customgreen' : 'bg-BOGreen'} h-auto text-white rounded-lg flex items-center justify-center py-2`}
                        >
                             <FaCheck size={15} />
                        </button>
                    </form>
                )}
                <div className="w-full h-auto">
                    {Object.entries(entries).map(([key, entry], index) => (
                        <div key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} w-full h-auto py-2 rounded-lg flex flex-col sm:flex-row items-center justify-center`}>
                            <p className="w-full sm:w-[30%] flex justify-start sm:justify-center items-center px-2 sm:p-0 ">{entry.tax}</p>
                            <p className="w-full sm:w-[30%] flex justify-start sm:justify-center items-center px-2 sm:p-0 ">{entry.cost}</p>
                            <p className="w-full sm:w-[30%] flex justify-start sm:justify-center items-center px-2 sm:p-0 ">gross{entry.value1} and gross{entry.value2}</p>
                            <div className="w-full sm:w-[10%] flex justify-start sm:justify-center items-center px-2 sm:p-0 ">
                                <button 
                                    onClick={() => handleShowInput(true, entry.tax, entry.cost, entry.value1, entry.value2,key)}
                                    className="px-1 py-1 rounded-full"
                                >
                                    <MdOutlineEdit />
                                </button>
                                <button
                                    className="text-red-500 w-auto h-full flex items-center justify-center rounded-full hover:bg-red-500 hover:text-white"
                                    onClick={() => handleRemoveEntry(key)}
                                >
                                    <MdRemove/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            {isLoading && (
                <LargeLoader/>
            )}
        </div>
    )
 }