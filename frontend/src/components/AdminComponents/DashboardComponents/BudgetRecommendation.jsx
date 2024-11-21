import axios from "axios";
import { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import { IoMdSend } from "react-icons/io";
import { IoMdBackspace } from "react-icons/io";
import { useDispatch } from "react-redux";
import { setTestForecast, setSample, resetTestForecast } from "../../../redux/TestForecastedRedux";
import { useAuthContext } from "../../../hooks/useAuthContext";

const BudgetRecommendation = () => {
    const dispatch = useDispatch()

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear()
    const [forecastedValues, setForecastedValues] = useState({});
    const [remainingMonths, setRemainingMonths] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [expense, setExpense] = useState(0)
    const {user} = useAuthContext()
    const [items, setItems] = useState({proportions: {}, value: 0})

    const fetchData = async () => {
        try {
            const forecast = await fetchForecastedValues();
            
            const forecastValue = Object.entries(forecast.monthly)[0][1].forecast
            const proportions = await fetchPercentages(forecastValue);
            setItems({proportions: proportions, value: forecastValue})
        } catch (error) {
            console.error("Error during data fetching or recommendation calculation", error);
        }
    };

    const fetchPercentages = async (forecastValue) => {
        // const storedProportions = sessionStorage.getItem("proportions");
        // if (storedProportions) {
        //     const parsedProportions = JSON.parse(storedProportions);
        //     return parsedProportions;
        // } else {
            
        // }
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/adminhead/getPercentageForMonth`, {
                month: 11,
                year: 2024,
                amount: forecastValue
            }, { withCredentials: true });
            // const proportions = calculateProportions(data);
            // sessionStorage.setItem("proportions", JSON.stringify(proportions));
            return data;
        } catch (error) {
            console.error("Error fetching proportions:", error);
            throw error;
        }
    };

    const fetchForecastedValues = async () => {
        const storedForecasted = sessionStorage.getItem("forecasted");
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
                const sampleData = {
                    [`${currentYear}-${selectedMonth}`]: expense
                }
                dispatch(setTestForecast(forecast))
                dispatch(setSample(sampleData))
                
                if (proportions && forecast) {
                    const monthDifference = selectedMonth >= currentMonth ? selectedMonth - currentMonth : (selectedMonth+12) - currentMonth
                    calculateRecommendation(proportions, forecast, monthDifference, false);
                }
            }
        }catch(error){
            console.log(error)
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
                dispatch(resetTestForecast())
            }
        }catch(error){
            console.log(error)
        }
    }

    return (
        <div className="w-full h-full border-2 rounded-lg p-2 overflow-y-auto">
            <h1 className={`${user?.role === '1' ? 'text-customgreen' : 'text-BOGreen'} font-bold text-lg my-2`}>Budget Recommendation</h1>
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
            <Dropdown title="Forecast Breakdown" categoryForecast={items.value} percentages={items.proportions}/>
            {/* {Object.entries(forecastedValues).map(([categoryKey, { categoryForecast, subcategoryForecasts }]) => (
                <Dropdown
                    key={categoryKey}
                    title={categoryKey}
                    categoryForecast={categoryForecast}
                    subcategoryForecast={subcategoryForecasts}
                />
            ))} */}
        </div>
    );
};

export default BudgetRecommendation;