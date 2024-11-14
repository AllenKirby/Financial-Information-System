
import { useState } from "react";

const FundingModal = ({modal}) => {
    const [isToggled, setIsToggled] = useState(false);

    return(
        <form className="bg-white w-1/4 h-5/6 p-3 rounded-lg">
            <div className="flex flex-col">
                <div className="flex items-center gap-2 mt-4">
                    {/* Input Field */}
                    <input
                    disabled={!isToggled}
                    type="text"
                    placeholder="Enter value"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    />
                    
                    {/* Toggle Button */}
                    <button
                    className="relative w-20 h-10 bg-gray-300 rounded-full focus:outline-none transition-colors duration-30 ease-in-out"
                    type="button"
                    onClick={() => setIsToggled(!isToggled)}
                    >
                        <span
                            className={`absolute top-1/2 left-1 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full transition-transform duration-300 ease-in-out ${
                            isToggled ? 'translate-x-8' : 'translate-x-0'
                            }`}
                        ></span>
                    </button>
                </div>
                <select>
                    <option>asd</option>
                </select>

                <div className="flex items-center justify-end">
                    <button className="font-bold">Save</button>
                    <button 
                        onClick={modal}
                        className="py-2 px-5 rounded-md text-customFontColor font-bold transition-all duration-100"
                        >Back
                    </button>
                </div>
            </div>
        </form>
    )
}

export default FundingModal;