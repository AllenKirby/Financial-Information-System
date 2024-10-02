import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { useDeleteDisbursement } from '../hooks/useDeleteDisbursement';

const DocumentDetails = ({documents}) => {
  const navigate = useNavigate()
  const { deleteDV } =  useDeleteDisbursement()
  const DV = documents.DV

  const delDV = async(e) => {
    e.stopPropagation()
    await deleteDV(DV)
  }
    
  return (
    <div onClick={() => navigate(`${documents.DV}`)} className="w-full h-24 rounded-xl bg-customgreen p-3 text-white my-3 cursor-pointer">
        <div className='flex items-center justify-between'>
          <h1 className='font-semibold text-2xl'>{documents.payee}</h1>
          <MdDelete size={20} onClick={(e) => delDV(e)} className='cursor-pointer' />
        </div>
        <p className='text-sm font-light'>{documents.address}</p>
        <p className='text-sm font-light'>DV No. {documents.DV}</p>
    </div>
  )
}

DocumentDetails.propTypes = {
    documents: PropTypes.object.isRequired
  };

export default DocumentDetails