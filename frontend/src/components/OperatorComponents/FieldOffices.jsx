import PropTypes from 'prop-types'
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import { MdDeleteOutline, MdOutlineModeEdit } from "react-icons/md";
import { SlOptionsVertical } from "react-icons/sl";

import { useFundingHook } from '../../hooks/useFundingHook';

import AddNewFieldOffice from "./AddNewFieldOffice";
import ViewProject from "./ViewProject";
import LargeLoader from '../Loaders/LargeLoader';

const FieldOffices = (props) => {

  const {fieldOffice, index, ASANo, fieldOfficeID, remainingASA, test, tabs, Cluster} = props

  // console.log('fieldOffice: ', fieldOffice)
  // console.log('index: ', index)
  // console.log('ASANo:', ASANo)
  // console.log('fieldOfficeID: ',fieldOfficeID)
  // console.log('remainingASA: ', remainingASA)
  // console.log('test: ', test)
  // console.log('tabs: ', tabs)

  const { deleteFieldOffice, isLoading, error } = useFundingHook()
  
  const [FieldOfficeModal, setFieldOfficeModal] = useState(false)
  const [viewProjectFlag, setViewProjectFlag] = useState(false)
  const [optionsFlag, setOptionsFlag] = useState(false)

  const modal = (e) => {
    e.stopPropagation()
    setFieldOfficeModal(!FieldOfficeModal)
  }
  const viewProject = () => {
    setViewProjectFlag(!viewProjectFlag)
  }

  

  const formatToPeso = (value) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(value);
};
  const deleteFO = async(e) => {
    e.stopPropagation()
    const id = `${ASANo}!${fieldOfficeID}!${fieldOffice.projectName}!${fieldOffice.RO}!${fieldOffice.ASA}!${fieldOffice.tabStatus}`
    
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
    <div onClick={viewProject} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} w-full h-auto cursor-pointer p-2 text-sm rounded-lg flex flex-row gap-2 my-1 transition-all duration-300`}>
      <div className='w-full lg:w-[95%] flex flex-col lg:flex-row items-center justify-start lg:justify-center'>
        <div className='w-full lg:w-1/4 flex items-center justify-start lg:justify-center gap-2'>
          <span className='block lg:hidden'>Project Name:</span><p className='font-bold'>{fieldOffice.fieldOffice}</p>
        </div>
        <div className='w-full lg:w-1/4 flex items-center justify-start lg:justify-center gap-2'>
          <span className='block lg:hidden'>Field Office:</span><p className='font-bold truncate'>{fieldOffice.projectName} {fieldOffice.tabStatus}</p>
        </div>
        <div className='w-full lg:w-1/4 flex flex-row items-center justify-start lg:justify-center gap-2'>
          <div className='w-1/4 h-full flex lg:hidden items-center justify-center'>
            <p>ASA</p>
          </div>

          <div className='w-3/4 lg:w-full flex flex-col sm:flex-row items-center justify-start lg:justify-center gap-2'>
            <div className='w-full lg:w-1/3 flex items-center justify-start lg:justify-center gap-2'>
              <span className='block lg:hidden'>Beginning:</span> <p className='font-semibold'>{formatToPeso(fieldOffice.ASA)}</p>
            </div>
            <div className='w-full lg:w-1/3 flex items-center justify-start lg:justify-center gap-2'>
              <span className='block lg:hidden'>Utilized:</span><p className='font-semibold'>{formatToPeso(fieldOffice.FO)}</p>
            </div>
            <div className='w-full lg:w-1/3 flex items-center justify-start lg:justify-center gap-2'>
              <span className='block lg:hidden'>Balance:</span><p className='font-semibold'>{formatToPeso(fieldOffice.RO)}</p>

            </div>
          </div>
        </div>
        <div className='w-full lg:w-1/4 flex flex-row items-center justify-start lg:justify-center gap-2'>
          <div className='w-1/4 h-full flex lg:hidden items-center justify-center'>
            <p>Cash</p>
          </div>
          <div className='w-3/4 lg:w-full flex flex-col sm:flex-row items-center justify-start lg:justify-center gap-2'>
            <div className='w-full lg:w-1/3 flex items-center justify-start lg:justify-center gap-2'>
              <span className='block lg:hidden'>Beginning:</span> <p className='font-semibold'>{formatToPeso(fieldOffice.cash || 0)}</p>
            </div>
            <div className='w-full lg:w-1/3 flex items-center justify-start lg:justify-center gap-2'>
              <span className='block lg:hidden'>Disbursed:</span><p className='font-semibold'>{formatToPeso(fieldOffice.cashFO)}</p>
            </div>
            <div className='w-full lg:w-1/3 flex items-center justify-start lg:justify-center gap-2'>
              <span className='block lg:hidden'>Balance:</span><p className='font-semibold'>{formatToPeso(parseFloat(fieldOffice.cash) - parseFloat(fieldOffice.cashFO) || 0)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className='w-[5%] relative flex items-center justify-end gap-3'>
        {/* <button onClick={modal}>
          <MdOutlineModeEdit size={23}/>
        </button>
        {!Object.entries(fieldOffice.dvCollection).length > 0 && (
          <button disabled={isLoading} onClick={deleteFO}>
            <MdDeleteOutline size={25} color='red'/>
          </button>
        )} */}
        <button onClick={(e) => {e.stopPropagation(); setOptionsFlag(!optionsFlag)}}>
          <SlOptionsVertical size={17}/>
        </button>
        {optionsFlag && (
          <>
            <div className="fixed inset-0 z-20" onClick={(e) => {e.stopPropagation(); setOptionsFlag(!optionsFlag)}} />
            <div onClick={(e) => e.stopPropagation()} className='absolute -bottom-16 right-0 p-2 z-30 shadow-md shadow-gray-200 bg-white w-auto h-auto rounded-lg flex flex-col gap-2'>
              <button className='flex items-center justify-start gap-2' onClick={modal}>
                <MdOutlineModeEdit size={20}/> Edit
              </button>
              {!fieldOffice.dvItems > 0 && (
                <button className='flex items-center justify-start gap-2' disabled={isLoading} onClick={deleteFO}>
                  <MdDeleteOutline size={20} color='red'/> Delete
                </button>
              )}
            </div>
          </>
        )}
      </div>
      {FieldOfficeModal && (
        <>
          <div className="fixed inset-0 z-40 bg-black opacity-50" onClick={modal} />
          <div className="fixed z-50 left-0 top-0 w-full h-full flex items-center justify-center">
            <AddNewFieldOffice modal={modal} ASANo={ASANo} fieldOffice={fieldOffice} fieldOfficeID={fieldOfficeID} flag={true} remainingASA={remainingASA} test={test} tabs={tabs}/>
          </div>
        </>
      )}
      {viewProjectFlag && (
        <>
          <div className="fixed inset-0 z-20 bg-black opacity-50"/>
          <div className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
            <ViewProject modal={viewProject} projectName={fieldOffice.projectName} ASANo={ASANo} tabStatus={fieldOffice.tabStatus} Cluster={Cluster}/>
          </div>
        </>
      )}
      {isLoading && (
        <LargeLoader/>
      )}
    </div>
  )
}

FieldOffices.propTypes = {
    fieldOffice: PropTypes.object.isRequired,
    ASANo: PropTypes.string.isRequired,
    fieldOfficeID: PropTypes.string.isRequired,
    flag: PropTypes.bool.isRequired,
    openModal: PropTypes.func.isRequired,
    remainingASA: PropTypes.number.isRequired 
}

export default FieldOffices