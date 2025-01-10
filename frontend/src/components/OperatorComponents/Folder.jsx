import EmptyFolder from '../../assets/icons/emptyfolder.png'
import FolderWithItems from '../../assets/icons/folder.png'

import { MdDeleteOutline, MdOutlineModeEdit } from "react-icons/md";

import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import { useFundingHook } from '../../hooks/useFundingHook';

import LargeLoader from '../LargeLoader';

import AddControlBook from "./AddControlBook"

const Folder = ({ASANo, controlBook}) => {
    const [controlBookFlag, setControlBookFlag] = useState(false)
    const [deletable, setIsDeletable] = useState(true)
    console.log(controlBook[1])
    console.log(ASANo)
    const navigate = useNavigate()
    
    const { deleteControlBook, isLoading, error } = useFundingHook()

    const subcollectionCounts = () => controlBook[1].fieldOffices ? Object.entries(controlBook[1].fieldOffices).length : 0

    const modal = (e) => {
      e.stopPropagation()
      setControlBookFlag(!controlBookFlag)
    }

    const deleteCB = async (e) => {
      e.stopPropagation()
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
                const res = await deleteControlBook(controlBook[1]?.ASANo)
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

    const isDeletable = () => {
      const fieldOffices = controlBook[1]?.fieldOffices ?? {};
      const ans = Object.entries(fieldOffices).filter(([, fieldOffice]) =>
          fieldOffice?.dvCollection && Object.entries(fieldOffice.dvCollection).length > 0
      );
      const deletion = ans.length > 0;
      setIsDeletable(deletion);
  };

  useEffect(() => {
    isDeletable()
  }, [controlBook])

  return (
    <div
      onClick={() => navigate(`${controlBook[1].ASANo}`)}
      className="h-56 rounded-lg p-1 text-gray-500 hover:bg-gray-200 transition-all duration-100 cursor-pointer"
    >
      <div className="w-full h-[70%] flex items-center justify-center">
        <img
          src={
            Object.entries(controlBook[1].fieldOffices).length > 0
              ? FolderWithItems
              : EmptyFolder
          }
          alt="folder"
          className="w-1/2 h-full"
        />
      </div>
      <div className='w-full h-[30%]'>
        <div className="px-4 flex items-center justify-between">
          <p className="font-bold">
            {controlBook[1] ? controlBook[1].ASANo.replace("|", " ") : ""}
          </p>
          <div className="flex items-center justify-center gap-2">
            <button onClick={modal}>
              <MdOutlineModeEdit size={18} />
            </button>
            {!deletable && (
              <button disabled={isLoading} onClick={deleteCB}>
                <MdDeleteOutline size={20} color="red" />
              </button>
            )}
          </div>
        </div>
        <div className="px-4">
          <p className="text-sm">{`${subcollectionCounts()} item(s)`}</p>
        </div>
      </div>
      {controlBookFlag && (
        <>
          <div className="fixed inset-0 z-40 bg-black opacity-50" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed z-50 left-0 top-0 w-full h-full flex items-center justify-center"
          >
            <AddControlBook
              modal={modal}
              flag={true}
              controlBook={controlBook}
              ASANo={ASANo}
            />
          </div>
        </>
      )}
      {isLoading && (
        <LargeLoader/>
      )}
    </div>
  )
}

Folder.propTypes = {
    controlBook: PropTypes.object.isRequired,
    ASANo: PropTypes.string.isRequired,
}

export default Folder