import { useState } from "react";

const Dropdown = ({ title, categoryForecast, subcategoryForecast }) => {
    const [isOpen, setIsOpen] = useState(false);
    const formatToPeso = (value) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(value);
    };
    return (
        <div className="w-full border-2 rounded-md p-4 shadow-md bg-gray-50 mb-4">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full text-left text-xl font-semibold mb-2 focus:outline-none"
            >
                {title} - {formatToPeso(categoryForecast.toFixed(2))}
            </button>
            {isOpen && (
                <ul className="mt-2 border-t pt-2 list-disc list-inside space-y-2">
                    {Object.entries(subcategoryForecast).map(([key, value]) => (
                        <li key={key} className="text-gray-700">
                            {key}: {formatToPeso(value.toFixed(2))}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;