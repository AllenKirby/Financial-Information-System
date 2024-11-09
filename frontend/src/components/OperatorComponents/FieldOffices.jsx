import PropTypes from 'prop-types'
import { useState } from 'react';
import { FaAngleDown } from "react-icons/fa";
import { GrDocumentUpdate } from "react-icons/gr";
import { MdDeleteOutline } from "react-icons/md";
import { useFundingHook } from '../../hooks/useFundingHook';

import AddNewFieldOffice from "./AddNewFieldOffice";

const FieldOffices = ({fieldOffice, ASANo}) => {
  const { deleteFieldOffice, isLoading } = useFundingHook()
  const [FieldOfficeModal, setFieldOfficeModal] = useState(false)

  const modal = () => setFieldOfficeModal(!FieldOfficeModal)

  const deleteFO = async() => {
    const id = `${ASANo},${fieldOffice.fieldOffice}`

    await deleteFieldOffice(id)
  }
  return (
    <div className='w-full h-auto py-2 px-4 rounded-lg border-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center justify-center gap-3'>
            <FaAngleDown size={25}/>
            <p className='text-xl'>{fieldOffice.fieldOffice}</p>
          </div>
          <div className='flex items-center justify-center gap-3'>
            <button onClick={modal}>
              <GrDocumentUpdate size={20}/>
            </button>
            <button disabled={isLoading} onClick={deleteFO}>
              <MdDeleteOutline size={25}/>
            </button>
          </div>
        </div>
        {FieldOfficeModal && (
        <>
          <div className="fixed inset-0 z-20 bg-black opacity-50" onClick={modal} />
          <div className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
            <AddNewFieldOffice modal={modal} ASANo={ASANo} fieldOffice={fieldOffice} flag={true}/>
          </div>
        </>
      )}
    </div>
  )
}

FieldOffices.propTypes = {
    fieldOffice: PropTypes.object.isRequired,
    ASANo: PropTypes.string.isRequired
}

export default FieldOffices