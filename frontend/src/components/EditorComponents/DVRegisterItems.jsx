import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom';

const DVRegisterItems = ({DV, index}) => {
    const navigate = useNavigate()

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
      <p className='w-full sm:w-1/5 truncate flex items-center justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>BUR No.: </span>{DV[1]?.data?.ORSBURS || '--'}</p>
      <p className='w-full sm:w-1/5 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>DV NO.: </span>{DV[1]?.data.DV}</p>
      <p className='w-full sm:w-1/5 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>Payee: </span>{DV[1]?.data?.payee}</p>
      <p className='w-full sm:w-1/5 flex items-center justify-start text-sm gap-2 font-semibold truncate'><span className='font-normal block sm:hidden'>Particulars: </span>{DV[1]?.data.particular}</p>
      <p className='w-full sm:w-1/5 flex items-center justify-start sm:justify-center gap-2 font-semibold'><span className='font-normal block sm:hidden'>Amount: </span>{formatToPeso(DV[1]?.data?.amount)}</p>
    </div>
  )
}

DVRegisterItems.propTypes = {
    DV: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
}

export default DVRegisterItems