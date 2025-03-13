import axios from "axios";
import { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import { IoMdSend } from "react-icons/io";
import { IoMdBackspace } from "react-icons/io";
import { useDispatch } from "react-redux";
import { setTestForecast, setSample, resetTestForecast } from "../../../redux/TestForecastedRedux";
import { useAuthContext } from "../../../hooks/useAuthContext";

const BudgetRecommendation = ({onNewValue}) => {
    const dispatch = useDispatch()
    const monthnow = new Date().getMonth()
    const currentMonth = String(monthnow + 1).padStart(2, "0");
    const curYear = new Date().getFullYear()
    const currentMonth2 = `${curYear}-${currentMonth}`
    const currentYear = new Date().getFullYear()
    const [forecastedValues, setForecastedValues] = useState({});
    const [remainingMonths, setRemainingMonths] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth2);
    const [expenses, setExpenses] = useState([
                                                { monthYear: currentMonth2, amount: "" }
                                            ]);
    const {user} = useAuthContext()
    const [items, setItems] = useState({proportions: {}, value: 0})
    const [dateSTR, setDateSTR] = useState({date: 0, year: 0})
    

    const addExpense = () => {
        setExpenses([...expenses, { monthYear: "", amount: "" }]);
    };

    const removeExpense = (index) => {
        setExpenses(expenses.filter((_, i) => i !== index));
    };

    const updateExpense = (index, field, value) => {
        const updatedExpenses = expenses.map((exp, i) =>
            i === index ? { ...exp, [field]: value } : exp
        );
        setExpenses(updatedExpenses);
    };

    const fetchData = async () => {
        try {
            const forecast = await fetchForecastedValues();
            
            const index_month = new Date().getMonth()

            // const forecastValue = Object.entries(forecast.monthly)[0][1].forecast
            const forecastValue = Object.entries(forecast.monthly)[index_month][1].forecast
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
        const formattedExpenses = expenses.map(({ monthYear, amount }) => [`${monthYear}-01`, parseFloat(amount)]);
        console.log(formattedExpenses)
        console.log(expenses)
        onNewValue(expenses)
        const forecast = await handleMultitpleTestExpense(formattedExpenses)
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

    const handleMultitpleTestExpense = async(expenses) => {
        try{
            const data = {
                frequency: 1,
                expense: expenses,
                steps: 12
            }
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/adminhead/multiTestExpense`, data, {
                withCredentials: true
            })
            if(res.status === 200){
                const forecast = res.data
                console.log(forecast)
                // const sampleData = {
                //     [`${currentYear}-${selectedMonth}`]: expense
                // }
                dispatch(setTestForecast(forecast))
                // dispatch(setSample(sampleData))

                return forecast
            }
        }catch(error){
            console.log(error)
        }
    }

    const handleReset  =async() => {
        try{
            onNewValue([{ monthYear: currentMonth2, amount: 0 }])
            const forecast = await fetchForecastedValues();
            const forecastValue = Object.entries(forecast.monthly)[monthnow][1].forecast
            const proportions = await fetchPercentages(forecastValue);
            setItems({proportions: proportions, value: forecastValue})
            setExpenses([{ monthYear: currentMonth2, amount: "" }])
            dispatch(resetTestForecast())
            setSelectedMonth(currentMonth)
            setNum(0)
           
        }catch(error){
            console.log(error)
        }
    }

    const [num, setNum] = useState(0)
    return (
        <div className="w-full h-full border-2 rounded-lg p-2 overflow-y-auto text-gray-500 ">
            <h1 className={`${user?.role === '1' ? 'text-customgreen' : 'text-BOGreen'} font-bold text-xl my-2`}>Budget Recommendation</h1>
            {
                expenses.map((expense, index) => (
                    <div key={index} className="flex items-center space-x-4 mb-4">
                        <input
                            type="number"
                            placeholder="Expense"
                            className={`${user?.role === '1' ? 'outline-customgreen' : 'outline-BOGreen'} border-2 rounded-md p-2 w-2/6`}
                            // value={expense === 0 ? '': expense}
                            // onChange={(e) => {
                            //     setExpense(e.target.value)
                            // }}
                            value={expense.amount}
                            onChange={(e) => updateExpense(index, "amount", e.target.value)}
                            
                        />
                        <select 
                            className={`${user?.role === '1' ? 'outline-customgreen' : 'outline-BOGreen'} border-2 rounded-md p-2 w-2/6`}
                            // value={selectedMonth}
                            onChange={(e) => {
                                updateExpense(index, "monthYear", e.target.value)
                            }}
                        >
                            <option value="" disabled>
                                Select a month
                            </option>
                            {Array.from({ length: 2 }, (_, yearIndex) => {
                                const year = new Date().getFullYear() + yearIndex;
                                return (
                                    <>
                                        {Array.from({ length: 12 }, (_, monthIndex) => {
                                            const month = (monthIndex + 1).toString().padStart(2, "0");
                                            return (
                                                <option key={`${year}-${month}`} value={`${year}-${month}`}>
                                                    {new Date(year, monthIndex).toLocaleString("default", { month: "long" })} {year}
                                                </option>
                                            );
                                        })}
                                    </>
                                );
                            })}
                        </select>
                        {num === index && (
                                            <button
                                                className="bg-blue-500 text-white px-3 py-1 rounded"
                                                onClick={() => {
                                                    addExpense();
                                                    setNum((prev) => prev + 1);
                                                }}
                                            >
                                                +
                                            </button>
                        )}
                        {num > index && (
                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded"
                                onClick={() => {
                                    removeExpense(index);
                                    setNum((prev) => prev - 1);
                                }}
                            >
                                -
                            </button>
                        )}
                        
                    </div>
                ))
            }
            <div className="flex gap-2 justify-start py-2">
                <button
                    className={`p-2 w-1/6 rounded-md text-white flex justify-center items-center border-2 transition-all duration-150 ${
                        // selectedMonth === currentMonth2
                        false
                            ? "bg-gray-400 cursor-not-allowed"
                            : user?.role === '1' ? 'bg-customgreen border-customgreen hover:bg-white hover:text-customgreen' : 'bg-BOGreen border-BOGreen hover:bg-white hover:text-BOGreen'
                    }`}
                    // disabled={selectedMonth === currentMonth2}
                    onClick={handleTest}
                >
                    <IoMdSend />
                </button>
                <button
                    className="p-2 w-1/6 rounded-md flex justify-center items-center text-white text-lg border-2 border-red-500 bg-red-500 hover:bg-white hover:text-red-500 transition-all duration-150"
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