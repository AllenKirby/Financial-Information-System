import NumOfRecords from "./DashboardComponents/NumOfRecords"
import ChartData from "./DashboardComponents/ChartData"
import Summary from './DashboardComponents/Summary'
import BudgetRecommendation from "./DashboardComponents/BudgetRecommendation" 
import FundClusterModal from "./DashboardComponents/FundClusterModal"
import ComparisonView from "./ComparisonView"

import { useAuthContext } from "../../hooks/useAuthContext"
import { useState } from "react"
import { useSelector } from "react-redux"

import ApexCharts from 'apexcharts';

const Dashboard = () => {
  const { user } = useAuthContext()
  const [fundCluster, setFundCluster] = useState('')
  const [comparison, setComparison] =  useState(false)
  const vouchers = useSelector((state) => state.vouchers)
  console.log(vouchers)

  const modal = (FC) => {
    setFundCluster(FC)
  }

  const comparisonModal = () => {
    setComparison(!comparison)
  }

  const handleDownload = async() => {
    try {
        // Generate chart dataURI programmatically
        const result = await ApexCharts.exec('chartID', 'dataURI');
        if (result && result.imgURI) {
          const link = document.createElement('a');
          link.href = result.imgURI;
          link.download = 'chart.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          console.error('Error: No image data returned from ApexCharts.exec');
        }
    } catch (error) {
        console.error('Error while exporting chart:', error);
    }
}

  return (
    <section className="w-full h-full flex flex-col p-3">
      <div className="w-full flex-1 overflow-y-auto">
        <div className="w-full h-auto">
          <div className="w-full h-full">
            <div className="w-full h-auto flex items-center justify-start">
              <div className="px-2">
                <p className={`text-xs sm:text-sm font-semibold ${user?.role === '1' ? 'text-customgreen' : 'text-BOGreen'}`}>The overview shows total number of Disbursement Vouchers by Fund Cluster.</p>
              </div>
            </div>
            <div className="w-full h-auto flex items-center justify-center gap-2 py-2">
              <NumOfRecords modal={modal} downloadPNG={handleDownload} comparison={comparisonModal} />
            </div>
          </div>
        </div>
        <div className="w-full flex-1 gap-3 py-3">
          <div className="w-full h-96 border-2 rounded-lg p-2">
            <ChartData customYear={'2024'}/>
          </div>
          <div className="w-full h-auto flex flex-col md:flex-row items-start justify-center gap-2 my-2">
            <div className="w-full md:w-1/2 h-full">
              <Summary/>
            </div>
            <div className="w-full md:w-1/2 h-full">
              <BudgetRecommendation/>
            </div>
          </div>
        </div>
      </div>
      {fundCluster && (
        <>
          <div className="fixed inset-0 z-20 bg-black opacity-50" />
          <div className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
            <FundClusterModal modal={modal} fundCluster={fundCluster} vouchers={vouchers}/>
          </div>
        </>
      )}
      {comparison && (
        <>
          <div className="fixed inset-0 z-20 bg-black opacity-50" />
          <div className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
            <ComparisonView modal={comparisonModal}/>
          </div>
        </>
      )}
    </section>
  )
}

export default Dashboard