import NumOfRecords from "./DashboardComponents/NumOfRecords"
import ChartData from "./DashboardComponents/ChartData"
import BudgetRecommendation from "./DashboardComponents/BudgetRecommendation"
import { useAuthContext } from "../../hooks/useAuthContext"

const Dashboard = () => {
  const { user } = useAuthContext()

  return (
    <section className="w-full h-full">
      <div className="w-full h-1/4">
        <div className="w-full h-full">
          <div className="w-full h-full rounded-lg">
            <div className="w-full h-2/6 flex items-center justify-start px-3">
              <div className="border-l-2 border-customFontColor px-2">
                <h1 className={`${user?.role === '1' ? 'text-customgreen' : 'text-BOGreen' } font-bold`}>Total Number of Records</h1>
                <p className="text-sm">The overview shows total disbursement vouchers by fund cluster.</p>
              </div>
            </div>
            <div className="w-full h-4/6 py-2">
              <NumOfRecords/>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-3/4 flex gap-3 py-3">
          <div className="w-2/3 border-2 rounded-lg p-2">
            <ChartData customYear={'2024'}/>
          </div>
          <div className="w-1/3">
            <BudgetRecommendation/>
          </div>
        </div>
    </section>
  )
}

export default Dashboard