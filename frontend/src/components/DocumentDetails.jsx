import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDeleteDisbursement } from '../hooks/useDeleteDisbursement';
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';

const DocumentDetails = ({ documents }) => {
  const navigate = useNavigate();
  const { deleteDV } = useDeleteDisbursement();
  const [statusColor, setStatusColor] = useState('')
  const [dropDown, setDropDown] = useState(false)
  const DV = documents?.DV ? documents?.DV : documents?.key;

  const docStatus = documents?.status ? documents?.status : documents?.data?.status



  useEffect(() => {
    if(docStatus=== 'Drafting'){
      setStatusColor('bg-gray-200 text-customFontColor')
    }else if (docStatus === 'In Review'){
      setStatusColor('bg-blue-500 text-white')
    }else if(docStatus === 'Under Review'){
      setStatusColor('bg-orange-500 text-white')
    }else if(docStatus === 'Approved'){
      setStatusColor('bg-green-500 text-white')
    }
  }, [docStatus])

  const delDV = async (e) => {
    e.stopPropagation();

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#009933",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await deleteDV(DV);
        if (res) {
          Swal.fire({
            title: "Deleted!",
            text: "Your document has been deleted.",
            icon: "success",
          });
        }
      }
    });
  };

  return (
    <div onClick={() => navigate(`${DV}`)} className="w-full h-12 rounded-md my-1 bg-white text-customFontGreen cursor-pointer flex items-center justify-center">
      {/* Payee column */}
      <h2 className="font-semibold text-lg text-left w-3/6 px-3">
        {documents?.payee ? documents?.payee : documents?.timePassed.split('|').slice(-1)[0]}
      </h2>
      {/* DV No. column */}
      <h2 className="text-xs font-light text-center w-1/6">
        {documents?.DV ? `${documents?.DV}` : `${documents?.key}`}
      </h2>
      {/* Status column */}
      <h2 className="text-xs font-light flex items-center justify-center w-1/6">
        <div className={`${statusColor} w-20 h-auto rounded-md text-center px-2 py-1`}>
          { documents?.status ? documents?.status : documents?.data?.status }
        </div>
      </h2>
      {documents.timePassed && 
      (<h2 className="text-xs font-light text-center w-1/6">
        {`${documents?.timePassed.split('|')[0]} ${documents?.timePassed.split('|')[1]}`}
      </h2>)}
      {/* Options column */}
      <h2 className=" flex items-center justify-end w-1/6 px-3 relative">
        <BsThreeDotsVertical onClick={(e) => {e.stopPropagation(); setDropDown(!dropDown)}} size={20} className="cursor-pointer" />
        {dropDown && <>
            <div className="bg-gray-200 absolute top-6 right-[8px] w-7 h-7 rounded-md rotate-45"></div>
            <div className="absolute top-7 right-0 bg-white rounded-xl py-1 px-2 border-2 border-gray-200">
              <button onClick={delDV} className="bg-white rounded-lg text-xs text-red-500 px-5 py-1 font-semibold hover:bg-slate-100 hover:scale-105 transition-all duration-100">Delete</button>
            </div>
          </>}
      </h2>
    </div>
  );
};

DocumentDetails.propTypes = {
  documents: PropTypes.object.isRequired,
};

export default DocumentDetails;
