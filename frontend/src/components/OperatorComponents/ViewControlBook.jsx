import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"

import { IoAddOutline } from "react-icons/io5";
import AddNewFieldOffice from "./AddNewFieldOffice";
import FieldOffices from "./FieldOffices";

const ViewControlBook = () => {
  const { id } = useParams()
  const controlBooks = useSelector((state) => state.controlBook)
  const [ControlBook, setControlBook] = useState({})
  const [FieldOfficeModal, setFieldOfficeModal] = useState(false)

  const modal = () => setFieldOfficeModal(!FieldOfficeModal)

  useEffect(() => {
    if(controlBooks){
      const selectedControlBook = Object.entries(controlBooks).find(([, controlBook]) => controlBook.ASANo === id)
      if(selectedControlBook) {
        console.log('selected',selectedControlBook[1].subcollection)
        setControlBook(selectedControlBook[1])
      } else {
        console.log('No Control Book Found')
      }
    } else {
      console.log('Control Books Redux is Empty')
    }

  }, [controlBooks, id])

  const convertDate = (dateStr) => {
    const date = new Date(dateStr);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit"
    });
  }

  return (
    <div className="w-full h-full">
      <div className="w-full h-[10%]">
        <button 
          onClick={() => window.history.back()}
          className="px-5 py-2 rounded-lg border-2 font-semibold">Back</button>
      </div>
      <div className="w-full h-[89%]">
        <div className="w-full h-1/3 flex gap-2">
          <div className="w-[30%] h-full rounded-lg p-3 text-white bg-fundingBlueGreen">
            <p className="font-bold text-xl">ASA No: {ControlBook.ASANo}</p>
            <p className="font-bold text-sm mt-1">SARO No: <span className="font-normal">{ControlBook.SARONo}</span></p>
            <p className="font-bold text-sm mt-1">Date of ASA: <span className="font-normal">{convertDate(ControlBook.DateOfAsa)}</span></p>
            <p className="font-bold text-sm mt-1">Description: <span className="font-normal">{ControlBook.description}</span></p>
          </div>
          <div className="w-1/4 h-full rounded-lg p-3 bg-fundingGray">
            <div className="w-full h-1/4">
              <p className="font-semibold">Total ASA</p>
            </div>
            <div className="w-full h-3/4 flex items-center justify-center">
              <p className="font-semibold text-3xl">₱{ControlBook.TotalASA}.00</p>
            </div>
          </div>
          <div className="w-1/4 h-full rounded-lg border-2 p-2">
            <div className="w-full h-1/4">
              <p className="font-semibold text-sm">Total Amount of each Field Offices</p>
            </div>
            <div className="w-full h-3/4 flex items-center justify-center">
              <p className="font-semibold text-3xl">₱300000.00</p>
            </div>
          </div>
          <button onClick={modal} className="w-[20%] h-full rounded-lg p-2 flex items-center justify-center bg-gray-200">
           <div className="flex flex-col">
              <div className="w-full flex items-center justify-center">
                <IoAddOutline size={40} color="#317773"/>
              </div>
              <p className="font-semibold">Add New Field Office</p>
           </div>
          </button>
        </div>
        <div className="w-full h-2/3">
          <div className="w-full h-[10%] my-3 px-5">
            <p className="font-semibold my-1">Field Offices({ControlBook.subcollection ? Object.entries(ControlBook.subcollection).length : 0})</p>
            <hr />
          </div>
          <div className="w-full h-[85%]">
              {ControlBook.subcollection && Object.entries(ControlBook.subcollection).length > 0 ? (
                Object.entries(ControlBook.subcollection).map(([key,fieldOffice]) => (
                  <FieldOffices key={key} fieldOffice={fieldOffice}/>
                ))
              ) : (
                <div className="flex items-center justify-center w-full h-full text-xl font-semibold">No Field Offices Found</div>
              )}
          </div>
        </div>
      </div>
      {FieldOfficeModal && (
        <>
          <div className="fixed inset-0 z-20 bg-black opacity-50" onClick={modal} />
          <div className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
            <AddNewFieldOffice modal={modal} ASANo={ControlBook.ASANo} />
          </div>
        </>
      )}
    </div>
  )
}

export default ViewControlBook