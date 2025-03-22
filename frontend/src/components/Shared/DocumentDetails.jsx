import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { parse, formatDistanceToNow } from 'date-fns';
import { useSelector } from 'react-redux';

const DocumentDetails = ({ index, documents, type, activeTab }) => {
  const navigate = useNavigate();
  const [docu, setDocu] = useState(null);
  const [Status, setStatus] = useState('');
  const permission = useSelector((state) => state.permission)

  useEffect(() => {
    if (documents && type === '4') {
      setDocu(documents);
    } else if (documents && type === '3') {
      setDocu(documents.data);
    } else if (documents && type === '2') {
      setDocu(documents.data);
    }
    else if (documents && type === '1') {
      setDocu(documents.data);
    }
  }, [documents, type]);

  useEffect(() => {
    if (docu) {
      setStatus(getStatus(docu?.status)); // Call the function to set status once
    }
  }, [docu]);

  const formatDateTime = (datetime) => {
    if (!datetime) return null;
    const formattedDateString = datetime.replace('|', ' ');
    return parse(formattedDateString, 'MMMM dd, yyyy hh:mm:ss a', new Date());
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

  const getDateTime = () => {
    switch(type){
      case '4':
        return docu?.createdAt
      case '3':
        if (docu?.submittedBy) {
          const [, dateTime] = docu.submittedBy.split('|'); 
          return dateTime;
        }
        return;
      case '2':
        if (docu?.updatedBy) {
          const [, dateTime] = docu.updatedBy.split('|'); 
          return dateTime;
        }
        return;
      case '1':
        if (docu?.reviewedBy) {
          const [, dateTime] = docu.reviewedBy.split('|'); 
          return dateTime;
        }
        return;
      default:
        return;
    }
  }

  const getTimeDateforReturned = (dateTime) => {
    if(dateTime) {
      const DT = dateTime.split('|').slice()[1]; 
      return DT;
    }
  }

  return (
    <div
      onClick={() => navigate(`${docu?.DVKey}|${Status}|${type}`)}
      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} w-full h-auto p-2 sm:py-2 mb-1 text-gray-500 rounded-lg cursor-pointer flex flex-col sm:flex-row items-center justify-start sm:justify-center`}
    >
      {/* Payee column */}
      {activeTab === 'Drafting' || activeTab === 'In Review' || activeTab === 'For Approval' ? (
        <h2 className={`font-semibold text-left sm:text-xs lg:text-sm 2xl:text-lg w-full sm:w-3/6 p-0 sm:px-3 flex items-center justify-start gap-2 truncate`}>
          <span className="font-bold block sm:hidden">Payee</span>{docu?.payee}
        </h2>
      ) : (
        <h2 className={`font-semibold text-left sm:text-xs lg:text-sm 2xl:text-lg ${(type === '4' || type === '3' || type === '2' || type === '1') && !activeTab ? 'w-full sm:w-4/6' : 'w-full sm:w-3/6'} p-0 sm:px-3 flex items-center justify-start gap-2 truncate`}>
          <span className="font-bold block sm:hidden">Payee:</span>{docu?.payee}
        </h2>
        )}

      {/* DV No. column */}
      <h2 className="sm:text-xs 2xl:text-sm font-light flex items-center justify-start sm:justify-center gap-2 w-full sm:w-1/6">
        <span className="font-bold block sm:hidden">DV No.:</span>{docu?.DV}
      </h2>

      {/* Status column */}
      <div className="flex items-center justify-start sm:justify-center w-full sm:w-1/6">
        <h2 className={` sm:text-xs 2xl:text-sm font-semibold flex items-center justify-start sm:justify-center gap-2`}>
          <span className="font-bold block sm:hidden">Status:</span> <span className={`${getStatusColor(Status)} w-auto h-auto rounded-md text-center px-2 py-1`}>{Status}</span>
        </h2>
      </div>
  
      {!(activeTab === 'Returned' || !activeTab || activeTab === 'Approved' || activeTab === 'Drafting' && permission?.data.permission && permission?.data?.roleName === 'Funding' || activeTab === 'In Review' && permission?.data.permission && permission?.data?.roleName === 'Preparer'|| type === '2' && activeTab === 'For Approval') && 
        <h2 className="sm:text-xs 2xl:text-sm font-light flex items-center justify-start sm:justify-center gap-2 w-full sm:w-1/6">
          <span className="font-bold block sm:hidden">Time Transferred:</span> {getDateTime() ? formatDistanceToNow(formatDateTime(getDateTime()), { addSuffix: true }) : '--'}
        </h2>
      }

      {(activeTab === 'Drafting' && permission?.data.permission && permission?.data?.roleName === 'Funding') && <h2 className="sm:text-xs 2xl:text-sm font-light flex items-center justify-start sm:justify-center gap-2 w-full sm:w-1/6">
        <span className="font-bold block sm:hidden">Time Created:</span>{formatDistanceToNow(formatDateTime(docu?.createdAt), { addSuffix: true })} 
      </h2>}

      {(activeTab === 'In Review' && permission?.data.permission && permission?.data?.roleName === 'Preparer') && <h2 className="sm:text-xs 2xl:text-sm font-light flex items-center justify-start sm:justify-center gap-2 w-full sm:w-1/6">
        <span className="font-bold block sm:hidden">Time Transferred:</span>{docu?.submittedBy ? formatDistanceToNow(formatDateTime(docu?.submittedBy.split('|')[1]), { addSuffix: true }) : '--'} 
      </h2>}

      {(activeTab === 'For Approval' && type === '2' ) && <h2 className="sm:text-xs 2xl:text-sm font-light flex items-center justify-start sm:justify-center  gap-2 w-full sm:w-1/6">
        <span className="font-bold block sm:hidden">Time Transferred:</span>{docu?.reviewedBy ? formatDistanceToNow(formatDateTime(docu?.reviewedBy.split('|')[1]), { addSuffix: true }) : '--'} 
      </h2>}

      {(activeTab !== '' && activeTab === 'Returned') && (
        (type === '4' || type === '3' || type === '2') && ( 
          <h2 className="sm:text-xs 2xl:text-sm font-light flex items-center justify-start sm:justify-center gap-2 w-full sm:w-1/6">
            {/* {docu?.returnedToPreparer || docu?.returnedToFunding ? formatDistanceToNow(formatDateTime(getTimeDateforReturned()), { addSuffix: true }) : '-'} */}
            <span className="font-bold block sm:hidden">Time Transferred:</span>
            {(type === '4' || permission?.data?.permission && permission?.data?.roleName === 'Funding') && docu?.returnedToPreparer && formatDistanceToNow(formatDateTime(getTimeDateforReturned(docu?.returnedToPreparer)), { addSuffix: true }) }
            {(type === '3' || permission?.data?.permission && permission?.data?.roleName === 'Preparer') && docu?.returnedToFunding && formatDistanceToNow(formatDateTime(getTimeDateforReturned(docu?.returnedToFunding)), { addSuffix: true }) }
            {type === '2' && docu?.returnedToBO && formatDistanceToNow(formatDateTime(getTimeDateforReturned(docu?.returnedToBO)), { addSuffix: true }) }  
          </h2>
        )
      )}

      {(type === '1' && activeTab === 'Approved' || type === '2' && activeTab === 'Approved') && (
        <h2 className="sm:text-xs 2xl:text-sm w-full sm:w-1/6 flex items-center justify-start sm:justify-center font-light">
          <span className="font-bold block sm:hidden">Time Approved:</span> {formatDistanceToNow(formatDateTime(docu?.approvedBy), { addSuffix: true })}
        </h2>
      )}
    </div>
  );
};

DocumentDetails.propTypes = {
  documents: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  index: PropTypes.string.isRequired,
  activeTab: PropTypes.string.isRequired
};

export default DocumentDetails;
