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
    const curYear = new Date().getFullYear()
    const currentMonth2 = `${curYear}-${currentMonth}`
    const currentYear = new Date().getFullYear()
    const [forecastedValues, setForecastedValues] = useState({});
    const [remainingMonths, setRemainingMonths] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth2);
    const [expense, setExpense] = useState(0)
    const {user} = useAuthContext()
    const [items, setItems] = useState({proportions: {}, value: 0})
    const [dateSTR, setDateSTR] = useState({date: 0, year: 0})
    

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

    const fetchPercentages = async (forecastValue, month = 11, year = 2024) => {
        // const storedProportions = sessionStorage.getItem("proportions");
        // if (storedProportions) {
        //     const parsedProportions = JSON.parse(storedProportions);
        //     return parsedProportions;
        // } else {
            
        // }
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/adminhead/getPercentageForMonth`, {
                month: month,
                year: year,
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
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
    
        const remainingMonths = months.slice(currentMonth - 1).map((month, index) => ({
            name: month,
            value: `${currentYear}-${String(currentMonth + index).padStart(2, '0')}`
        }));
    
        const nextYearMonths = months.map((month, index) => ({
            name: month,
            value: `${currentYear + 1}-${String(index + 1).padStart(2, '0')}`
        }));
    
        setRemainingMonths([...remainingMonths, ...nextYearMonths]);
    };

    const handleTest = async () => {
        const forecast = await handleTestExpense(expense)
        const forecastValue = Object.entries(forecast)[0][1].forecast
        const proportions = await fetchPercentages(forecastValue, dateSTR.date, dateSTR.year);
        setItems({proportions: proportions, value: forecastValue})
    }


    const handleTestExpense = async (expense) => {
        try{
            const data = {
                frequency: 1,
                expense: expense,
                steps: 12
            }
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/adminhead/sendTestExpense`, data, {
                withCredentials: true
            })
            if(res.status === 200){
                const forecast = res.data
                const sampleData = {
                    [`${currentYear}-${selectedMonth}`]: expense
                }
                dispatch(setTestForecast(forecast))
                dispatch(setSample(sampleData))

                return forecast
            }
        }catch(error){
            console.log(error)
        }
    }

    const handleReset  =async() => {
        try{
            const forecast = await fetchForecastedValues();
            const forecastValue = Object.entries(forecast.monthly)[0][1].forecast
            const proportions = await fetchPercentages(forecastValue);
            setItems({proportions: proportions, value: forecastValue})
            setExpense(0)
            dispatch(resetTestForecast())
            setSelectedMonth(currentMonth)
           
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
                    onChange={(e) => {
                        const value = e.target.value
                        const [y, m] = value.split('-')
                        const year = Number(y)
                        const month = Number(m)
                        console.log(year, month); 
                        setSelectedMonth(value);
                        setDateSTR({date: month, year: year}) 
                    }}
                >
                    <option value="" disabled>
                        Select a month
                    </option>
                    {remainingMonths.map(({ name, value }) => (
                        <option key={value} value={value}>
                            {name} {value.split('-')[0]} {/* Display month and year */}
                        </option>
                    ))}
                </select>
                <button
                    className={`p-2 w-1/6 rounded-md text-white flex justify-center ${
                        selectedMonth === currentMonth2
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-customgreen hover:bg-green-600"
                    }`}
                    disabled={selectedMonth === currentMonth2}
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
            
        </div>
    );
};

export default BudgetRecommendation;