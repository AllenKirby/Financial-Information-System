import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom';
import { parse, formatDistanceToNow } from 'date-fns';

const BURRecordsItem = ({BUR, index, activeTab}) => {
    const navigate = useNavigate()

    const formatDateTime = (datetime) => {
      if (!datetime) return null;
      const formattedDateString = datetime.replace('|', ' ');
      return parse(formattedDateString, 'MMMM dd, yyyy hh:mm:ss a', new Date());
    };

    const getStatusColor = (status) => {
        switch (status) {
          case 'Approved':
            return 'bg-green-200 text-green-500';
          case 'For Approval':
            return 'bg-yellow-200 text-yellow-500';
          case 'Under Review':
            return 'bg-orange-200 text-orange-500';
          case 'In Review':
            return 'bg-blue-200 text-blue-500';
          case 'Drafting':
            return 'bg-gray-200 text-gray-500';
          case 'Returned|3':
          case 'Returned|4':
          case 'Returned|2':
            return 'bg-red-200 text-red-500';
          default:
            return 'bg-red-500 text-white';
        }
      };

  return (
    <div onClick={() => navigate(`${BUR?.id}`)} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} w-full my-1 h-fit cursor-pointer px-2 rounded-md flex flex-col sm:flex-row items-center justify-start sm:justify-center gap-2 p-2`}>
      <p className={`w-full ${activeTab ? 'sm:w-1/4' : 'sm:w-2/4'} text-sm flex items-center justify-start gap-2 font-semibold text-gray-500`}><span className='block sm:hidden'>Payee:</span>{BUR?.payee}</p>
      <p className='w-full sm:w-1/4 text-sm text-gray-500 flex items-center justify-start sm:justify-center gap-2 text-center'><span className='block sm:hidden'>GAA:</span>{BUR?.GAA}</p>
      <p className='w-full sm:w-1/4 text-xs text-gray-500 font-semibold flex items-center justify-start sm:justify-center gap-2 text-center'><span className='block sm:hidden'>Status:</span><span className={`${getStatusColor(BUR?.status)} px-2 py-1 rounded-md`}>{BUR?.status?.includes('Returned') ? BUR?.status?.split("|")[0] : BUR?.status}</span></p>
      {activeTab === 'Drafting' && (<p className='w-full sm:w-1/4 text-sm text-gray-500 text-center flex items-center justify-start sm:justify-center gap-2'><span className='block sm:hidden'>Time Created:</span>{formatDistanceToNow(formatDateTime(BUR?.createdAt), { addSuffix: true })}</p>)}
      {activeTab === 'Returned' && (<p className='w-full sm:w-1/4 text-sm text-gray-500 text-center flex items-center justify-start sm:justify-center gap-2'><span className='block sm:hidden'>Time Returned:</span>{formatDistanceToNow(formatDateTime(BUR?.returnedBy?.split("|")[1]), { addSuffix: true })}</p>)}
      {activeTab === 'Under Review' && (<p className='w-full sm:w-1/4 text-sm text-gray-500 text-center flex items-center justify-start sm:justify-center gap-2'><span className='block sm:hidden'>Time Transferred:</span>{formatDistanceToNow(formatDateTime(BUR?.submittedBy?.split("|")[1]), { addSuffix: true })}</p>)}
      {activeTab === 'For Approval' && (<p className='w-full sm:w-1/4 text-sm text-gray-500 text-center flex items-center justify-start sm:justify-center gap-2'><span className='block sm:hidden'>Time Transferred:</span>{formatDistanceToNow(formatDateTime(BUR?.reviewedBy?.split("|")[1]), { addSuffix: true })}</p>)}
      {activeTab === 'Approved' && (<p className='w-full sm:w-1/4 text-sm text-gray-500 text-center flex items-center justify-start sm:justify-center gap-2'><span className='block sm:hidden'>Time Transferred:</span>{formatDistanceToNow(formatDateTime(BUR?.approvedBy?.split("|")[1]), { addSuffix: true })}</p>)}
    </div>
  )
}

BURRecordsItem.propTypes = {
    BUR: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    activeTab: PropTypes.string.isRequired,
}

export default BURRecordsItem