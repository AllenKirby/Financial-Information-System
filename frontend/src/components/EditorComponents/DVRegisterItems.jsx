import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom';
import { MdOutlineEdit } from "react-icons/md";

const DVRegisterItems = ({DV, index, counter, modal}) => {
  const navigate = useNavigate()
  const ASA = Object.entries(DV[1]?.data?.ASA ?? {}).map(([key,]) => key.split('|')[0])
  const project = Object.entries(DV[1]?.data?.ASA ?? {}).map(([key,]) => key.split(',')[1].split('>')[0])
  const category = Object.entries(DV[1]?.data?.ASA ?? {}).map(([key,]) => key.split(',')[1].split('>')[1])
  const asaAmount = Object.entries(DV[1]?.data?.ASA ?? {}).map(([, asa]) => asa)
  //console.log(Object.entries(DV[1]?.data?.ASA ?? {}).map(([, asa]) => asa))

    const formatToPeso = (value) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(value);
    };

    const getStatus = (status) => {
        switch (status) {
          case 'Approved':
            return 'Approved';
          case 'For Approval':
            return 'For Approval';
          case 'Under Review':
            return 'Under Review';
          case 'In Review':
            return 'In Review';
          case 'Drafting':
            return 'Drafting';
          case 'Returned|3':
            return 'Returned';
          case 'Returned|4':
            return 'Returned';
          case 'Returned|2':
            return 'Returned';
          default:
            return 'Unknown';
        }
      };

  const val1 = eval(DV[1].data.amount + DV[1].data.TT_formula1).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const val2 = eval(DV[1].data.amount + DV[1].data.TT_formula2).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const tval = parseFloat(val1.replace(/,/g, '')) + parseFloat(val2.replace(/,/g, ''))
  const total_val = tval.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const floatTotal_val = parseFloat(total_val.replace(/,/g, ''))

  const adue = DV[1].data.amount - tval

  const ASAamount = DV[1].data.ASA ? Object.values(DV[1].data.ASA) : [];
  const sumOfASA = (ASA) => {
    let sum = 0
    for(let i = 0; i < ASA.length; i++) {
      sum += ASA[i]
    }
    return formatToPeso(sum)
  }

  return (
    <div onClick={() => navigate(`${DV[1]?.data?.DVKey}|${getStatus(DV[1]?.data?.status)}|${'0'}`)} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} w-full sm:pl-10 sm:pr-5 h-auto cursor-pointer my-1 rounded-lg p-2 flex flex-row items-center justify-center text-sm`}>
      <div className='w-full flex flex-col sm:flex-row items-center justify-center'>
        <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>DV NO.: </span>{DV[1]?.data.DV}</p>
        {counter === 1 && (
          <>
            <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>PR No. Date: </span>{DV[1].data.PRNoDate ? DV[1].data.PRNoDate : '--'}</p>
            <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>PR NO.: </span>{DV[1].data.PRNo ? DV[1].data.PRNo : '--'}</p>
            <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>PO No. Date: </span>{DV[1].data.PONODate ? DV[1].data.PONODate : '--'}</p>
            <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold truncate'><span className='font-normal block sm:hidden'>PO No.: </span>{DV[1].data.PONO ? DV[1].data.PONO : '--'}</p>
            <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>BUR Date: </span>{DV[1].data.BURDate ? DV[1].data.BURDate : '--'}</p>
          </>
        )}
        {counter === 2 && (
          <>
            <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>BUR No.: </span>{DV[1]?.data?.ORSBURS?.split("-")[3] || '--'}</p>
            <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>DV Date.: </span>{DV[1]?.data.date}</p>
            <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>Payee: </span>{DV[1]?.data?.payee}</p>
            <p className='w-full sm:w-2/6 flex items-center justify-start text-sm gap-2 font-semibold text-wrap flex-r'><span className='font-normal block sm:hidden'>Particulars: </span>{DV[1]?.data.particular}</p>
          </>
        )}
        {counter === 3 && (
          <div className='w-5/6 flex flex-col sm:flex-row'>
            <div className='w-full sm:w-1/4 flex items-center justify-start sm:justify-center gap-2 font-semibold truncate'><span className='font-normal block sm:hidden'>ASA Amount: </span>
              <div className='flex flex-col'>
                {(DV[1].data.activeTab === 'To Payment' || DV[1].data.activeTab === 'GSIS' || DV[1].data.activeTab === 'Meralco' || DV[1].data.activeTab === 'Others' && DV[1].data.ORSBURS) ? ASA.map((item, index) => 
                  <p key={index}>{item}</p>
                ) : '--'}
              </div>
            </div>
            <div className='w-full sm:w-1/4 flex items-center justify-start sm:justify-center gap-2 font-semibold truncate'><span className='font-normal block sm:hidden'>ASA Amount: </span>
              <div className='flex flex-col'>
                {(DV[1].data.activeTab === 'To Payment' || DV[1].data.activeTab === 'GSIS' || DV[1].data.activeTab === 'Meralco' || DV[1].data.activeTab === 'Others' && DV[1].data.ORSBURS) ? project.map((item, index) => 
                  <p key={index}>{item}</p>
                ) : '--'}
              </div>
            </div>
            <div className='w-full sm:w-1/4 flex items-center justify-start sm:justify-center gap-2 font-semibold truncate'><span className='font-normal block sm:hidden'>ASA Amount: </span>
              <div className='flex flex-col'>
                {(DV[1].data.activeTab === 'To Payment' || DV[1].data.activeTab === 'GSIS' || DV[1].data.activeTab === 'Meralco' || DV[1].data.activeTab === 'Others' && DV[1].data.ORSBURS) ? category.map((item, index) => 
                  <p key={index}>{item}</p>
                ) : '--'}
              </div>
            </div>
            <div className='w-full sm:w-1/4 flex items-center justify-start sm:justify-center gap-2 font-semibold truncate'><span className='font-normal block sm:hidden'>ASA Amount: </span>
              <div className='flex flex-col'>
                {(DV[1].data.activeTab === 'To Payment' || DV[1].data.activeTab === 'GSIS' || DV[1].data.activeTab === 'Meralco' || DV[1].data.activeTab === 'Others' && DV[1].data.ORSBURS) ? asaAmount.map((item, index) => 
                  <p key={index}>{formatToPeso(item)}</p>
                ) : '--'}
              </div>
            </div>
          </div>
        )}
        {counter === 4 && (
          <div className='w-5/6 flex flex-col sm:flex-row'>
            <p className='w-full sm:w-1/3 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>ASA-1st: </span>{DV[1].data.ADAfirst ? formatToPeso(DV[1].data.ADAfirst) : '--'}</p>
            <p className='w-full sm:w-1/3 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>ADA-2nd: </span>{DV[1].data.ADASecond ? formatToPeso(DV[1].data.ADASecond) : '--'}</p>
            <p className='w-full sm:w-1/3 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>Cash: </span>{formatToPeso(adue)}</p>
            <p className='w-full sm:w-1/3 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>BIR-Others: </span>{formatToPeso(floatTotal_val)}</p>
          </div>
        )}
        {counter === 5 && (
          <div className='w-5/6 flex'>
            <p className='w-full sm:w-1/4 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>ASA Total: </span>{(DV[1].data.activeTab === 'To Payment' || DV[1].data.activeTab === 'GSIS' || DV[1].data.activeTab === 'Meralco' || DV[1].data.activeTab === 'Others' && DV[1].data.ORSBURS) ? sumOfASA(ASAamount) : '--'}</p>
            <div className='w-full sm:w-1/4 flex items-center justify-start sm:justify-center gap-2 font-semibold'>
              <span className='font-normal block sm:hidden'>ASA Releases: </span>
              <div className="flex flex-col">
                {(DV[1].data.activeTab === 'To Payment' || DV[1].data.activeTab === 'GSIS' || DV[1].data.activeTab === 'Meralco' || DV[1].data.activeTab === 'Others' && DV[1].data.ORSBURS) ? ASAamount.map((amount, index) => (
                  <p key={index}>{formatToPeso(amount)}</p>
                )) : '--'}
              </div>
            </div>
            <p className='w-full sm:w-1/4 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>Cash Totals: </span>{sumOfASA(ASAamount)}</p>
            <p className='w-full sm:w-1/4 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>Cash Releases: </span>{formatToPeso(DV[1].data.amount)}</p>
          </div>
        )}
        {counter === 6 && (
          <div className='w-5/6 flex'>
            <p className='w-full sm:w-1/4 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>Check Date: </span>{DV[1].data.checkDate ? DV[1].data.checkDate : '--'}</p>
            <p className='w-full sm:w-1/4 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>Check No.: </span>{DV[1].data.checkNo ? DV[1].data.checkNo : '--'}</p>
          </div>
        )}
      </div>
      <button onClick={(e) => {e.stopPropagation(); modal(DV[1].data);}} className='w-fit h-full'>
        <MdOutlineEdit size={20}/>
      </button>
    </div>
  )
}

DVRegisterItems.propTypes = {
    DV: PropTypes.array.isRequired,
    index: PropTypes.string.isRequired,
    counter: PropTypes.number.isRequired,
    modal: PropTypes.func.isRequired
}

export default DVRegisterItems