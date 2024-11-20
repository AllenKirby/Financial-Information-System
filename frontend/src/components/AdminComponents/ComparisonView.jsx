import NumOfRecords from "./DashboardComponents/NumOfRecords"
import ChartData from "./DashboardComponents/ChartData"
import Summary from "./ComparisonViewComponent/Summary"
import BudgetRecommendation from "./DashboardComponents/BudgetRecommendation"

const Dashboard = () => {
  return (

    <section className="w-full h-full p-2">
        <div className="w-full h-full flex gap-3 py-3 overflow-y-auto">
            <div className="flex flex-col w-2/3 h-[700px] gap-3">
                <div className="border-2 h-full rounded-lg p-2">
                    <ChartData customYear={'2024'} />
                </div>
                <div className="border-2 h-full rounded-lg p-2">
                    <ChartData customYear={'2023'} />
                </div>
            </div>
            <div className="w-1/3">
                <div className="border-1 rounded-lg flex flex-col gap-3">
                    <Summary />
                    <BudgetRecommendation/>
                </div>
            </div>
        </div>
    </section>

    // <section className="w-full h-full">
    //   <div className="w-full h-full flex gap-3 py-3 overflow-y-auto">
    //       <div className="flex flex-col">
    //         <div className="w-2/3 border-2 rounded-lg p-2">
    //             <ChartData customYear={'2024'}/>
    //         </div>
    //         <div className="w-2/3 border-2 rounded-lg p-2">
    //             <ChartData customYear={'2023'}/>
    //         </div>
    //       </div>
    //       <div className="w-1/3">
    //         <BudgetRecommendation/>
    //       </div>
    //     </div>
    // </section>
  )
}

export default Dashboard