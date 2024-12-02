import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { parse, formatDistanceToNow } from 'date-fns';

const DocumentDetails = ({ index, documents, type }) => {
  const navigate = useNavigate();
  const [docu, setDocu] = useState(null);
  const [Status, setStatus] = useState('');

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
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-00 text-green-500';
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
      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} w-full h-12 mb-1 text-customFontColor cursor-pointer flex items-center justify-center`}
    >
      {/* Payee column */}
      <h2 className={`font-semibold text-left sm:text-xs lg:text-sm 2xl:text-lg ${type === '4' || type === '3' || type === '1'? 'w-2/6' : 'w-3/6'} px-3 flex items-center justify-start gap-2 truncate`}>
        {docu?.payee}
      </h2>
      {/* DV No. column */}
      <h2 className="sm:text-xs 2xl:text-sm font-light text-center w-1/6">
        {docu?.DV}
      </h2>
      {/* Status column */}
      <div className="flex items-center justify-center w-1/6">
        <h2 className={`${getStatusColor(Status)} sm:text-xs 2xl:text-sm font-semibold w-auto h-auto rounded-md text-center px-2 py-1`}>
          {Status}
        </h2>
      </div>
      <h2 className="sm:text-xs 2xl:text-sm font-light text-center w-1/6">
        {formatDistanceToNow(formatDateTime(getDateTime()), { addSuffix: true })} 
      </h2>
      {(type === '4' || type === '3') && <h2 className="sm:text-xs 2xl:text-sm font-light text-center w-1/6">
        {/* {docu?.returnedToPreparer || docu?.returnedToFunding ? formatDistanceToNow(formatDateTime(getTimeDateforReturned()), { addSuffix: true }) : '-'} */}
        {type === '4' && docu?.returnedToPreparer && formatDistanceToNow(formatDateTime(getTimeDateforReturned(docu?.returnedToPreparer)), { addSuffix: true }) }
        {type === '3' && docu?.returnedToFunding && formatDistanceToNow(formatDateTime(getTimeDateforReturned(docu?.returnedToFunding)), { addSuffix: true }) } 
      </h2>}
      {type === '1' && <h2 className="sm:text-xs 2xl:text-sm font-light text-center w-1/6">
        {formatDistanceToNow(formatDateTime(docu?.approvedBy), { addSuffix: true })}
      </h2>}
    </div>
  );
};

DocumentDetails.propTypes = {
  documents: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  index: PropTypes.string.isRequired,
};

export default DocumentDetails;
