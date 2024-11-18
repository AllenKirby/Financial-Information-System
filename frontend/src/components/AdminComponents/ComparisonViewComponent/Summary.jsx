import axios from "axios";
import { useState, useEffect } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useSelector } from "react-redux";
import { collection, query, doc, onSnapshot, where } from "firebase/firestore"
import { firestore } from "../../../config/firebase-config";
import { HiArrowSmDown, HiArrowSmUp } from "react-icons/hi";

const BudgetRecommendation = () => {

    const monthlyData = useSelector((state) => state.totalexpense)

    const [openSections, setOpenSections] = useState({
        TotalExpenses: false,
        monitoring: false,
        top: false
      });
    const [years, setYears] = useState({})
    const [yearlyExpense, setYearlyExpense] = useState({})

    const [forecasted_data, setForecasted_data] = useState({})

      const toggleSection = (section) => {
        setOpenSections((prev) => ({
          ...prev,
          [section]: !prev[section], // Toggle the state of the clicked section
        }));
      };

      const toggleYear = (year) => {
        setYears((prev) => ({
          ...prev,
          [year]: !prev[year], 
        }));
      };

    const {user} = useAuthContext()

    useEffect(() => {
        const collectionRef = collection(firestore, "forecasted")
        const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
            const data = snapshot.docs.reduce((acc, doc) => {
                acc[doc.id] = doc.data().forecasted
                return acc
            }, {})
            setForecasted_data(data)

        }, 
        (error) => {
            console.error("Error listening to collection: ", error);
        })
        
        return () => unsubscribe()

    }, [])

    useEffect(() => {
        const yearlySums = Object.keys(monthlyData.monthly).reduce((acc, year) => {
            const totalForYear = Object.values(monthlyData.monthly[year]).reduce((sum, value) => sum + value, 0)
            acc[year] = totalForYear
            return acc
        }, {})
        setYearlyExpense(yearlySums)
    }, [openSections.TotalExpenses, monthlyData])

    const calculatePercentage = (actual, forecast) => {
        return (((actual - forecast)/forecast) * 100).toFixed(2)
    }

    const formatToPeso = (value) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(value);
    };

    return (
        <div className="w-full h-full border-2 rounded-lg p-2 overflow-y-auto space-y-4">
            <h1 className={`${user.role === '1' ? 'text-customgreen' : 'text-BOGreen'} font-bold text-lg my-2`}>Summary report</h1>
            <div className="border rounded-lg p-4">
                <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection("TotalExpenses")}
                >
                    <h2 className="font-bold text-lg">Total Expenses</h2>
                    <span>{openSections.TotalExpenses ? "▲" : "▼"}</span>
                </div>
                {openSections.TotalExpenses && (
                <div className="mt-4 space-y-4">
                    <ul className="mt-2 border-t pt-2 list-disc list-inside space-y-2">
                        {
                            Object.keys(yearlyExpense).reverse().map((year) => (
                                <li key={year} className="flex flex-col p-2 border-b border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100">
                                    <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleYear(year)}>
                                        <span className="font-semibold text-lg">{year}</span>
                                        <span className="text-green-500 font-medium">{formatToPeso(yearlyExpense[year])}</span>
                                    </div>

                                    {years[year] && (
                                        <ul className="mt-2 space-y-1 pl-4 border-t">
                                        {Object.keys(monthlyData.monthly[year] || {}).map((month) => (
                                            <li
                                            key={`${year}-${month}`}
                                            className="flex justify-between items-center text-gray-700"
                                            >
                                                <span>{month}</span>
                                                <span className="text-gray-500">
                                                    {formatToPeso(monthlyData.monthly[year][month])}
                                                </span>
                                            </li>
                                        ))}
                                        </ul>
                                    )}

                                </li>
                            ))
                        }
                    </ul>
                </div>
                )}
            </div>
            <div className="border rounded-lg p-4">
                <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection("monitoring")}
                >
                    <h2 className="font-bold text-lg">Variances - <span className="font-normal italic">2024</span></h2>
                    <span>{openSections.monitoring ? "▲" : "▼"}</span>
                </div>
                {openSections.monitoring && (
                <div className="mt-4">
                    <ul className="mt-2 border-t pt-2 list-disc list-inside space-y-2">
                        {
                            Object.keys(forecasted_data || {}).map((key) => {
                                const percentage = calculatePercentage(monthlyData.monthly['2024'][key], forecasted_data[key])
                            return(
                                <li key={key} className="flex flex-col p-2 border-b border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100">
                                    <div className="flex justify-between cursor-pointer">
                                        <span className="font-semibold text-lg">{key}</span>
                                        <span
                                            className={`font-medium flex items-center space-x-1 ${
                                                percentage > 0 ? 'text-green-500' : 'text-red-500'
                                            }`}
                                        >
                                            {percentage}%
                                            {percentage >= 0 ? (
                                                <HiArrowSmUp className="w-6 h-6" />
                                            ) : (
                                                <HiArrowSmDown className="w-6 h-6" />
                                            )}
                                        </span>
                                    </div>
                                </li>
                            )
                        })
                        }
                    </ul>
                </div>
                )}
            </div>
            <div className="border rounded-lg p-4">
                <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection("top")}
                >
                    <h2 className="font-bold text-lg">Top Expenses - <span className="font-normal italic">2024</span></h2>
                    <span>{openSections.top ? "▲" : "▼"}</span>
                </div>
                {openSections.top && (
                <div className="mt-4">
                    <p className="text-sm text-gray-600">
                    Sample Sample
                    </p>
                </div>
                )}
            </div>
        </div>
    );
};

export default BudgetRecommendation;