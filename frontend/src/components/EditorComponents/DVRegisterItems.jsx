import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom';

const DVRegisterItems = ({DV, index, counter}) => {
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

  return (
    <div onClick={() => navigate(`${DV[1]?.data?.DVKey}|${getStatus(DV[1]?.data?.status)}|${'0'}`)} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} w-full h-auto cursor-pointer my-1 rounded-lg p-2 flex flex-col sm:flex-row items-center justify-center text-sm`}>
      <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>DV NO.: </span>{DV[1]?.data.DV}</p>
      {counter === 1 && (
        <>
          <p className='w-full sm:w-1/6 flex items-center justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>PR No. Date: </span>--</p>
          <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>PR NO.: </span>--</p>
          <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>PO No. Date: </span>--</p>
          <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold truncate'><span className='font-normal block sm:hidden'>PO No.: </span>--</p>
          <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>BUR Date: </span>--</p>
        </>
      )}
      {counter === 2 && (
        <>
          <p className='w-full sm:w-1/6 flex items-center justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>BUR No.: </span>{DV[1]?.data?.ORSBURS?.split("-")[3] || '--'}</p>
          <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>DV Date.: </span>{DV[1]?.data.date}</p>
          <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>Payee: </span>{DV[1]?.data?.payee}</p>
          <p className='w-full sm:w-2/6 flex items-center justify-start text-sm gap-2 font-semibold truncate'><span className='font-normal block sm:hidden'>Particulars: </span>{DV[1]?.data.particular}</p>
        </>
      )}
      {counter === 3 && (
        <div className='w-5/6 flex'>
          <p className='w-full sm:w-1/4 flex items-center justify-center sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>ASA No.: </span>{ASA.join('\n') || '--'}</p>
          <p className='w-full sm:w-1/4 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>Project Name: </span>{project.join('\n') || '--'}</p>
          <p className='w-full sm:w-1/4 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>Category: </span>{category.join('\n') || '--'}</p>
          <p className='w-full sm:w-1/4 flex items-center justify-start sm:justify-center gap-2 font-semibold truncate'><span className='font-normal block sm:hidden'>ASA Amount: </span>{asaAmount.join('\n') || '--'}</p>
        </div>
      )}
      {counter === 4 && (
        <>
          <p className='w-full sm:w-1/6 flex items-center justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>ASA-1st: </span>--</p>
          <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>ADA-2nd: </span>--</p>
          <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>Remittance: </span>--</p>
          <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold truncate'><span className='font-normal block sm:hidden'>BIR: </span>--</p>
          <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>GSIS: </span>--</p>
        </>
      )}
      {counter === 5 && (
        <>
          <p className='w-full sm:w-1/6 flex items-center justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>GSIS Loan: </span>--</p>
          <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>Landbank: </span>--</p>
          <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>Disallowance: </span>--</p>
          <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold truncate'><span className='font-normal block sm:hidden'>HDMF: </span>--</p>
          <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>HDMF: </span>--</p>
        </>
      )}
      {counter === 6 && (
        <>
          <p className='w-full sm:w-1/6 flex items-center justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>PHIC: </span>--</p>
          <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>NIAEASP-RO: </span>--</p>
          <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>NIAEASP-DO: </span>--</p>
          <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold truncate'><span className='font-normal block sm:hidden'>NIAEASP-Dues: </span>--</p>
          <p className='w-full sm:w-1/6 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>COOP: </span>--</p>
        </>
      )}
      {counter === 7 && (
        <div className='w-5/6 flex'>
          <p className='w-full sm:w-1/3 flex items-center justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>Total: </span>--</p>
          <p className='w-full sm:w-1/3 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>Cash: </span>--</p>
          <p className='w-full sm:w-1/3 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>BIR-Others: </span>--</p>
        </div>
      )}
      {counter === 8 && (
        <div className='w-5/6 flex'>
          <p className='w-full sm:w-1/4 flex items-center justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>ASA Total: </span>--</p>
          <p className='w-full sm:w-1/4 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>ASA Releases: </span>--</p>
          <p className='w-full sm:w-1/4 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>Cash Totals: </span>--</p>
          <p className='w-full sm:w-1/4 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>Cash Releases: </span>--</p>
        </div>
      )}
      {counter === 9 && (
        <div className='w-5/6 flex'>
          <p className='w-full sm:w-1/2 flex items-center justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>Check Date: </span>--</p>
          <p className='w-full sm:w-1/2 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>Check No.: </span>--</p>
        </div>
      )}
    </div>
  )
}

DVRegisterItems.propTypes = {
    DV: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    counter: PropTypes.number.isRequired
}

export default DVRegisterItems