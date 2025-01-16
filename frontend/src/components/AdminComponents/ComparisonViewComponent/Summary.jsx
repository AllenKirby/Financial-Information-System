import { useState, useEffect } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useSelector } from "react-redux";
import { collection, query, onSnapshot } from "firebase/firestore"
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
    const [month, setMonth] = useState({})
    const [yearlyExpense, setYearlyExpense] = useState({})

    const [forecasted_data, setForecasted_data] = useState({})

    const [monthCategory, setMonthCategory] = useState({})

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

      const toggleMonth = (month) => {
        setMonth((prev) => ({
            ...prev,
            [month] : !prev[month]
        }))
      }

    const {user} = useAuthContext()

    useEffect(() => {
        const unsubscribe = onSnapshot(
          collection(firestore, "MonthCategory"),
          (snapshot) => {
            if (snapshot.empty) {
              setData({});
              return;
            }
      
            const parsedData = {};
      
            snapshot.forEach((doc) => {
              const monthId = doc.id; // e.g., "2024-11"
              const fields = doc.data(); // All fields in the document
      
              const [year] = monthId.split("-"); // Extract the year from "2024-11"
      
              // Ensure the year key exists
              if (!parsedData[year]) {
                parsedData[year] = {};
              }
      
              // Initialize the month object under the year
              if (!parsedData[year][monthId]) {
                parsedData[year][monthId] = {};
              }
      
              // Process each field in the document
              Object.entries(fields).forEach(([key, value]) => {
                const [category, subcategory] = key.split("|"); // Split "category|subcategory"
                if (!parsedData[year][monthId][category]) {
                  parsedData[year][monthId][category] = {}; // Initialize category object
                }
                parsedData[year][monthId][category][subcategory] = value; // Assign subcategory value
              });
            });
            setMonthCategory(parsedData);
          },
          (error) => {
            console.error("Error fetching MonthCategory:", error);
          }
        );
      
        return () => unsubscribe(); // Cleanup listener on unmount
      }, [firestore]);  

    useEffect(() => {
        const collectionRef = query(collection(firestore, "forecasted"))
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

    const calculateTotalExpenses = (data, year, month) => {
        // Check if the year exists in the data
        if (!data[year]) {
          return 0;
        }
      
        // Check if the month exists in the year's data
        if (!data[year][month]) {
          return 0;
        }
      
        const monthData = data[year][month]; // Get the data for the specific month
        let totalExpense = 0;
      
        // Loop through each category and subcategory to sum expenses
        Object.values(monthData).forEach((subcategoryData) => {
          Object.values(subcategoryData).forEach((amount) => {
            totalExpense += amount; // Add up all amounts
          });
        });
      
        return totalExpense;
      };

    const formatToPeso = (value) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(value);
    };

    return (
        <div className="w-full h-full border-2 rounded-lg p-2 overflow-y-auto space-y-4">
            <h1 className={`${user?.role === '1' ? 'text-customgreen' : 'text-BOGreen'} font-bold text-lg my-2`}>Summary report</h1>
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
                                        {Object.keys(monthlyData.monthly[year] || {}).reverse().map((month) => (
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
                  {Object.keys(monthCategory["2024"] || {}).reverse().map((key) => {
                    const totalExpense = calculateTotalExpenses(monthCategory, "2024", "2024-11")
                    const forecastedValue = forecasted_data?.[key] || 0;
                    const percentage = forecastedValue !== 0 ? calculatePercentage(totalExpense,forecastedValue) : 0;
              
                    return (
                      <li
                        key={key}
                        className="flex flex-col p-2 border-b border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100"
                      >
                        {/* Wrap the toggleMonth call inside an anonymous function */}
                        <div className="flex justify-between cursor-pointer" onClick={() => toggleMonth(key)}>
                          <span className="font-semibold text-lg">{key}</span>
                          <span className={`font-medium flex items-center space-x-1 ${percentage > 0 ? "text-green-500" : "text-red-500"}`}>
                            {forecastedValue === 0 ? "N/A" : `${percentage}%`}
                            {forecastedValue !== 0 && (percentage >= 0 ? (
                              <HiArrowSmUp className="w-6 h-6" />
                            ) : (
                              <HiArrowSmDown className="w-6 h-6" />
                            ))}
                            
                          </span>
                        </div>
                      </li>
                    );
                  })}
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
                    <ul className="mt-2 border-t pt-2 list-disc list-inside space-y-2">
                    {Object.keys(monthCategory["2024"] || {}).map((monthId) => {
                        const monthData = monthCategory["2024"][monthId];
                        
                        const categoryTotals = {};

                        Object.entries(monthData).forEach(([category, subcategories]) => {
                            let categoryAmount = 0;
                            
                            Object.values(subcategories).forEach((amount) => {
                            categoryAmount += amount; 
                            });

                            if (categoryTotals[category]) {
                            categoryTotals[category] += categoryAmount;
                            } else {
                            categoryTotals[category] = categoryAmount;
                            }
                        });

                        const sortedCategories = Object.entries(categoryTotals)
                            .sort(([, a], [, b]) => b - a) 
                            .map(([category, totalAmount]) => ({ category, totalAmount }));

                        return sortedCategories.map(({ category, totalAmount }) => (
                            <li key={category} className="list-none p-2 border-b border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100">
                              <div className="flex items-center justify-between">
                                  <p className="font-semibold text-sm truncate">{category}</p>
                                  <p className="font-medium text-gray-700">{formatToPeso(totalAmount)}</p>
                              </div>
                            </li>
                        ));
                    })}
                    </ul>
                </div>
                )}
            </div>
        </div>
    );
};

export default BudgetRecommendation;