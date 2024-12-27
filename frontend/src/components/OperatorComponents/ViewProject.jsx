import { IoMdClose } from "react-icons/io";
import { MdWorkOutline } from "react-icons/md";

import { useAuthContext } from "../../hooks/useAuthContext";

import PropTypes from 'prop-types'

const ViewProject = (props) => {
    const { modal, projectData } = props 
    const { user } = useAuthContext()

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
          <div className="w-full h-auto px-5 py-3 text-xs lg:text-sm 2xl:text-base">
            <p className="font-bold mt-1">Field Office: <span className="font-normal">{projectData.fieldOffice}</span></p>
            <p className="font-bold mt-1">ASA: <span className="font-normal">{formatToPeso(projectData.ASA)}</span></p>
            <p className="font-bold mt-1">Remaining ASA Balance: <span className="font-normal">{formatToPeso(projectData.RO)}</span></p>
            <p className="font-bold mt-1">Total Spending: <span className="font-normal">{formatToPeso(projectData.FO)}</span></p>
          </div>
          <div className='overflow-x-auto p-3'>
            <table className="min-w-[1500px] border-2 text-xs lg:text-sm 2xl:text-base">
              <thead className="bg-gray-200 border-b-2">
                <tr>
                  <th className="font-semibold text-center w-[10%]">Date</th>
                  <th className="font-semibold text-center w-[10%]">DV No.</th>
                  <th className="font-semibold text-center w-[10%]">BUR No.</th>
                  <th className="font-semibold text-left w-[20%]">Payee</th>
                  <th className="font-semibold text-left w-[30%]">Particulars</th>
                  <th className="font-semibold text-center w-[10%]">ASA</th>
                </tr>
              </thead>
              <tbody>
                {sortDate() && Object.entries(sortDate()).length > 0 ? (
                  Object.entries(sortDate()).map(([key, DV]) => (
                    <tr key={key} className="border-b-2 p-2">
                      <td className="text-center">{DV.date}</td>
                      <td className="text-center">{DV.DVNoCount}</td>
                      <td className="text-center">{DV.orsData}</td>
                      <td className="text-left break-words">{DV.payee}</td>
                      <td className="text-left break-words">{DV.particulars}</td>
                      <td className="text-center">{DV.amount}</td>
                    </tr>
                  ))
                ) : (
                  <td className="text-center font-semibold p-4" colSpan={6}>No Disbursement Voucher Found</td>
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