import { IoAdd } from "react-icons/io5";
import { MdRemove } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

import { useState, useEffect } from "react";
import { useApproverHook } from "../../../hooks/useApproverHook";
import { useAuthContext } from '../../../hooks/useAuthContext'

export const ResCenter = () => {
    const { user } = useAuthContext()
    const [showInput_RC, setShowInput_RC] = useState(false);
    const [inputValue_RC, setInputValue_RC] = useState("");
    const {addNewRC, getRC, deleteRC} = useApproverHook()
    const [arrRC, setArrRC] = useState({})

    const handleAddString_RC = () => {
        setShowInput_RC(!showInput_RC);
    }

    const handleInputChange_RC = (e) => {
        setInputValue_RC(e.target.value); // Update input field value
    };

    const handleSubmitRC = () => {
        // Add the input value to the list of strings
        if (inputValue_RC.trim() !== "") {
            const randomKey = Math.random().toString(36).substring(2, 15);
            addNewRC(inputValue_RC, randomKey)
            setInputValue_RC(""); // Clear input after submission
            setShowInput_RC(false); // Hide input after submission
            setArrRC(prev => {
                const newObj = { ...prev };
                newObj[randomKey] = inputValue_RC;
                return newObj;
            });
            sessionStorage.removeItem('RCData');
        }
    };

    const handleDeleteRC = (key) => {
        const deletingRC = async () => {
            await deleteRC(key)
            setArrRC(prev => {
                const newObj = { ...prev };
                delete newObj[key];
                return newObj;
            });
            sessionStorage.removeItem('RCData');
        }
        deletingRC()
    }


    useEffect(() => {
        const gettingData = async () => {

            const rcData = sessionStorage.getItem('RCData');
            
            if(!rcData){
                const arr_rc = await getRC()
                setArrRC(arr_rc)
            }else{
                const parsedRC = JSON.parse(rcData)
                setArrRC(parsedRC)
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
                        onClick={handleAddString_RC}><IoAdd/></button>
                </div>
            </div>
                {showInput_RC && (
                    <div className="px-2 py-2 bg-gray-100 flex gap-1">
                        <input
                            type="text"
                            value={inputValue_RC}
                            onChange={handleInputChange_RC}
                            placeholder="e.g. AFD"
                            className={`${user?.role === '1' ? 'outline-customgreen' : 'outline-BOGreen'} border border-gray-300 p-2 rounded-lg w-4/5`}
                        />
                        <button
                            onClick={handleSubmitRC}
                            className={`${user?.role === '1' ? 'bg-customgreen' : 'bg-BOGreen'} w-1/5 h-auto text-white rounded-lg flex items-center justify-center`}
                        >
                            <FaCheck size={15} />
                        </button>
                    </div>
                )}
                <div className="flex-1 overflow-y-auto">
                    {Object.keys(arrRC).length > 0 ? (
                        Object.entries(arrRC).map(([key, value], index) => (
                            <div key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} w-full h-12 rounded-lg px-4 flex items-center justify-center`}>
                                <span className="flex-1 text-left">{value}</span> {/* Display only the value */}
                                <button 
                                    onClick={() => handleDeleteRC(key)} // Pass the key to delete
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