import { IoMdClose } from "react-icons/io";
import { MdWorkOutline } from "react-icons/md";

import { useAuthContext } from "../../hooks/useAuthContext";

import PropTypes from 'prop-types'

const ViewProject = (props) => {
    const { modal, projectData } = props 
    const { user } = useAuthContext()

    console.log(projectData)

    const formatToPeso = (value) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(value);
      };
    
      const sortDate = () => {
        if(projectData && projectData.dvCollection) {
          const sortedProjects = Object.entries(projectData.dvCollection).sort(([,a],[,b]) => new Date(b.date) - new Date(a.date));
          return Object.fromEntries(sortedProjects)
        }
        return null
      }

  return (
    <section onClick={(e) => e.stopPropagation()} className="w-3/4 h-3/4 bg-white rounded-lg z-50">
        <div className="w-full h-auto py-3 px-4 flex items-center justify-between border-b-2">
            <div className={`${user?.role === '3' ? 'text-fundingBlueGreen' : 'text-preparerPrimary'} flex items-center justify-center gap-2 font-bold`}>
                <MdWorkOutline size={25}/>
                <p className="text-xl">{projectData.projectName}</p>
            </div>
            <button onClick={modal}>
                <IoMdClose size={20}/>
            </button>
        </div>
        <div className="w-full rounded-lg overflow-x-auto">
          <div className='overflow-x-auto p-3'>
            <table className="min-w-[1500px] text-xs lg:text-sm 2xl:text-base">
              <thead className="bg-gray-100 rounded-lg">
                <tr>
                  <th className="font-semibold text-center w-[10%]" colSpan={2}>BUR</th>
                  <th className="font-semibold text-center w-[10%]" colSpan={2}>DV</th>
                  <th className="font-semibold text-center w-[10%]" rowSpan={2}>Payee</th>
                  <th className="font-semibold text-center w-[20%]" rowSpan={2}>Particulars</th>
                  <th className="font-semibold text-center w-[30%]" rowSpan={2}>ASA</th>
                  <th className="font-semibold text-center w-[10%]" rowSpan={2}>Cash</th>
                </tr>
                <tr>
                  <th className="font-semibold">Date</th>
                  <th className="font-semibold">No.</th>
                  <th className="font-semibold">Date</th>
                  <th className="font-semibold">No.</th>
                </tr>
              </thead>
              <tbody>
                {sortDate() && Object.entries(sortDate()).length > 0 ? (
                  Object.entries(sortDate()).map(([key, DV], index) => (
                    <tr key={key} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                      <td className="text-center">{DV.date}</td>
                      <td className="text-center">{DV.DVNoCount}</td>
                      <td className="text-center">{DV.orsData}</td>
                      <td className="text-left break-words">{DV.payee}</td>
                      <td className="text-left break-words">{DV.particulars}</td>
                      <td className="text-center">{DV.amount}</td>
                    </tr>
                  ))
                ) : (
                  <td className="text-center font-semibold p-4" colSpan={12}>No Disbursement Voucher Found</td>
                )}
              </tbody>
            </table>
          </div>
        </div>
    </section>
  )
}

ViewProject.propTypes = {
    modal: PropTypes.func.isRequired,
    projectData: PropTypes.object.isRequired
}

export default ViewProject