import EmptyFolder from '../../assets/icons/emptyfolder.png'
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from 'react-router-dom'

import PropTypes from 'prop-types'

const Folder = ({controlBook}) => {
    const navigate = useNavigate()
    const subcollectionCounts = () => controlBook.subcollection ? Object.entries(controlBook.subcollection).length : 0
  return (
    <div onClick={() => navigate(`${controlBook.ASANo}`)} className="h-1/2 rounded-lg hover:bg-gray-200 p-2 transition-all duration-100 cursor-pointer">
        <div className='w-full h-[80%] flex items-center justify-center'>
            <img 
                src={EmptyFolder} 
                alt="empty folder" 
                className='w-auto h-full'/>
        </div>
        <div className='px-4 flex items-center justify-between'>
            <p className='text-sm font-semibold'>{controlBook.ASANo}</p>
            <BsThreeDots size={15}/>
        </div>
        <div className='px-4'>
            <p className='text-sm'>{subcollectionCounts > 1 ? `${subcollectionCounts()} items` : `${subcollectionCounts()} item`}</p>
        </div>
    </div>
  )
}

Folder.propTypes = {
    controlBook: PropTypes.object.isRequired
}

export default Folder