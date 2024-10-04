import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { useDeleteDisbursement } from '../hooks/useDeleteDisbursement';
import Swal from 'sweetalert2';

const DocumentDetails = ({documents}) => {
  const navigate = useNavigate()
  const { deleteDV } =  useDeleteDisbursement()
  const DV = documents?.DV

  const delDV = async(e) => {
    e.stopPropagation()

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#009933",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async(result) => {
      if (result.isConfirmed) {
        const res = await deleteDV(DV)
        if(res){
          Swal.fire({
            title: "Deleted!",
            text: "Your Documents has been deleted.",
            icon: "success"
          });
        }
      }
    });
  }
    
  

  return (
    <div onClick={() => navigate(`${documents.DV}`)} className="w-full h-24 rounded-xl bg-customgreen p-3 text-white my-3 cursor-pointer">
        <div className='flex items-center justify-between'>
          <h1 className='font-semibold text-2xl'>{documents?.payee}</h1>
          <MdDelete size={20} onClick={(e) => delDV(e)} className='cursor-pointer' />
        </div>
        <p className='text-sm font-light'>{documents?.timePassed ? documents?.timePassed : ''}</p>
        <p className='text-sm font-light'>DV No. {documents?.DV}</p>
    </div>
  )
}

DocumentDetails.propTypes = {
    documents: PropTypes.array.isRequired
  };

export default DocumentDetails