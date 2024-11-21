import { useState } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";

const Dropdown = ({ title, categoryForecast, percentages }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuthContext();

    // Helper function to format values as PHP currency
    const formatToPeso = (value) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(value);
    };


    // Function to calculate the subcategory amounts
    const calculate = (firstForecast, percentages) => {
        const result = {};
        for (const [category, percentage] of Object.entries(percentages)) {
            result[category] = firstForecast * percentage;
        }
        return result;
    };

    // Calculate subcategory amounts
    const subcategoryForecast = calculate(categoryForecast, percentages);

    return (
        <div className="w-full border-2 rounded-md p-2 mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left font-semibold mb-2 focus:outline-none"
            >
                {title} -{" "}
                <span
                    className={`${
                        user?.role === "1" ? "text-customgreen" : "text-BOGreen"
                    }`}
                >
                    {formatToPeso(categoryForecast.toFixed(2))}
                </span>
            </button>
            {isOpen && (
                <ul className="mt-2 border-t pt-2 list-disc list-inside space-y-2">
                    {Object.entries(subcategoryForecast).map(([key, value]) => (
                        <li key={key} className="text-gray-700">
                            {key}:{" "}
                            <span
                                className={`${
                                    user?.role === "1"
                                        ? "text-customgreen"
                                        : "text-BOGreen"
                                } font-semibold`}
                            >
                                {formatToPeso(value.toFixed(2))}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;
