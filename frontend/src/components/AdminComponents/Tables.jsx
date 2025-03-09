import ChartData from "./DashboardComponents/ChartData"
import Summary from './DashboardComponents/Summary'
import BudgetRecommendation from "./DashboardComponents/BudgetRecommendation" 
import { useState } from "react"

const Tables = () => {
    const currentYear = new Date().getFullYear()
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");

    const [whatIf_value, setWhatIf_value] = useState([
      { monthYear: `${currentYear}-${currentMonth}`, amount: 0 }
  ]);
    const year = new Date().getFullYear()
    return (
        <div className="w-full flex-1 gap-3 py-3">
          <div className="w-full h-96 border-2 rounded-lg p-2">
            <ChartData customYear={year} value={whatIf_value}/>
          </div>
          <div className="w-full h-auto flex flex-col md:flex-row items-start justify-center gap-2 my-2">
            <div className="w-full md:w-1/2 h-full">
              <Summary/>
            </div>
            <div className="w-full md:w-1/2 h-full">
              <BudgetRecommendation onNewValue={setWhatIf_value}/>
            </div>
          </div>
        </div>
    )
}

export default Tables;