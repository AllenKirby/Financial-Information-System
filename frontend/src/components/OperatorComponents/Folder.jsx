import EmptyFolder from '../../assets/icons/emptyfolder.png'
import FolderWithItems from '../../assets/icons/folder.png'
import { BsThreeDots } from "react-icons/bs";
import { GrDocumentUpdate } from "react-icons/gr";
import { MdDeleteOutline } from "react-icons/md";

import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useFundingHook } from '../../hooks/useFundingHook';
import AddControlBook from "./AddControlBook"

const Folder = ({controlBook}) => {
    const [optionFlag, setOptionFlag] = useState(false)
    const [controlBookFlag, setControlBookFlag] = useState(false)
    const navigate = useNavigate()
    const { deleteControlBook, isLoading, error } = useFundingHook()

    const subcollectionCounts = () => controlBook.subcollection ? Object.entries(controlBook.subcollection).length : 0

    const modal = () => {
      setOptionFlag(false)
      setControlBookFlag(!controlBookFlag)
    }

    const openOption = (e) => {
        e.stopPropagation()
        setOptionFlag(!optionFlag)
    }

    const deleteCB = async () => {
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
                const res = await deleteControlBook(controlBook.ASANo)
              if (res) {
                Swal.fire({
                  title: "Deleted!",
                  text: "Control Book has been deleted.",
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
    <div onClick={() => navigate(`${controlBook.ASANo}`)} className="h-1/2 rounded-lg hover:bg-gray-200 p-2 transition-all duration-100 cursor-pointer">
      <div className='w-full h-[80%] flex items-center justify-center'>
        <img 
            src={Object.entries(controlBook.subcollection).length > 0 ? FolderWithItems : EmptyFolder} 
            alt="folder" 
            className='w-auto h-full'/>
      </div>
      <div className='px-4 flex items-center justify-between'>
        <p className='font-bold'>{controlBook ? controlBook.ASANo.replace("|", " ") : ''}</p>
        <div className='relative'>
          <button 
              className='cursor-pointer'
              onClick={openOption}>
              <BsThreeDots size={20}/>
          </button>
          {optionFlag && (
            <>
              <div className="fixed inset-0 z-10" onClick={openOption} />
              <div onClick={(e) => e.stopPropagation()}  className="absolute shadow-sm shadow-gray-200 bg-white rounded-lg z-20 right-0 top-5 w-auto h-auto flex flex-col gap-1">
                <button onClick={modal} className='w-full h-auto flex items-center justify-center gap-3 py-1 pr-3 pl-5 font-semibold hover:bg-gray-200 rounded-lg'>
                  <GrDocumentUpdate size={18} color='gray'/> Update
                </button>
                <button disabled={isLoading} onClick={deleteCB} className='w-full h-auto flex items-center justify-center gap-3 py-1 px-3 font-semibold hover:bg-gray-200 rounded-lg'>
                  <MdDeleteOutline size={20} color='gray'/> Delete
                </button>
              </div>
            </>
          )}
        </div>
        </div>
      <div className='px-4'>
          <p className='text-sm'>{subcollectionCounts > 1 ? `${subcollectionCounts()} items` : `${subcollectionCounts()} item`}</p>
      </div>
      {controlBookFlag && (
        <>
          <div className="fixed inset-0 z-40 bg-black opacity-50" />
          <div onClick={(e) => e.stopPropagation()} className="fixed z-50 left-0 top-0 w-full h-full flex items-center justify-center">
            <AddControlBook modal={modal} flag={true} controlBook={controlBook}/>
          </div>
        </>
      )}
    </div>
  )
}

Folder.propTypes = {
    controlBook: PropTypes.object.isRequired
}

export default Folder