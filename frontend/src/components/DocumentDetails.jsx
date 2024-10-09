import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDisbursementContext } from '../hooks/useDisbursementContext';
import { parse, formatDistanceToNow } from 'date-fns';


const DocumentDetails = ({ documents, type }) => {
  const navigate = useNavigate();
  const [statusColor, setStatusColor] = useState('')
  const [docu, setDocu] = useState(null)
  const [dateTime, setDateTime] = useState({date: '', time: ''})
  // console.log("documents details: ", documents)


  useEffect(()=>{
    if(documents && type === '4'){
      setDocu(documents)
    }
    else if(documents && type === '3'){
      setDocu(documents.data)

    }
  },[documents, type]) //[documents, type, docu], [documents], [] 


  const formateDateTime = (datetime) => {
    if (!datetime) return null;
    const formattedDateString = datetime.replace('|', ' ');

    return parse(formattedDateString, 'MMMM dd, yyyy hh:mm:ss a', new Date());
  }

  useEffect(() => {
    if(docu?.status === 'Drafting'){
      setStatusColor('bg-gray-200 text-customFontColor')
    }else if (docu?.status === 'In Review'){
      setStatusColor('bg-blue-500 text-white')
    }else if(docu?.status === 'Under Review'){
      setStatusColor('bg-orange-500 text-white')
    }else if(docu?.status === 'Approved'){
      setStatusColor('bg-green-500 text-white')
    }
  }, [docu])


  return (
    <div onClick={() => navigate(`${docu.DV}|${docu.status}|${type}`)} className="w-full h-12 rounded-md my-1 bg-white text-customFontGreen cursor-pointer flex items-center justify-center">
      {/* Payee column */}
      <h2 className="font-semibold text-lg text-left w-4/6 px-3">
        {docu?.payee}
      </h2>
      {/* DV No. column */}
      <h2 className="text-xs font-light text-center w-1/6">
        {docu?.DV}
      </h2>
      {/* Status column */}
      <h2 className="text-xs font-light flex items-center justify-center w-1/6">
        <div className={`${statusColor} w-20 h-auto rounded-md text-center px-2 py-1`}>
          { docu?.status }
        </div>
      </h2><h2 className="text-xs font-light text-center w-1/6">
        {formatDistanceToNow(formateDateTime(docu?.dateTimePassed), { addSuffix: true })}
      </h2>
      
    </div>
  );
};

DocumentDetails.propTypes = {
  documents: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired
};

export default DocumentDetails;
