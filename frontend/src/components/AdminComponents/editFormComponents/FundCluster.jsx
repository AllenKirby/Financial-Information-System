import { IoAdd } from "react-icons/io5";
import { MdRemove } from "react-icons/md";
 
 import { useState, useEffect } from "react";
 import { useEditForm } from "../../../hooks/useEditForm";
 
 export const FundCluster = () => {
    
    // Fund Cluster
    const [showInput, setShowInput] = useState(false); // State to toggle input visibility
    const [inputValue, setInputValue] = useState("");
    const {addNewFundCluster, getFundCluster, deleteFundCluster} = useEditForm();
    const [arrFund, setArrFund] = useState({})

    // Fund Cluster 
    const handleAddString = () => {
        setShowInput(!showInput);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value); // Update input field value
    };

    const handleSubmit = () => {
        // Add the input value to the list of strings
        if (inputValue.trim() !== "") {
            const randomKey = Math.random().toString(36).substring(2, 15);
            addNewFundCluster(inputValue, randomKey)
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

    const handleDeleteFund = (key) => {
        const deletingFund = async () => {
            const res_bool = await deleteFundCluster(key)
            console.log('deleted?', res_bool)
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
        <div className="w-full h-72 rounded-lg">
            <div className='w-full h-auto flex px-2 py-2 rounded-t-lg bg-customgreen text-white'>
                <h1 className='w-4/5 text-left font-bold px-2'>Fund Cluster</h1>
                <div className="w-1/5 flex justify-center items-center">
                    <button 
                        className='bg-customgreen text-white text-2xl rounded-full hover:bg-white hover:text-customgreen'
                        onClick={handleAddString}><IoAdd/></button>
                </div>
            </div>
            {showInput && (
                    <div className="px-2 py-2 bg-gray-200 flex gap-1">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="Enter a new fund cluster"
                            className="border border-gray-300 p-2 rounded w-4/5"
                        />
                        <button
                            onClick={handleSubmit}
                            className="w-1/5 bg-blue-500 text-white rounded"
                        >
                            Submit
                        </button>
                    </div>
                )}
            <div className="h-80 overflow-y-auto">
                {Object.keys(arrFund).length > 0 ? (
                    Object.entries(arrFund).map(([key, value], index) => (
                        <div key={index} className="w-full h-12 rounded-md my-1 px-2 bg-white border-[1px] text-customFontGreen flex items-center justify-center hover:bg-slate-100">
                            <span className="flex-1 text-left">{value}</span> {/* Display only the value */}
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
        </div>
    )
 }