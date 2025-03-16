import { IoAdd } from "react-icons/io5";
import { MdOutlineEdit, MdRemove } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
 
import { useState, useEffect } from "react";
import { useApproverHook } from "../../../hooks/useApproverHook";
import { useAuthContext } from '../../../hooks/useAuthContext'
import LargeLoader from '../../Loaders/LargeLoader'
 
 export const FundCluster = () => {
    const { user } = useAuthContext()
    // Fund Cluster
    const [showInput, setShowInput] = useState(false); // State to toggle input visibility
    const [inputValue, setInputValue] = useState("");
    const [arrFund, setArrFund] = useState({})
    const {addNewFundCluster, getFundCluster, deleteFundCluster, updateFundCluster, isLoading} = useApproverHook()
    const [updateFlag, setUpdateFlag] = useState(false)
    const [key, setKey] = useState('')

    useEffect(() => {
        if(!showInput) {
            setInputValue('')
        }
    }, [inputValue, showInput, updateFlag])

    // Fund Cluster 
    const handleAddString = (flag, fundCluster = '', key = '') => {
        if(flag) { 
            setInputValue(fundCluster)
            setKey(key)
            setUpdateFlag(true)  // Ensure update mode is set
        } else {
            setInputValue("");  // Clear input when adding a new entry
            setKey("");         // Reset key to avoid unintended updates
            setUpdateFlag(false);  // Ensure we enter create mode
        }
        setShowInput(!showInput);
    };
    

    const handleInputChange = (e) => {
        setInputValue(e.target.value); // Update input field value
    };

    const handleSubmit = async(e) => {
        e.preventDefault()
        if (inputValue.trim() !== "") {
            const randomKey = Math.random().toString(36).substring(2, 15);
            await addNewFundCluster(inputValue, randomKey)
            setInputValue(""); // Clear input after submission
            setShowInput(false); // Hide input after submission
            setArrFund(prev => {
                const newObj = { ...prev };
                newObj[randomKey] = inputValue;
                return newObj;
            });
            sessionStorage.removeItem('FundClusterData');
        }
    };

    const handleUpdate = async(e) => {
        e.preventDefault()
        if(inputValue.trim() !== "") {
            await updateFundCluster(key, inputValue)
            setInputValue(""); // Clear input after submission
            setUpdateFlag(false)
            setShowInput(false); // Hide input after submission
            setArrFund(prev => {
                const newObj = { ...prev };
                newObj[key] = inputValue;
                return newObj;
            });
            sessionStorage.removeItem('FundClusterData');
        }
    }

    const handleDeleteFund = (key) => {
        const deletingFund = async () => {
             await deleteFundCluster(key)
            setArrFund(prev => {
                const newObj = { ...prev };
                delete newObj[key];
                return newObj;
            });
            sessionStorage.removeItem('FundClusterData');
        }
        deletingFund()
    }

    useEffect(() => {
        const gettingData = async () => {
            const fundClusterData = sessionStorage.getItem('FundClusterData');
            if(!fundClusterData){
                const arr = await getFundCluster()
                setArrFund(arr)
            }else{
                const parsedFund = JSON.parse(fundClusterData)
                setArrFund(parsedFund)
            }
        }
        gettingData()
    }, [])

    return (
        <div className="w-full h-auto flex flex-col rounded-lg">
            <div className="w-full h-auto flex items-center justify-between px-2 py-1 rounded-lg bg-gray-200 text-gray-500">
                <h1 className='w-5/6 text-sm text-left font-bold px-2'>Fund Cluster</h1>
                <div className="w-1/6 flex justify-center items-center">
                    <button 
                        className='text-2xl rounded-full'
                        onClick={() => handleAddString(false)}>{showInput ? <IoIosClose />: <IoAdd/>}</button>
                </div>
            </div>
            {showInput && (
                    <form onSubmit={updateFlag ? handleUpdate : handleSubmit} className="px-2 py-2 bg-gray-100 flex gap-1">
                        <input
                            type="text"
                            value={inputValue}
                            required
                            onChange={handleInputChange}
                            placeholder="e.g. 501 COB"
                            className={`${user?.role === '1' ? 'outline-customgreen' : 'outline-BOGreen'} border border-gray-300 p-2 rounded-lg w-4/5`}
                        />
                        <button
                            type="submit"
                            className={`${user?.role === '1' ? 'bg-customgreen' : 'bg-BOGreen'} w-1/5 h-auto text-white rounded-lg flex items-center justify-center`}
                        >
                            <FaCheck size={15} />
                        </button>
                    </form>
                )}
            <div className="flex-1 overflow-y-auto">
                {Object.keys(arrFund).length > 0 ? (
                    Object.entries(arrFund).map(([key, value], index) => (
                        <div key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} w-full h-12 rounded-lg px-4 flex items-center justify-center`}>
                            <span className="flex-1 text-left">{value}</span> {/* Display only the value */}
                            <button 
                                onClick={() => handleAddString(true, value, key)}
                                className="px-1 py-1 rounded-full"
                            >
                                <MdOutlineEdit />
                            </button>
                            <button 
                                onClick={() => handleDeleteFund(key)} // Pass the key to delete
                                className="text-red-500 px-1 py-1 rounded-full hover:bg-red-500 hover:text-white"
                            >
                                <MdRemove />
                            </button>
                        </div>
                    ))
                ) : (
                    <div>No fund clusters available</div>
                )}
                
            </div>
            {isLoading && (
                <LargeLoader/>
            )}
        </div>
    )
 }