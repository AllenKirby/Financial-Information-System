import PropTypes from 'prop-types'
import { useState } from 'react';
import Swal from 'sweetalert2';

import { FaAngleDown, FaAngleUp  } from "react-icons/fa";
import { MdDeleteOutline, MdOutlineModeEdit } from "react-icons/md";

import { useFundingHook } from '../../hooks/useFundingHook';

import AddNewFieldOffice from "./AddNewFieldOffice";

const FieldOffices = (props) => {
  const {fieldOffice, ASANo, fieldOfficeID} = props

  const { deleteFieldOffice, isLoading, error } = useFundingHook()
  
  const [FieldOfficeModal, setFieldOfficeModal] = useState(false)
  const [dropDown, setDropDown] = useState(false)

  const modal = (e) => {
    e.stopPropagation()
    setFieldOfficeModal(!FieldOfficeModal)
  }

  const formatToPeso = (value) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(value);
  };

  const sortDate = () => {
    if(fieldOffice && fieldOffice.dvCollection) {
      const sortedProjects = Object.entries(fieldOffice.dvCollection).sort(([,a],[,b]) => new Date(b.date) - new Date(a.date));
      return Object.fromEntries(sortedProjects)
    }
    return null
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
    <div onClick={() => setDropDown(!dropDown)} className={`w-full h-auto overflow-y-auto py-2 px-4 rounded-lg border-2 my-1 transition-all duration-300`}>
        <div className='flex items-center justify-between my-2'>
          <div className='flex items-center justify-center gap-3'>
            {dropDown? <FaAngleUp size={25}/> : <FaAngleDown size={25}/>}
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
        <div className={`${dropDown ? ' max-h-96' : 'h-0'} w-full rounded-lg overflow-auto`}>
          <div className=" w-full h-auto px-5 mb-5 lg:text-sm 2xl:text-base">
            <p className="font-bold mt-1">Field Office: <span className="font-normal">{fieldOffice.fieldOffice}</span></p>
            <p className="font-bold mt-1">ASA: <span className="font-normal">{formatToPeso(fieldOffice.ASA)}</span></p>
            <p className="font-bold mt-1">Remaining ASA Balance: <span className="font-normal">{formatToPeso(fieldOffice.RO)}</span></p>
            <p className="font-bold mt-1">Total Spending: <span className="font-normal">{formatToPeso(fieldOffice.FO)}</span></p>
          </div>
          <div className="w-full border-2">
            <div className="bg-gray-200 grid grid-cols-6 gap-2 border-b-2 p-2">
              <div className="font-semibold text-center">Date</div>
              <div className="font-semibold text-center">DV No.</div>
              <div className="font-semibold text-center">BUR No.</div>
              <div className="font-semibold text-center">Payee</div>
              <div className="font-semibold text-center">Particulars</div>
              <div className="font-semibold text-center">ASA</div>
            </div>

            {sortDate() && Object.entries(sortDate()).length > 0 ? (
              Object.entries(sortDate()).map(([key, DV]) => (
                <div key={key} className="grid grid-cols-6 gap-2 border-b-2 p-2 items-center">
                  <div className="text-center">{DV.date}</div>
                  <div className="text-center">{DV.DVNoCount}</div>
                  <div className="text-center">{DV.orsData}</div>
                  <div className="text-center break-words">{DV.payee}</div>
                  <div className="break-words truncate">{DV.particulars}</div> {/* Handles long text */}
                  <div className="text-center">{DV.amount}</div>
                </div>
              ))
            ) : (
              <div className="text-center font-semibold p-4">No Voucher Found</div>
            )}
          </div>

        </div>
        {FieldOfficeModal && (
        <>
          <div className="fixed inset-0 z-20 bg-black opacity-50" onClick={modal} />
          <div className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
            <AddNewFieldOffice modal={modal} ASANo={ASANo} fieldOffice={fieldOffice} fieldOfficeID={fieldOfficeID} flag={true}/>
          </div>
        </>
      )}
    </div>
  )
}

FieldOffices.propTypes = {
    fieldOffice: PropTypes.object.isRequired,
    ASANo: PropTypes.string.isRequired,
    fieldOfficeID: PropTypes.string.isRequired
}

export default FieldOffices