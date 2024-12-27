import PropTypes from 'prop-types'
import { useState } from 'react';
import Swal from 'sweetalert2';

import { MdDeleteOutline, MdOutlineModeEdit } from "react-icons/md";

import { useFundingHook } from '../../hooks/useFundingHook';

import AddNewFieldOffice from "./AddNewFieldOffice";
import ViewProject from "./ViewProject";

const FieldOffices = (props) => {

  const {fieldOffice, ASANo, fieldOfficeID, remainingASA, flag, openModal} = props

  const { deleteFieldOffice, isLoading, error } = useFundingHook()
  
  const [FieldOfficeModal, setFieldOfficeModal] = useState(false)

  const modal = (e) => {
    e.stopPropagation()
    setFieldOfficeModal(!FieldOfficeModal)
  }

  const deleteFO = async(e) => {
    e.stopPropagation()
    const id = `${ASANo}!${fieldOfficeID}!${fieldOffice.projectName}!${fieldOffice.RO}!${fieldOffice.ASA}`

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
          const res = await deleteFieldOffice(id)
        if (res) {
          Swal.fire({
            title: "Deleted!",
            text: "Project has been deleted.",
            icon: "success",
          });
        } else {
          Swal.fire({
              title: "Error",
              text: {error},
              icon: "error",
          });
        }
      }
    });
  }

  return (
    <div onClick={openModal} className={`w-full h-auto overflow-y-auto py-2 px-4 rounded-lg border-2 my-1 transition-all duration-300`}>
        <div className='flex items-center justify-between my-2'>
          <div className='flex items-center justify-center gap-3'>
            <p className='lg:text-lg 2xl:text-2xl font-bold'>{fieldOffice.projectName}</p>
          </div>
          <div className='flex items-center justify-center gap-3'>
            <button onClick={modal}>
              <MdOutlineModeEdit size={23}/>
            </button>
            {!Object.entries(fieldOffice.dvCollection).length > 0 && (
              <button disabled={isLoading} onClick={deleteFO}>
                <MdDeleteOutline size={25} color='red'/>
              </button>
            )}
          </div>
        </div>
        {FieldOfficeModal && (
          <>
            <div className="fixed inset-0 z-20 bg-black opacity-50" onClick={modal} />
            <div className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
              <AddNewFieldOffice modal={modal} ASANo={ASANo} fieldOffice={fieldOffice} fieldOfficeID={fieldOfficeID} flag={true} remainingASA={remainingASA}/>
            </div>
          </>
        )}
        {flag && (
          <>
            <div className="fixed inset-0 z-20 bg-black opacity-50"/>
            <div className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
              <ViewProject modal={openModal} projectData={fieldOffice}/>
            </div>
          </>
        )}
    </div>
  )
}

FieldOffices.propTypes = {
    fieldOffice: PropTypes.object.isRequired,
    ASANo: PropTypes.string.isRequired,
    fieldOfficeID: PropTypes.string.isRequired,
    flag: PropTypes.bool.isRequired,
    openModal: PropTypes.func.isRequired
}

export default FieldOffices