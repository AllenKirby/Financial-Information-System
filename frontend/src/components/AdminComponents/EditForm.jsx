import { IoAdd } from "react-icons/io5";
import { useState } from "react";
import { useEditForm } from "../../hooks/useEditForm";

const Editform = () => {

    const [strings, setStrings] = useState([]);
    const [showInput, setShowInput] = useState(false); // State to toggle input visibility
    const [inputValue, setInputValue] = useState("");
    const {addNewFundCluster} = useEditForm();

    const handleAddString = () => {
        setShowInput(!showInput);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value); // Update input field value
    };

    const handleSubmit = () => {
        // Add the input value to the list of strings
        if (inputValue.trim() !== "") {
            addNewFundCluster(inputValue)
            setInputValue(""); // Clear input after submission
            setShowInput(false); // Hide input after submission
        }
    };

    return (
        <div className="w-full h-full bg-white rounded-t-lg p-4 mt-14">
            <div className="w-full flex gap-2 ">
                <div className="w-3/5 h-96">
                    <div className="w-full h-full rounded-lg bg-white border-[1px]">
                        <div className='w-full h-auto flex px-2 py-2 rounded-t-lg bg-customgreen text-white'>
                            <h1 className='w-3/5 text-left font-bold px-2'>Account Title</h1>
                            <h1 className='w-2/5 text-center font-bold'>Account Code</h1>
                        </div>
                    </div>
                </div>
                <div className="w-2/5 h-96">
                    <div className="w-full h-full rounded-lg bg-white border-[1px]">
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
                                    className="w-1/5 bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Submit
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="w-full border border-gray-400 h-96 mt-2"></div>
        </div>
    )
}

export default Editform