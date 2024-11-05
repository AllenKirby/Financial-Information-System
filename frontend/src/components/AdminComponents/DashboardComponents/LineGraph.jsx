import ReactApexChart from 'react-apexcharts';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'

const LineGraph = ({chartData}) => {
    const [year, setYear] = useState('2024');

    const getYear = () => {
        const keys = chartData ? Object.keys(chartData) : [];
        return keys.sort((a, b) => b.localeCompare(a));
    };

    const [lineOptions, setLineOptions] = useState({
        series: [{ name: 'Sales', data: [] }],
        options: {
            chart: {
                height: 350,
                type: 'line',
                toolbar: {
                    show: true,
                    tools: { zoom: false, selection: false, pan: false, reset: false }
                }
            },
            stroke: { width: 5, curve: 'smooth' },
            xaxis: { categories: [], tickAmount: 10 },
            title: { text: 'Time-Based Expense Overview', align: 'center', style: { fontSize: "16px", color: '#666' } },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    gradientToColors: ['#FDD835'],
                    shadeIntensity: 1,
                    type: 'horizontal',
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 100, 100, 100]
                }
            }
        }
    });

    useEffect(() => {
        const getXAxis = () => (chartData[year] ? Object.keys(chartData[year]) : []);
        const getvalues = () => (chartData[year] ? Object.values(chartData[year]) : []);
        const values = getvalues();
        const xAxis = getXAxis();

        setLineOptions((prevOptions) => ({
            ...prevOptions,
            series: [{ ...prevOptions.series[0], data: values }],
            options: { ...prevOptions.options, xaxis: { ...prevOptions.options.xaxis, categories: xAxis } }
        }));
    }, [chartData, year]);

  return (
    <div className="w-auto h-full my-10">
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