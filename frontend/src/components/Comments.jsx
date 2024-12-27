import PropTypes from 'prop-types'

const Comments = ({comment}) => {

  const avatar = (name) => {
    if(name){
      const nameSplit = name.split(' ')
      const initial =  `${nameSplit[0].charAt(0)}${nameSplit[1].charAt(0)}`
      return initial.toUpperCase()
    }
  }

  return (
    <div className="w-full h-auto p-3 ">
        <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <div className="bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center">
                <p className='font-bold text-sm'>{avatar(comment.dispName)}</p>
              </div>
                <div>
                  <h1 className="font-bold">{comment.dispName}</h1>
                  <p className="text-xs">{comment.dateTimeCollection}</p>
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