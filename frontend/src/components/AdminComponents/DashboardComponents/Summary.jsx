import { useState, useEffect } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useSelector } from "react-redux";
import { collection, query, onSnapshot } from "firebase/firestore"
import { firestore } from "../../../config/firebase-config";
import { HiArrowSmDown, HiArrowSmUp } from "react-icons/hi";

import { IoIosArrowDown } from "react-icons/io";

const BudgetRecommendation = () => {

    const monthlyData = useSelector((state) => state.totalexpense)

    const [openSections, setOpenSections] = useState({
        TotalExpenses: false,
        monitoring: false,
        top: false
      });
    const [years, setYears] = useState({})
    const [month, setMonth] = useState({})
    const [yearmonth, setYearMonth] = useState({})
    const [yearlyExpense, setYearlyExpense] = useState({})

    const [forecasted_data, setForecasted_data] = useState({})

    const [monthCategory, setMonthCategory] = useState({})

    useEffect(() => {
      console.log(monthCategory)
    }, [monthCategory])

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

      const toggleYearMonth = (value) => {
        setYearMonth((prev) => ({
          ...prev,
          [value]: !prev[value], 
        }))
      }

      const toggleMonth = (month) => {
        setMonth((prev) => ({
            ...prev,
            [month] : !prev[month]
        }))
      }

    const {user} = useAuthContext()

    useEffect(() => {
        const unsubscribe = onSnapshot(
          collection(firestore, "MonthCategory2"),
          (snapshot) => {
            if (snapshot.empty) {
              setData({});
              return;
            }
      
            const parsedData = {};
      
            snapshot.forEach((doc) => {
              parsedData[doc.id] = doc.data();
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
    <div className="w-full h-full border-2 rounded-lg p-2 overflow-y-auto space-y-4 text-gray-500">
      <h1 className={`${user?.role === '1' ? 'text-customgreen' : 'text-BOGreen'} font-bold text-xl my-2`}>Summary report</h1>
      <div className="w-full h-auto border rounded-lg p-4 transition-all duration-300">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("TotalExpenses")}
        >
          <h2 className="font-bold text-lg">Total Expenses</h2>
          <span className={`${openSections.TotalExpenses ? 'rotate-180' : ''} transition-all duration-300`}><IoIosArrowDown size={20}/></span>
        </div>
        {openSections.TotalExpenses && (
          <div className="mt-4 space-y-4">
            <ul className="mt-2 border-t pt-2 list-disc list-inside space-y-2">
              {Object.keys(yearlyExpense).reverse().map((year) => (
                <>
                  <li key={year} className="flex flex-col p-2 border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100">
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
                  <hr />
                </>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      
      <div className="w-full h-auto border rounded-lg p-4 transition-all duration-300">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("top")}
          >
          <h2 className="font-bold text-lg">Categorical Expenses</h2>
          <span className={`${openSections.top ? 'rotate-180' : ''} transition-all duration-300`}><IoIosArrowDown size={20}/></span>
        </div>
        {openSections.top && (
          <div className="mt-4">
            <ul className="mt-2 border-t pt-2 list-disc list-inside space-y-2">
            {Object.keys(monthCategory || {}).map((monthKey) => (
              <li key={monthKey} className="flex flex-col p-2 border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100">
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleYearMonth(monthKey)}>
                    <span className="font-semibold text-lg">{monthKey}</span>
                    {/* <span className="text-green-500 font-medium">{formatToPeso(yearlyExpense[year])}</span> */}
                  </div>
                  {yearmonth[monthKey] && (
                      <ul className="mt-2 space-y-1 pl-4 border-t">
                        {Object.entries(monthCategory[monthKey] || {}).map(([category, amount]) => {
                          // Handle categories with | separator and newlines
                          const formattedCategory = category.split("|")[0];
                          return (
                            <li key={category} className="flex justify-between items-center text-gray-700">
                              <span>{formattedCategory}</span>
                              <span className="text-gray-500">{formatToPeso(amount)}</span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
              </li>
            ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetRecommendation;