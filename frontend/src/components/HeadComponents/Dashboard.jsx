import ReactApexChart from 'react-apexcharts';

import { useState, useEffect } from 'react';
import { useHeadDisbursementContext } from '../../hooks/useHeadDisbursementContext';

const Dashboard = () => {
  const [underReview, setUnderReview] = useState(0)
  const [total, setTotal] = useState(0)
  const { HeadDocuments } = useHeadDisbursementContext()

  useEffect(() => {
    const countUnderReview = () => {
      return Object.entries(HeadDocuments).filter(([, document]) => 
        document.data.status === 'Under Review'
      )
    }
    if (HeadDocuments && Object.keys(HeadDocuments).length > 0) {
      const resultUnderReview = countUnderReview()
      setUnderReview(Object.entries(resultUnderReview).length)
      setTotal(Object.entries(HeadDocuments).length)
    }
  }, [HeadDocuments])

  const [lineOptions, ] = useState({
    series: [{
      name: "Desktops",
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
    }],
    options: {
      chart: {
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Product Trends by Month',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      }
    }
  });

  const [pieOptions] = useState({
    series: [44, 55, 13, 43, 22],
    options: {
      chart: {
        type: 'pie',
      },
      labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom'
          }
        }
      }]
    },
  });
  
  const [barOptions,] = useState({
    series: [{
      data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
    }],
    options: {
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: 'end',
          horizontal: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
          'United States', 'China', 'Germany'
        ],
      }
    },
  })

  return (
    <section className="w-full h-full flex p-2 gap-2">
      <div className="w-4/5 h-full flex flex-col gap-2">
        <div className="w-full h-1/2 bg-white p-2 rounded-lg shadow-gray-300 shadow-lg">
          <ReactApexChart 
            options={lineOptions.options} 
            series={lineOptions.series} 
            type="line"
            height={'100%'}
            width={'100%'}  />
        </div>
        <div className="w-full h-1/2 flex gap-2">
          <div className="w-2/3 h-full bg-white rounded-lg p-2 shadow-gray-300 shadow-lg">
            <ReactApexChart 
              options={barOptions.options} 
              series={barOptions.series} 
              type="bar"
              height={'100%'}
              width={'100%'}  />
          </div>
          <div className="w-1/3 h-full bg-white rounded-lg flex items-center justify-center shadow-gray-300 shadow-lg">
            <div className='w-auto h-auto flex flex-col'>
              <h1 className='text-center font-bold'>Percentage Distribution of Disbursment Voucher by Fund Cluster</h1>
              <ReactApexChart 
                options={pieOptions.options} 
                series={pieOptions.series}
                type="pie" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/5 h-full flex flex-col gap-2">
        <div className="w-full h-1/3 bg-gray-200 flex items-center justify-center rounded-lg shadow-gray-300 shadow-lg">
          <div className="text-center p-2">
            <h1 className='text-7xl font-semibold'>3</h1>
            <p className='text-xs '>Number of Disbursement Vouchers with Drafting Status</p>
          </div>
        </div>
        <div className="w-full h-1/3 bg-orange-500 text-white flex items-center justify-center rounded-lg shadow-gray-300 shadow-lg">
          <div className="text-center p-2">
            <h1 className='text-7xl font-semibold'>{underReview}</h1>
            <p className='text-xs '>Number of Disbursement Vouchers with Under Review Status</p>
          </div>
        </div>
        <div className="w-full h-1/3 bg-customFontColor text-white flex items-center justify-center rounded-lg shadow-gray-300 shadow-lg">
          <div className="text-center p-2">
            <h1 className='text-7xl font-semibold'>{total}</h1>
            <p className='text-xs'>Total Number of Disbursement Vouchers</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Dashboard