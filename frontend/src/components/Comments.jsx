import { FaUserCircle } from "react-icons/fa";

import PropTypes from 'prop-types'

const Comments = ({comment}) => {
    console.log(comment)
  return (
    <div className="w-full h-auto p-3 ">
        <div className="flex items-center justify-between">
            <div className="flex gap-2">
                <FaUserCircle size={40}/>
                <div>
                    <h1 className="font-bold">{comment.dispName}</h1>
                    <p className="text-xs">{comment.dateTimePassed}</p>
                </div>
            </div>
        </div>
        <div className='w-full h-auto py-3'>
            <p>{comment.remarks}</p>
        </div>
    </div>
  )
}

Comments.propTypes = {
    comment: PropTypes.object.isRequired
  };
  

export default Comments