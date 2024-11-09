import PropTypes from 'prop-types'
import { FaAngleDown } from "react-icons/fa";

const FieldOffices = ({fieldOffice}) => {
    console.log(fieldOffice)
  return (
    <div className='w-full h-auto py-2 px-4 rounded-lg border-2'>
        <div className='flex items-center justify-start gap-2'>
            <FaAngleDown size={25}/>
            <p className='text-xl'>{fieldOffice.fieldOffice}</p>
        </div>
    </div>
  )
}

FieldOffices.propTypes = {
    fieldOffice: PropTypes.object.isRequired
}

export default FieldOffices