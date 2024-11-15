import ReactApexChart from 'react-apexcharts';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const LineGraph = ({ chartData }) => {

    const [year, setYear] = useState('2024');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const testData = useSelector((state) => state.testforecast)

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
                toolbar: {
                    show: true,
                    tools: { zoom: false, selection: false, pan: false, reset: false }
                }
            },
            stroke: { width: [3, 3], curve: 'smooth', colors: ['#546E7A', '#FF5733'] },
            xaxis: { categories: [], tickAmount: 10 },
            title: { text: 'Time-Based Expense Overview', align: 'center', style: { fontSize: "16px", color: '#666' } },
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
        console.log(testData)
        const getXAxis = () => (chartData[year] ? Object.keys(chartData[year]) : []);
        const getvalues = () => (chartData[year] ? Object.values(chartData[year]) : []);
        const values = getvalues();
        let xAxis = getXAxis();
        
        // if(testData.sample > 0){
        //     xAxis = xAxis.push(testData.sample)
        // }


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
            LowerBounds = forecastedData.monthly && year == '2024' ? Object.values(forecastedData.monthly).map(data => data.lower) : [];
        }else{
            //test
            forecastXAxis = testData.sampleoutcome && year == '2024' ? Object.keys(testData.sampleoutcome).map(date => date.slice(0,7)) : [];
            forecastValues = testData.sampleoutcome && year == '2024' ? Object.values(testData.sampleoutcome).map(data => data.forecast) : [];
            UpperBounds = testData.sampleoutcome && year == '2024' ? Object.values(testData.sampleoutcome).map(data => data.upper) : [];
            LowerBounds = testData.sampleoutcome && year == '2024' ? Object.values(testData.sampleoutcome).map(data => data.lower) : [];
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
        <div className="flex items-center justify-end">
            <select value={year} onChange={(e) => setYear(e.target.value)}>
                {getYear().map((year, index) => (
                    <option key={index} value={year}>{year}</option>
                ))}
            </select>
            <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start Date"
                className="ml-2"
            />
            <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End Date"
                className="ml-2"
            />
        </div>
        <ReactApexChart
            options={lineOptions.options}
            series={lineOptions.series}
            type="line"
            height={'100%'}
            width={'100%'}
        />
    </div>
  )
}

LineGraph.propTypes = {
    chartData: PropTypes.object.isRequired,
};

export default LineGraph;