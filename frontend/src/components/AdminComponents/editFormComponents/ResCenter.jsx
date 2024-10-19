import { IoAdd } from "react-icons/io5";
import { MdRemove } from "react-icons/md";

import { useState, useEffect } from "react";
import { useRC } from "../../../hooks/useRC";

export const ResCenter = () => {

    const [showInput_RC, setShowInput_RC] = useState(false);
    const [inputValue_RC, setInputValue_RC] = useState("");
    const {addNewRC, getRC, deleteRC} = useRC();
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
            const res_bool = await deleteRC(key)
            console.log('deleted?', res_bool)
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
        <div className="w-1/5 h-72">
            <div className="w-full rounded-lg">
                <div className='w-full h-auto flex px-2 py-2 rounded-t-lg bg-customgreen text-white'>
                    <h1 className='w-4/5 text-left font-bold px-2'>Responsibility Center</h1>
                    <div className="w-1/5 flex justify-center items-center">
                        <button 
                            className='bg-customgreen text-white text-2xl rounded-full hover:bg-white hover:text-customgreen'
                            onClick={handleAddString_RC}><IoAdd/></button>
                    </div>
                </div>
                {showInput_RC && (
                    <div className="px-2 py-2 bg-gray-200 flex gap-1">
                        <input
                            type="text"
                            value={inputValue_RC}
                            onChange={handleInputChange_RC}
                            placeholder="Enter a new fund cluster"
                            className="border border-gray-300 p-2 rounded w-4/5"
                        />
                        <button
                            onClick={handleSubmitRC}
                            className="w-1/5 bg-blue-500 text-white rounded"
                        >
                            Submit
                        </button>
                    </div>
                )}
                <div className="h-50 overflow-y-auto">
                    {Object.keys(arrRC).length > 0 ? (
                        Object.entries(arrRC).map(([key, value], index) => (
                            <div key={index} className="w-full h-12 rounded-md my-1 px-2 bg-white border-[1px] text-customFontGreen flex items-center justify-center hover:bg-slate-100">
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
        </div>
    )
}