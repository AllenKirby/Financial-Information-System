import PropTypes from 'prop-types'
import ReportRows from './ReportRows';

import { IoMdArrowRoundBack } from "react-icons/io";
import { FiDownload } from "react-icons/fi";
import { useEffect } from 'react';

const ControlBookReport = (props) => {
    const { showReport, reportData, fieldoffices = {} } = props

    useEffect(() => {
        console.log(fieldoffices)
    }, [])
    
    
  return (
    <div className='w-full h-full'>
        <div className='w-full h-[8%] flex items-center justify-between'>
            <button 
                onClick={showReport}
                className="px-5 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-100"
                ><IoMdArrowRoundBack size={25}/></button>
            <div>
                <p className="font-bold text-base sm:text-lg lg:text-2xl text-fundingBlueGreen">Control Book Report</p>
            </div>
            <div className='flex items-center justify-center gap-3'>
                <button 
                  className="bg-fundingBlueGreen text-white px-5 py-2 rounded-lg flex items-center justify-center gap-2"
                  ><FiDownload/><span className='hidden sm:block'>Download</span></button>
            </div>
        </div>
        <div className='w-full h-[92%] p-3'>
            <div className='w-[1105px] h-full overflow-x-auto'>
                <select>
                    <option value="January">January</option>
                </select>
                <table className='border-2 w-full border-black'>
                    <thead className='border-2 border-black text-xs'>
                        <tr className='border-2 border-black'>
                            <th rowSpan={2} colSpan={2} className='px-32 border-2 border-black'>Name of Projects/Activities/Programs</th>
                            <th rowSpan={2} className='px-16 border-2 border-black'>ASA</th>
                            <th colSpan={3} className='px-32 border-2 border-black'>Previous Obligations</th>
                            <th colSpan={3} className='px-32 border-2 border-black'>This Month Obligations</th>
                            <th colSpan={2} className='px-20 border-2 border-black'>Obligations</th>
                            <th rowSpan={2} className='px-14 border-2 border-black'>Total Obligation</th>
                            <th rowSpan={2} className='px-14 border-2 border-black'>UnObligated</th>
                            <th rowSpan={2} className='px-14 border-2 border-black'>Previous ADA</th>
                            <th className='px-20 border-2 border-black'></th>
                            <th className='px-16 border-2 border-black'>ASA</th>
                            <th className='px-16 border-2 border-black'>Unfunded</th>
                            <th colSpan={2} className='px-20 border-2 border-black'>Previous Disbursement</th>
                            <th colSpan={5} className='px-60 border-2 border-black'>Weekly Disbursement FO (IMO)</th>
                            <th className='px-16 border-2 border-black'>This Month Disb.</th>
                            <th colSpan={5} className='px-60 border-2 border-black'>Weekly Disbursement RO</th>
                            <th className='px-16 border-2 border-black'>This Month Disb.</th>
                            <th colSpan={2} className='px-20 border-2 border-black'>Total Disbursement</th>
                        </tr>
                        <tr>
                            <th className='border-2 border-black'>RO</th>
                            <th className='border-2 border-black'>FO</th>
                            <th className='border-2 border-black'>Total</th>
                            <th className='border-2 border-black'>RO</th>
                            <th className='border-2 border-black'>FO</th>
                            <th className='border-2 border-black'>This Month</th>
                            <th className='border-2 border-black'>RO</th>
                            <th className='border-2 border-black'>FO</th>
                            <th className='border-2 border-black'>Adjustment Negative Balances</th>
                            <th className='border-2 border-black'></th>
                            <th className='border-2 border-black'></th>
                            <th className='border-2 border-black'>RO</th>
                            <th className='border-2 border-black'>FO</th>
                            <th className='border-2 border-black'>Week 1</th>
                            <th className='border-2 border-black'>Week 2</th>
                            <th className='border-2 border-black'>Week 3</th>
                            <th className='border-2 border-black'>Week 4</th>
                            <th className='border-2 border-black'>Week 5</th>
                            <th className='border-2 border-black'>FO</th>
                            <th className='border-2 border-black'>Week 1</th>
                            <th className='border-2 border-black'>Week 2</th>
                            <th className='border-2 border-black'>Week 3</th>
                            <th className='border-2 border-black'>Week 4</th>
                            <th className='border-2 border-black'>Week 5</th>
                            <th className='border-2 border-black'>RO</th>
                            <th className='border-2 border-black'>FO</th>
                            <th className='border-2 border-black'>RO</th>
                        </tr>
                    </thead>
                    <ReportRows reportData={reportData} fieldoffices={fieldoffices}/>
                </table>
            </div>
        </div>
    </div>
  )
}

ControlBookReport.propTypes = {
    showReport: PropTypes.func.isRequired,
    reportData: PropTypes.object.isRequired
}

export default ControlBookReport