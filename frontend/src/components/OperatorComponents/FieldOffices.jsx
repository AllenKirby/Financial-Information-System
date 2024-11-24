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
            <p className='text-xl font-bold'>{fieldOffice.projectName}</p>
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
          <div className=" w-full h-auto px-5 mb-5">
            <p className="font-bold text-sm mt-1">Field Office: <span className="font-normal">{fieldOffice.fieldOffice}</span></p>
            <p className="font-bold text-sm mt-1">ASA: <span className="font-normal">{formatToPeso(fieldOffice.ASA)}</span></p>
            <p className="font-bold text-sm mt-1">Remaining ASA Balance: <span className="font-normal">{formatToPeso(fieldOffice.RO)}</span></p>
            <p className="font-bold text-sm mt-1">Total Spending: <span className="font-normal">{formatToPeso(fieldOffice.FO)}</span></p>
          </div>
          <table className='w-full border-2 table-auto'>
            <thead className='bg-gray-200'>
              <tr>
                <th className='border-2'>Date</th>
                <th className='border-2'>DV No.</th>
                <th className='border-2'>BUR No.</th>
                <th className='border-2'>Payee</th>
                <th className='border-2'>Particulars</th>
                <th className='border-2'>ASA</th>
              </tr>
            </thead>
            <tbody>
              {fieldOffice.dvCollection && Object.entries(fieldOffice.dvCollection).length > 0 ? (
                Object.entries(fieldOffice.dvCollection).map(([key, DV]) => (
                  <tr key={key}>
                    <td className='text-center border-2 px-16'>{DV.date}</td>
                    <td className='text-center border-2 px-12'>{DV.DVNoCount}</td>
                    <td className='text-center border-2 px-12'>{DV.orsData}</td>
                    <td className='truncate px-5 border-2'>{DV.payee}</td>
                    <td className='truncate px-5 border-2'>{DV.particulars}</td>
                    <td className='text-center border-2 px-16'>{DV.amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-xl font-semibold text-center py-5">No Voucher Found</td>
                </tr>
              )}
            </tbody>
          </table>
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