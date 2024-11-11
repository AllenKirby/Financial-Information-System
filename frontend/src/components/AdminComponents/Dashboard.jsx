import NumOfRecords from "./DashboardComponents/NumOfRecords"
import ChartData from "./DashboardComponents/ChartData"

const Dashboard = () => {
  return (
    <section className="w-full h-full">
      <div className="w-full h-1/4">
        <div className="w-full h-full">
          <div className="w-full h-full rounded-lg">
            <div className="w-full h-2/6 flex items-center justify-start px-3">
              <div className="border-l-2 border-customFontColor px-2">
                <h1 className="font-bold text-customgreen">Total Number of Records</h1>
                <p className="text-sm">The overview shows total disbursement vouchers by fund cluster.</p>
              </div>
            </div>
            <div className="w-full h-4/6 py-2">
              <NumOfRecords/>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[60vh] bg-blue-700 border-2">
          <div className="w-2/3"></div>
          <div className="w-1/3"></div>
        </div>
    </section>
  )
}

export default Dashboard