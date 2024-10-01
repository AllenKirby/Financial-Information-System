import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom';

const DocumentDetails = ({documents}) => {
  const navigate = useNavigate()

  return (
    <div onClick={() => navigate(`editor/${documents.DV}`)} className="w-full h-24 rounded-xl bg-customgreen p-3 text-white my-3 cursor-pointer">
        <h1 className='font-semibold text-xl'>{documents.payee}</h1>
        <p>{documents.address}</p>
        <p>DV No. {documents.DV}</p>

    </div>
  )
}

DocumentDetails.propTypes = {
    documents: PropTypes.object.isRequired
  };

export default DocumentDetails