import axios from "axios";
import { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import { IoMdSend } from "react-icons/io";
import { IoMdBackspace } from "react-icons/io";

const BudgetRecommendation = () => {
    const currentMonth = new Date().getMonth() + 1;
    const [forecastedValues, setForecastedValues] = useState({});
    const [remainingMonths, setRemainingMonths] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [expense, setExpense] = useState(0)

    const fetchData = async () => {
        try {
            const proportions = await fetchPercentages();
            const forecast = await fetchForecastedValues();
            if (proportions && forecast) {
                calculateRecommendation(proportions, forecast);
            }
        } catch (error) {
            console.error("Error during data fetching or recommendation calculation", error);
        }
    };

    const fetchPercentages = async () => {
        const storedProportions = sessionStorage.getItem("proportions");
        if (storedProportions) {
            const parsedProportions = JSON.parse(storedProportions);
            return parsedProportions;
        } else {
            try {
                const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/adminhead/getPercentageForMonth`, {
                    year: "2024",
                    month: "10",
                }, { withCredentials: true });
                const proportions = calculateProportions(data);
                sessionStorage.setItem("proportions", JSON.stringify(proportions));
                return proportions;
            } catch (error) {
                console.error("Error fetching proportions:", error);
                throw error;
            }
        }
    };

    const fetchForecastedValues = async () => {
        const storedForecasted = sessionStorage.getItem("forecasted");
        console.log('fetching')
        if (storedForecasted) {
            const parsedForecast = JSON.parse(storedForecasted);
            return parsedForecast;
        } else {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/adminhead/getForecastedValues`, {
                    withCredentials: true,
                });
                sessionStorage.setItem("forecasted", JSON.stringify(data));
                return data;
            } catch (error) {
                console.error("Error fetching forecasted values:", error);
                throw error;
            }
        }
    };

    const calculateProportions = (data) => {
        const totalSum = Object.values(data).reduce((total, category) => (
            total + Object.values(category).reduce((catTotal, subcategory) => catTotal + subcategory, 0)
        ), 0);

        const proportions = {};
        Object.keys(data).forEach((category) => {
            const categoryTotal = Object.values(data[category]).reduce((sum, subcategory) => sum + subcategory, 0);
            const categoryProportion = categoryTotal / totalSum;

            proportions[category] = {
                categoryProportion,
                subcategoryProportions: {},
            };

            Object.keys(data[category]).forEach((subcategory) => {
                const subcategoryProportion = data[category][subcategory] / categoryTotal;
                proportions[category].subcategoryProportions[subcategory] = subcategoryProportion;
            });
        });

        return proportions;
    };

    const calculateRecommendation = (proportions, forecast, thismonth = 0, flag = true) => {
        let forecastValue = 0
        if(flag){
            if (!forecast?.monthly) return;

            const dateString = Object.keys(forecast.monthly)[thismonth];
            console.log(dateString)
            forecastValue = parseFloat(forecast.monthly[dateString]?.forecast);
        }else{
            if (!forecast) return;
            const dateString = Object.keys(forecast)[thismonth];
            console.log(dateString)
            forecastValue = parseFloat(forecast[dateString]?.forecast);
        }

        if (!isNaN(forecastValue)) {
            const forecastDistribution = {};

            Object.keys(proportions).forEach((category) => {
                const categoryForecast = forecastValue * proportions[category].categoryProportion;
                forecastDistribution[category] = {
                    categoryForecast,
                    subcategoryForecasts: {},
                };

                Object.keys(proportions[category].subcategoryProportions).forEach((subcategory) => {
                    forecastDistribution[category].subcategoryForecasts[subcategory] =
                        categoryForecast * proportions[category].subcategoryProportions[subcategory];
                });
            });

            console.log(forecastDistribution)
            setForecastedValues(forecastDistribution);
        } else {
            console.warn("Invalid forecast value encountered.");
        }
    };

    useEffect(() => {
        const getData = async () => {
            generateRemainingMonths();
            await fetchData();
        }
        getData()

    }, []);

    const generateRemainingMonths = () => {
        const currentMonth = new Date().getMonth() + 1;
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const reaminging = months.slice(currentMonth - 1).map((month, index) => ({
            name: month,
            value: currentMonth + index
        }));
        setRemainingMonths(reaminging)
    };

    const handleTest = async () => {
        try{
            const data = {
                frequency: 1,
                expense: expense,
                steps: 12
            }
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/adminhead/sendTestExpense`, data, {
                withCredentials: true
            })
            const proportions = await fetchPercentages();
            if(res.status === 200){
                const forecast = res.data
                if (proportions && forecast) {
                    const monthDifference = selectedMonth >= currentMonth ? selectedMonth - currentMonth : (selectedMonth+12) - currentMonth
                    console.log(monthDifference)
                    calculateRecommendation(proportions, forecast, monthDifference, false);
                }
            }
        }catch(error){

        }
    }

    const handleReset  =async() => {
        try{
            const forecast = await fetchForecastedValues();
            const proportions = await fetchPercentages();
            if (proportions && forecast) {
                calculateRecommendation(proportions, forecast);
                setExpense(0)
                setSelectedMonth(currentMonth)
            }
        }catch(error){

        }
    }

    return (
        <div className="w-full h-full border-2 rounded-md p-4 shadow-md bg-gray-50 overflow-y-auto">
            <div className="flex items-center space-x-4 mb-4">
                <input
                    type="number"
                    placeholder="Expense"
                    className="border-2 rounded-md p-2 w-2/6"
                    value={expense === 0 ? '': expense}
                    onChange={(e) => setExpense(e.target.value)}
                />
                <select 
                    className="border-2 rounded-md p-2 w-2/6"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                    {
                        remainingMonths.map(({name, value}) => (
                            <option key={value} value={value}>
                                {name}
                            </option>
                        ))
                    }
                </select>
                <button
                    className={`p-2 w-1/6 rounded-md text-white flex justify-center ${
                        selectedMonth === currentMonth
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-customgreen hover:bg-green-600"
                    }`}
                    disabled={selectedMonth === currentMonth}
                    onClick={handleTest}
                >
                    <IoMdSend />
                </button>
                <button
                    className="p-2 w-1/6 rounded-md flex justify-center text-white text-lg bg-red-500 hover:bg-red-600"
                    onClick={handleReset}
                >
                    <IoMdBackspace />
                </button>
            </div>

            {Object.entries(forecastedValues).map(([categoryKey, { categoryForecast, subcategoryForecasts }]) => (
                <Dropdown
                    key={categoryKey}
                    title={categoryKey}
                    categoryForecast={categoryForecast}
                    subcategoryForecast={subcategoryForecasts}
                />
            ))}
        </div>
    );
};

export default BudgetRecommendation;
