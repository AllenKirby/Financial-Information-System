import ReactApexChart from 'react-apexcharts';

import { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom'
import { useOpDisbursementContext } from '../../hooks/useOpDisbursementContext';
//import PieChart from '../Charts/PieChart';

const Dashboard = () => {
  const [inReview, setInReview] = useState(0)
  const [returned, setReturned] = useState(0)
  const [total, setTotal] = useState(0)
  const {OpDocuments} = useOpDisbursementContext()
  const navigate = useNavigate()

  console.log(OpDocuments)

  useEffect(() => {
    const countInReview = () => {
      return Object.entries(OpDocuments?.documents || {}).filter(([, document]) => 
        document?.data?.status === 'In Review'
      )
    }
    const countReturned = () => {
      return Object.entries(OpDocuments?.documents || {}).filter(([, document]) => 
        document?.data?.status === 'Returned|3'
      )
    }
    if (OpDocuments && Object.keys(OpDocuments).length > 0) {
      const resultInReview = countInReview()
      const resultReturned = countReturned()
      setInReview(Object.entries(resultInReview).length)
      setReturned(Object.entries(resultReturned).length)
      setTotal(Object.entries(OpDocuments.documents).length)
    }
  }, [OpDocuments])

  const [lineOptions, ] = useState({
    series: [
      {
        name: "In Review",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      },
      {
        name: "Returned",
        data: [20, 35, 50, 65, 60, 80, 90, 110, 140],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      colors: ["#008FFB", "#FF4560"], // Blue for first line, Red for second line
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // Alternating grid row colors
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
      },
      legend: {
        show: true, // Display legend to differentiate lines
        position: "bottom",
      },
    },
  });

  return (
    <section className="w-full h-full flex p-2 gap-2">
      <div className="w-4/5 h-full flex flex-col gap-2">
        <div className="w-full h-3/5 bg-white p-2 rounded-lg border-2">
          <h1 className='font-bold text-fundingBlueGreen h-[10%] px-4 flex items-center'>Monthly Trends in Disbursement Voucher Activity</h1>
          <div className='w-full h-[90%]'>
            <ReactApexChart 
              options={lineOptions.options} 
              series={lineOptions.series} 
              type="line"
              height={'100%'}
              width={'100%'}  />
          </div>
        </div>
        <div className="w-full h-2/5 flex gap-2">
          <div className="w-1/2 h-full bg-white rounded-lg p-2 border-2">
            
          </div>
          <div className="w-1/2 h-full bg-white rounded-lg flex items-center justify-center border-2">
            {/* <div className='w-auto h-auto flex flex-col'>
              <h1 className='text-center text-xs font-bold h-[10%]'>Fund Cluster Distribution of DVs</h1>
              <PieChart/>
            </div> */}
          </div>
        </div>
      </div>
      <div className="w-1/5 h-full flex flex-col gap-2">
        <div onClick={() => navigate('/operator/disbursementrecords')} className="w-full h-1/3 bg-blue-500 text-white flex items-center justify-center rounded-lg">
          <div className="text-center p-2">
            <h1 className='text-7xl font-semibold'>{inReview}</h1>
            <p className='text-xs '>Number of Disbursement Vouchers with In Review Status</p>
          </div>
        </div>
        <div onClick={() => navigate('/operator/disbursementrecords')} className="w-full h-1/3 bg-red-500 text-white flex items-center justify-center rounded-lg">
          <div className="text-center p-2">
            <h1 className='text-7xl font-semibold'>{returned}</h1>
            <p className='text-xs '>Number of Disbursement Vouchers with Returned Status</p>
          </div>
        </div>
        <div onClick={() => navigate('/operator/disbursementrecords')} className="w-full h-1/3 bg-customFontColor text-white flex items-center justify-center rounded-lg">
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