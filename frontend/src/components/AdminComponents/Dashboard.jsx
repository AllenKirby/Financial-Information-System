import NumOfRecords from "./DashboardComponents/NumOfRecords"
import ChartData from "./DashboardComponents/ChartData"

const Dashboard = () => {
  return (
    <div className="w-full h-screen bg-white rounded-t-lg rounded-b-lg">
      <div className="w-full h-96 flex"> 
        <div className="w-2/3">
          <ChartData/>
        </div>
        <div className="w-1/3 flex items-center justify-center">
          <NumOfRecords/>
        </div>
      </div>
    </div>
  )
}

export default Dashboard