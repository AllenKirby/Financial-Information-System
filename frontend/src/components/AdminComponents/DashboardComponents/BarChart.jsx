import ReactApexChart from 'react-apexcharts';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const BarChart = ({ BarChartData }) => {
    const [year, setYear] = useState('2024');

    const [barChart, setBarChart] = useState({
        series: [
            { name: 'CARP', data: [] },
            { name: 'Contract Farming', data: [] },
            { name: 'COB', data: [] },
            { name: 'LFP', data: [] },
        ],
        options: {
            chart: {
                type: 'bar',
                height: 350,
                stacked: true,
                stackType: '100%',
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0,
                        },
                    },
                },
            ],
            xaxis: {
                categories: [],
            },
            fill: {
                opacity: 1,
            },
            legend: {
                position: 'right',
                offsetX: 0,
                offsetY: 50,
            },
        },
    });

    const getYear = () => {
        const keys = BarChartData ? Object.keys(BarChartData) : [];
        return keys.sort((a, b) => b.localeCompare(a));
    };

    useEffect(() => {
        const getCARP = () => (BarChartData[year] ? Object.values(BarChartData[year]).map((monthData) => monthData.CARP) : []);
        const getCF = () => (BarChartData[year] ? Object.values(BarChartData[year]).map((monthData) => monthData.CF) : []);
        const getCOB = () => (BarChartData[year] ? Object.values(BarChartData[year]).map((monthData) => monthData.COB) : []);
        const getLFP = () => (BarChartData[year] ? Object.values(BarChartData[year]).map((monthData) => monthData.LFP) : []);
        const getXAxis = () => (BarChartData[year] ? Object.keys(BarChartData[year]) : []);

        // Fetch the series data and categories
        const XAxisValues = getXAxis();

        setBarChart((prevOptions) => ({
            ...prevOptions,
            series: [
                { ...prevOptions.series[0], data: getCARP() },
                { ...prevOptions.series[1], data: getCF() },
                { ...prevOptions.series[2], data: getCOB() },
                { ...prevOptions.series[3], data: getLFP() },
            ],
            options: {
                ...prevOptions.options,
                xaxis: {
                    ...prevOptions.options.xaxis,
                    categories: XAxisValues,
                },
            },
        }));
    }, [BarChartData, year]);

    return (
        <div className="w-auto h-1/2 mt-10">
            <div className="flex items-center justify-end">
                <select value={year} onChange={(e) => setYear(e.target.value)}>
                    {getYear().map((yearOption, index) => (
                        <option key={index} value={yearOption}>
                            {yearOption}
                        </option>
                    ))}
                </select>
            </div>
            <ReactApexChart
                options={barChart.options}
                series={barChart.series}
                type="bar"
                height={'100%'}
                width={'100%'}
            />
        </div>
    );
};

BarChart.propTypes = {
    BarChartData: PropTypes.object.isRequired,
};

export default BarChart;
