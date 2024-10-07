import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDeleteDisbursement } from '../hooks/useDeleteDisbursement';
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import DisbursementVoucher from './EditorComponents/DisbursementVoucher';

const DocumentDetails = ({ documents, type }) => {
  const navigate = useNavigate();
  const { deleteDV } = useDeleteDisbursement();
  const [statusColor, setStatusColor] = useState('')
  const [dropDown, setDropDown] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [docu, setDocu] = useState(null)
  const [dateTime, setDateTime] = useState({date: '', time: ''})

  // console.log("documents records: ", documents)

  const modal = () => {
    setIsModalOpen(!isModalOpen)
  } 

  useEffect(()=>{
    if(documents && type === 'Editor'){
      setDocu(documents)
    }
    else if(documents && type === 'Operator'){
      setDateTime({ date: documents?.timePassed.split('|').slice()[0]})
      setDateTime({ time: documents?.timePassed.split('|').slice()[1]})
      setDocu(documents.data)
    }
  },[documents, type]) //[documents, type, dateTime]


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
        const res = await deleteDV(docu.DV);
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
    <div onClick={() => navigate(`${docu.DV}|${docu.status}`)} className="w-full h-12 rounded-md my-1 bg-white text-customFontGreen cursor-pointer flex items-center justify-center">
      {/* Payee column */}
      <h2 className="font-semibold text-lg text-left w-3/6 px-3">
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
      </h2>
      {documents.timePassed && 
      (<h2 className="text-xs font-light text-center w-1/6">
        {dateTime ? `${dateTime.date} ${dateTime.time}` : ''}
      </h2>)}
      {/* Options column */}
      <div className=" flex items-center justify-end w-1/6 px-3 relative">
        <BsThreeDotsVertical onClick={(e) => {e.stopPropagation(); setDropDown(!dropDown)}} size={20} className="cursor-pointer" />
        {dropDown && <>
            <div className="bg-gray-200 absolute top-6 right-[8px] w-7 h-7 rounded-md rotate-45"></div>
            <div className="absolute top-7 z-50 right-0 bg-gray-200 rounded-xl p-1 border-2 border-gray-200 flex flex-col gap-1">
              {type === 'Editor' && <button onClick={(e)=> {e.stopPropagation();modal()}} className="bg-white w-20 rounded-md text-xs text-customFontGreen py-1 font-semibold hover:bg-slate-100 hover:scale-105 transition-all duration-100">Update</button>}
              <button onClick={delDV} className="bg-white w-20 rounded-md text-xs text-red-500 py-1 font-semibold hover:bg-slate-100 hover:scale-105 transition-all duration-100">Delete</button>
            </div>
          </>}
      </div>
      {isModalOpen && (
        <>
          <div className="fixed inset-0 z-20 bg-black opacity-50" onClick={modal} />
          <section onClick={(e) => e.stopPropagation()} className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
              <DisbursementVoucher modal={modal} document={documents} flag={true}/>
          </section>
        </>
      )}
    </div>
  );
};

DocumentDetails.propTypes = {
  documents: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired
};

export default DocumentDetails;
