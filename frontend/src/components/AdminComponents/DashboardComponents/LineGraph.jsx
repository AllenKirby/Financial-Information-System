import ReactApexChart from 'react-apexcharts';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useDispatch } from "react-redux";
import { setExpense } from "../../../redux/TotalExpenseRedux";

const LineGraph = ({ chartData, customYear }) => {
    const [year, setYear] = useState(customYear);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { user } = useAuthContext()
    const dispatch = useDispatch()

    const testData = useSelector((state) => state.testforecast)

    console.log(chartData)

    const formatToPeso = (value) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(value);
    };

    const getYear = () => {
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
                    show: false, // Disable built-in toolbar if you want only custom button
                },
            },
            stroke: { width: [3, 3], curve: 'smooth', colors: ['#546E7A', '#FF5733'] },
            xaxis: { categories: [], tickAmount: 10 },
            grid : {
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

    useEffect(() => {
        dispatch(setExpense(chartData))
        const getXAxis = () => (chartData[year] ? Object.keys(chartData[year]) : []);
        const getvalues = () => (chartData[year] ? Object.values(chartData[year]) : []);
        const values = getvalues();
        let xAxis = getXAxis();
        
        if(Object.keys(testData.sample).length > 0){
            values.pop()
            values.push(parseFloat(Object.values(testData.sample)[0]))
        }


        let forecastXAxis;
        let forecastValues;
        let UpperBounds;
        let LowerBounds;
        if(Object.keys(testData.sampleoutcome).length === 0){
            //default
            const forecastedData = JSON.parse(sessionStorage.getItem('forecasted')) || {};
            forecastXAxis = forecastedData.monthly && year == '2024' ? Object.keys(forecastedData.monthly).map(date => date.slice(0, 7)) : [];
            forecastValues = forecastedData.monthly && year == '2024' ? Object.values(forecastedData.monthly).map(data => data.forecast) : [];
            UpperBounds = forecastedData.monthly && year == '2024' ? Object.values(forecastedData.monthly).map(data => data.upper) : [];
            LowerBounds = forecastedData.monthly && year == '2024' ? Object.values(forecastedData.monthly).map(data => data.lower < 0 ? 0 : data.lower) : [];
        }else{
            //test
            forecastXAxis = testData.sampleoutcome && year == '2024' ? Object.keys(testData.sampleoutcome).map(date => date.slice(0,7)) : [];
            forecastValues = testData.sampleoutcome && year == '2024' ? Object.values(testData.sampleoutcome).map(data => data.forecast) : [];
            UpperBounds = testData.sampleoutcome && year == '2024' ? Object.values(testData.sampleoutcome).map(data => data.upper) : [];
            LowerBounds = testData.sampleoutcome && year == '2024' ? Object.values(testData.sampleoutcome).map(data => data.lower < 0 ? 0 : data.lower) : [];
        }


        const combinedXAxis = Array.from(new Set([...xAxis, ...forecastXAxis])).sort();

        const actualData = combinedXAxis.map(date => {
            const index = xAxis.indexOf(date);
            return index !== -1 ? values[index] : null;
        });

        const forecastData = combinedXAxis.map(date => {
            const index = forecastXAxis.indexOf(date);
            return index !== -1 ? forecastValues[index] : null;
        });

        const upperBoundData = combinedXAxis.map(date => {
            const index = forecastXAxis.indexOf(date);
            return index !== -1 ? UpperBounds[index] : null;
        });
    
        const lowerBoundData = combinedXAxis.map(date => {
            const index = forecastXAxis.indexOf(date);
            return index !== -1 ? LowerBounds[index] : null;
        });

        // Filter data by date range
        const filteredXAxis = combinedXAxis.filter(date => 
            (!startDate || date >= startDate) && (!endDate || date <= endDate)
        );
        const filteredActualData = actualData.slice(combinedXAxis.indexOf(filteredXAxis[0]), combinedXAxis.indexOf(filteredXAxis[filteredXAxis.length - 1]) + 1);
        const filteredForecastData = forecastData.slice(combinedXAxis.indexOf(filteredXAxis[0]), combinedXAxis.indexOf(filteredXAxis[filteredXAxis.length - 1]) + 1);
        const filteredUpperBoundData = upperBoundData.slice(combinedXAxis.indexOf(filteredXAxis[0]), combinedXAxis.indexOf(filteredXAxis[filteredXAxis.length - 1]) + 1);
        const filteredLowerBoundData = lowerBoundData.slice(combinedXAxis.indexOf(filteredXAxis[0]), combinedXAxis.indexOf(filteredXAxis[filteredXAxis.length - 1]) + 1);

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
                fill : {
                    type: 'gradient',
                    gradient: {
                        shade: 'light',
                        type: 'vertical'
                        
                    }
                },
                stroke: { curve: 'smooth', width: [2, 2, 0] } 
            }
        }));
    }, [chartData, year, startDate, endDate, testData]);

    

  return (
    <div className="w-full h-full">
        <div className="h-[10%] flex items-center justify-between pl-5">
            <div className={`font-bold ${user?.role === '4' ? 'text-customgreen' : 'text-BOGreen'}`}>
                <p>Expense Trends and Forecast</p>
            </div>
            <div className='flex items-center justify-center gap-2'>
                {year === 'Custom' && (
                    <div className='flex gap-2'>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            placeholder="Start Date"
                            className={`text-xs py-2 rounded-lg border-2 px-2 ${user?.role === '1' ? 'focus:outline-customgreen' : 'focus:outline-BOGreen'}`}
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            placeholder="End Date"
                            className={`text-xs py-2 rounded-lg border-2 px-2 ${user?.role === '1' ? 'focus:outline-customgreen' : 'focus:outline-BOGreen'}`}
                        />
                    </div>
                )}
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
  )
}

LineGraph.propTypes = {
    chartData: PropTypes.object.isRequired,
    customYear: PropTypes.string.isRequired,
};

export default LineGraph;