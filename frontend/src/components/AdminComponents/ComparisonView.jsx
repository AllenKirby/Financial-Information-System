import ChartData from "./DashboardComponents/ChartData"

import PropTypes from "prop-types"

import { IoIosClose } from "react-icons/io";
import { useAuthContext } from "../../hooks/useAuthContext";

const ComparisonView = ({modal}) => {
    const { user }  = useAuthContext()

  return (
    <section className="w-2/3 h-2/3 rounded-lg flex flex-col bg-white p-3 text-gray-500">
        <div className="w-full h-auto flex items-center justify-between">
            <h1 className={`${user?.role ? 'text-customgreen' : 'text-BOGreen'} font-bold text-lg`}>Comparison View</h1>
            <button className="p-1" onClick={modal}>
                <IoIosClose size={30}/>
            </button>
        </div>
        <div className="w-full flex-1 gap-3 py-2 overflow-y-auto">
            <div className="border-2 h-full rounded-lg p-2 mb-2">
                <ChartData customYear={'2024'} />
            </div>
            <div className="border-2 h-full rounded-lg p-2">
                <ChartData customYear={'2023'} />
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

ComparisonView.propTypes = {
    modal: PropTypes.func.isRequired,
}

export default ComparisonView