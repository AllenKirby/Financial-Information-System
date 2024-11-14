import ReactApexChart from 'react-apexcharts';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'

const LineGraph = ({chartData}) => {
    const [year, setYear] = useState('2024');

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
        const getXAxis = () => (chartData[year] ? Object.keys(chartData[year]) : []);
        const getvalues = () => (chartData[year] ? Object.values(chartData[year]) : []);
        const values = getvalues();
        const xAxis = getXAxis();
        const forecastedData = JSON.parse(sessionStorage.getItem('forecasted')) || {};
        const forecastXAxis = forecastedData.monthly ? Object.keys(forecastedData.monthly).map(date => date.slice(0, 7)) : [];
        const forecastValues = forecastedData.monthly ? Object.values(forecastedData.monthly).map(data => data.forecast) : [];

        const combinedXAxis = Array.from(new Set([...xAxis, ...forecastXAxis]));
        console.log(combinedXAxis)

        const actualData = combinedXAxis.map(date => {
            const index = xAxis.indexOf(date);
            return index !== -1 ? values[index] : null;
        });

        const forecastData = combinedXAxis.map(date => {
            const index = forecastXAxis.indexOf(date);
            return index !== -1 ? forecastValues[index] : null;
        });

        setLineOptions((prevOptions) => ({
            ...prevOptions,
            series: [
                { ...prevOptions.series[0], data: actualData },
                { ...prevOptions.series[1], data: forecastData}    
            ],
            options: { 
                ...prevOptions.options, 
                xaxis: { ...prevOptions.options.xaxis, categories: combinedXAxis }
            }
        }));
    }, [chartData, year]);

  return (
    <div className="w-full h-full">
        <div className="flex items-center justify-end">
            <select value={year} onChange={(e) => setYear(e.target.value)}>
                {getYear().map((year, index) => (
                    <option key={index} value={year}>{year}</option>
                ))}
            </select>
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

export default LineGraph