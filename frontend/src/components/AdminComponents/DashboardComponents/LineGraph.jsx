import ReactApexChart from 'react-apexcharts';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useDispatch, useSelector } from "react-redux";
import { setExpense } from "../../../redux/TotalExpenseRedux";
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { firestore } from "../../../config/firebase-config";

const LineGraph = ({ chartData, customYear, test_values = [{ monthYear: ``, amount: 0 }] }) => {
    const [year, setYear] = useState(customYear);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { user } = useAuthContext();
    const [currentLineGraph, setCurrentLineGraph] = useState('all')
    const dispatch = useDispatch();

    const testData = useSelector((state) => state.testforecast);

    const formatToPeso = (value) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(value);
    };

    const getYear = () => {
        chartData = { 
            ...chartData,
            2025: { '2025-02-28': 0, '2025-01-31': 0 }
        };
        const keys = chartData ? Object.keys(chartData) : [];
        return keys.sort((a, b) => b.localeCompare(a));
    };

    const [lineOptions, setLineOptions] = useState({
        series: [
            { name: 'Expense', data: [] },
            { name: 'Forecasted Expense', data: [] }
        ],
        options: {
            chart: {
                height: 350,
                type: 'line',
                id: 'chartID',
                toolbar: {
                    show: false,
                },
            },
            stroke: { width: [3, 3], curve: 'smooth', colors: ['#546E7A', '#FF5733'] },
            xaxis: { categories: [], tickAmount: 10 },
            grid: {
                row: {
                    color: ["#f3f3f3", "transparent"],
                    opacity: 0.5
                }
            },
            yaxis: {
                labels: {
                    formatter: function (value) {
                        return value !== null ? formatToPeso(value.toFixed(2)) : ''; 
                    }
                }
            }
        }
    });

    const [firebaseData, setFirebaseData] = useState({})
    useEffect(() => {
        const collectionRef = collection(firestore, 'YearlyRecords');
        const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
            const documentsObj = snapshot.docs.reduce((acc, doc) => {
                acc[doc.id] = doc.data();
                return acc;
            }, {});
            console.log(documentsObj)
            const merged = mergeDateAmount(documentsObj)
            setFirebaseData(merged)
        });
        
        return () => unsubscribe();
    }, [])

    const mergeDateAmount = (data) => {
        const mergedDates = {};

        Object.values(data).forEach(category => {
            Object.keys(category).forEach(key => {
                if (key.endsWith("_dates")) {
                    Object.entries(category[key]).forEach(([date, value]) => {
                        mergedDates[date] = (mergedDates[date] || 0) + value;
                    });
                }
            });
        });

        return mergedDates
    }

    const mergeData = (prevData, newData) => {
        Object.entries(newData).forEach(([date, value]) => {
            const year = date.split("-")[0];
    
            if (!prevData[year]) {
                prevData[year] = {};
            }
    
            prevData[year][date] = (prevData[year][date] || 0) + value;
        });
    };

    useEffect(() => {
        // Add test values to chartData
        console.log(chartData)
        test_values.forEach(({ monthYear, amount }) => {
            const [year, month, lastDay] = monthYear.split("-");
            if (!chartData[year]) {
                chartData[year] = {};
            }
            chartData[year][monthYear] = parseFloat(amount);
        });
        console.log(chartData)
        mergeData(chartData, firebaseData)
        dispatch(setExpense(chartData));

        // Get data for the selected year
        const getXAxis = () => (chartData[year] ? Object.keys(chartData[year]) : []);
        const getValues = () => (chartData[year] ? Object.values(chartData[year]) : []);
        const values = getValues();
        let xAxis = getXAxis();
        
        // Handle test data if present
        if (Object.keys(testData.sample).length > 0) {
            values.pop();
            values.push(parseFloat(Object.values(testData.sample)[0]));
        }

        // Handle forecasted data
        let forecastXAxis;
        let forecastValues;
        let UpperBounds;
        let LowerBounds;
        if (Object.keys(testData.sampleoutcome).length === 0) {
            const forecastedData = JSON.parse(sessionStorage.getItem('forecasted')) || {};
        
            if (year === 'Custom') {
                console.log(chartData)
                const mergedData = { ...forecastedData };
                Object.entries(chartData).forEach(([year, months]) => {
                    Object.entries(months).forEach(([date, value]) => {
                        if (!mergedData.monthly[date]) {
                            mergedData.monthly[date] = { forecast: value, lower: null, upper: null };
                        }
                    });
                });

                forecastXAxis = Object.keys(mergedData.monthly || {}).filter(date => date >= startDate && date <= endDate);
                forecastValues = forecastXAxis.map(date => mergedData.monthly?.[date]?.forecast || 0);
                UpperBounds = forecastXAxis.map(date => mergedData.monthly?.[date]?.upper || 0);
                LowerBounds = forecastXAxis.map(date => Math.max(mergedData.monthly?.[date]?.lower || 0, 0));

                console.log(mergedData)
            } else {
                forecastXAxis = forecastedData.monthly && year == customYear ? Object.keys(forecastedData.monthly) : [];
                forecastValues = forecastedData.monthly && year == customYear ? Object.values(forecastedData.monthly).map(data => data.forecast) : [];
                UpperBounds = forecastedData.monthly && year == customYear ? Object.values(forecastedData.monthly).map(data => data.upper) : [];
                LowerBounds = forecastedData.monthly && year == customYear ? Object.values(forecastedData.monthly).map(data => Math.max(data.lower, 0)) : [];
            }
        } else {
            if (year === 'Custom') {
                console.log(chartData)
                
                const mergedData_test = { 
                    ...testData, 
                    sampleoutcome: testData.sampleoutcome 
                        ? { ...testData.sampleoutcome } 
                        : {} 
                };

                Object.entries(chartData).forEach(([year, months]) => {
                    Object.entries(months).forEach(([date, value]) => {
                        if (!mergedData_test.sampleoutcome[date]) {
                            mergedData_test.sampleoutcome[date] = { forecast: value, lower: null, upper: null };
                        }
                    });
                });
                forecastXAxis = Object.keys(mergedData_test.sampleoutcome).filter(date => date >= startDate && date <= endDate);
                forecastValues = forecastXAxis.map(date => mergedData_test.sampleoutcome?.[date]?.forecast || 0);
                UpperBounds = forecastXAxis.map(date => mergedData_test.sampleoutcome?.[date]?.upper || 0);
                LowerBounds = forecastXAxis.map(date => Math.max(mergedData_test.sampleoutcome?.[date]?.lower || 0, 0));
            } else {
                forecastXAxis = testData.sampleoutcome && year == customYear ? Object.keys(testData.sampleoutcome) : [];
                forecastValues = testData.sampleoutcome && year == customYear ? Object.values(testData.sampleoutcome).map(data => data.forecast) : [];
                UpperBounds = testData.sampleoutcome && year == customYear ? Object.values(testData.sampleoutcome).map(data => data.upper) : [];
                LowerBounds = testData.sampleoutcome && year == customYear ? Object.values(testData.sampleoutcome).map(data => Math.max(data.lower, 0)) : [];
            }
        }
        

        // Combine actual and forecasted data
        const combinedXAxis = Array.from(new Set([...xAxis, ...forecastXAxis])).sort();

        // Filter data based on date range
        const filteredXAxis = combinedXAxis.filter(date => 
            (!startDate || date >= startDate) && (!endDate || date <= endDate)
        );

        const filteredActualData = filteredXAxis.map(date => {
            const index = xAxis.indexOf(date);
            return index !== -1 ? values[index] : null;
        });

        const filteredForecastData = filteredXAxis.map(date => {
            const index = forecastXAxis.indexOf(date);
            return index !== -1 ? forecastValues[index] : null;
        });

        const filteredUpperBoundData = filteredXAxis.map(date => {
            const index = forecastXAxis.indexOf(date);
            return index !== -1 ? UpperBounds[index] : null;
        });
    
        const filteredLowerBoundData = filteredXAxis.map(date => {
            const index = forecastXAxis.indexOf(date);
            return index !== -1 ? LowerBounds[index] : null;
        });

        // Update chart options
        setLineOptions((prevOptions) => ({
            ...prevOptions,
            series: [
                { ...prevOptions.series[0], data: filteredActualData, type: 'line' },
                { ...prevOptions.series[1], data: filteredForecastData, type: 'line' },
                { 
                    name: 'Upper Bound', 
                    data: filteredUpperBoundData, 
                    type: 'area', 
                    color: '#acf296',
                },
                { 
                    name: 'Lower Bound', 
                    data: filteredLowerBoundData, 
                    type: 'area' ,
                    color: '#f29f96',
                }  
            ],
            options: { 
                ...prevOptions.options, 
                xaxis: { ...prevOptions.options.xaxis, categories: filteredXAxis },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'light',
                        type: 'vertical'
                    }
                },
                stroke: { curve: 'smooth', width: [2, 2, 0] } 
            }
        }));
    }, [chartData, year, startDate, endDate, testData, firebaseData, currentLineGraph]);

    return (
        <div className="w-full h-full">
            <div className="h-[10%] flex items-center justify-between pl-5">
                <div className={`font-bold ${user?.role === '4' ? 'text-customgreen' : 'text-BOGreen'}`}>
                    <p>Expense Trends and Forecast</p>
                </div>
                <div className='flex items-center justify-center gap-2'>
                    {year === 'Custom' && (
                        <div className='flex gap-2'>
                            <button 
                            onClick={() => {
                                setStartDate('')
                                setEndDate('')
                            }}
                            className="text-white bg-red-500 hover:bg-red-900 focus:ring-2 focus:ring-red-300 transition-all px-3 py-2 rounded-lg text-xs font-medium"
                            >✕ Clear</button>
                            <input
                                type="date"
                                value={startDate}
                                min="2021-01-01"
                                onChange={(e) => setStartDate(e.target.value)}
                                placeholder="Start Date"
                                className={`text-xs py-2 rounded-lg border-2 px-2 ${user?.role === '1' ? 'focus:outline-customgreen' : 'focus:outline-BOGreen'}`}
                            />
                            <input
                                type="date"
                                // min="2021-01-31"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                placeholder="End Date"
                                className={`text-xs py-2 rounded-lg border-2 px-2 ${user?.role === '1' ? 'focus:outline-customgreen' : 'focus:outline-BOGreen'}`}
                            />
                        </div>
                    )}
                    {/* <select 
                        value={currentLineGraph} onChange={(e) => setCurrentLineGraph(e.target.value)}
                        className={`py-1 rounded-lg border-2 px-2 ${user?.role === '1' ? 'focus:outline-customgreen' : 'focus:outline-BOGreen'}`}>
                        
                        <option value={'lfp'}>LFP</option>
                        <option value={'cob'}>COB</option>
                        <option value={'carp'}>CARP</option>
                        <option value={'cf'}>Farming Support Services Program</option>
                        <option value={'all'}>All</option>
                    </select> */}
                    <select 
                        value={year} onChange={(e) => setYear(e.target.value)}
                        className={`py-1 rounded-lg border-2 px-2 ${user?.role === '1' ? 'focus:outline-customgreen' : 'focus:outline-BOGreen'}`}>
                        {getYear().map((year, index) => (
                            <option key={index} value={year}>{year}</option>
                        ))}
                        <option value={'Custom'}>Custom Date</option>
                    </select>
                </div>
            </div>
            <div className='w-full h-[90%]'>
                <ReactApexChart
                    options={lineOptions.options}
                    series={lineOptions.series}
                    type="line"
                    height={'100%'}
                    width={'100%'}
                />
            </div>
        </div>
    );
};

LineGraph.propTypes = {
    chartData: PropTypes.object.isRequired,
    customYear: PropTypes.string.isRequired,
    test_values: PropTypes.array
};

export default LineGraph;