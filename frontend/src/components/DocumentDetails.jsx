import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { parse, formatDistanceToNow } from 'date-fns';
import { IoDocumentOutline } from "react-icons/io5";

const DocumentDetails = ({ documents, type }) => {
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
        return 'bg-green-500 text-white';
      case 'For Approval':
        return 'bg-yellow-500 text-white';
      case 'Under Review':
        return 'bg-orange-500 text-white';
      case 'In Review':
        return 'bg-blue-500 text-white';
      case 'Drafting':
        return 'bg-gray-200 text-customFontColor';
      case 'Returned|3':
      case 'Returned|4':
        return 'bg-red-500 text-white';
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
          const [, date, time] = docu.submittedBy.split('|'); 
          return `${date} ${time}`;
        }
        return;
      case '2':
        if (docu?.updatedBy) {
          const [, date, time] = docu.updatedBy.split('|'); 
          return `${date} ${time}`;
        }
        return;
      case '1':
        if (docu?.reviewedBy) {
          const [, date, time] = docu.reviewedBy.split('|'); 
          return `${date} ${time}`;
        }
        return;
      default:
        return;
    }
  }

  return (
    <div
      onClick={() => navigate(`${docu?.DVKey}|${Status}|${type}`)}
      className="w-full h-12 rounded-md my-1 bg-white border-[1px] text-customFontGreen cursor-pointer flex items-center justify-center"
    >
      {/* Payee column */}
      <h2 className="font-semibold text-left w-4/6 px-3 flex items-center justify-start gap-2">
      <IoDocumentOutline size={25}/> {docu?.payee}.pdf
      </h2>
      {/* DV No. column */}
      <h2 className="text-xs font-light text-center w-1/6">{docu?.DV}</h2>
      {/* Status column */}
      <h2 className="text-xs font-light flex items-center justify-center w-1/6">
        <div className={`${getStatusColor(Status)} w-auto h-auto rounded-md text-center px-2 py-1`}>
          {Status}
        </div>
      </h2>
      <h2 className="text-xs font-light text-center w-1/6">
        {formatDistanceToNow(formatDateTime(getDateTime()), { addSuffix: true })}
      </h2>
    </div>
  );
};

DocumentDetails.propTypes = {
  documents: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
};

export default DocumentDetails;
