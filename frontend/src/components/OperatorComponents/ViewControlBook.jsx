import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"

import { IoAddOutline } from "react-icons/io5";
import { IoMdArrowRoundBack } from "react-icons/io";
import { GrCircleInformation } from "react-icons/gr";

import AddNewFieldOffice from "./AddNewFieldOffice";
import FieldOffices from "./FieldOffices";
import ControlBookReport from "./ControlBookReport";

const ViewControlBook = () => {
  const { id } = useParams()
  const controlBooks = useSelector((state) => state.controlBook)
  
  const [ControlBook, setControlBook] = useState({key: '', data: {}})
  const [FieldOfficeModal, setFieldOfficeModal] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [reportFlag, setReportFlag] = useState(false)

  const modal = () => setFieldOfficeModal(!FieldOfficeModal)

  const showReport = () => setReportFlag(!reportFlag)

  const formatToPeso = (value) => {
      return new Intl.NumberFormat('en-PH', {
          style: 'currency',
          currency: 'PHP',
      }).format(value);
  };


  useEffect(() => {
    if(controlBooks){
      const selectedControlBook = Object.entries(controlBooks).find(([, controlBook]) => controlBook.ASANo === id)
      const selectedkey = Object.keys(controlBooks).find((key) => controlBooks[key].ASANo === id)
      if(selectedControlBook) {
        console.log(selectedControlBook[1])
        setControlBook({key: selectedkey, data: selectedControlBook[1]})
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
      {!reportFlag ? (
        <>
          <div className="w-full h-[10%] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => window.history.back()}
                className="px-5 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-100"><IoMdArrowRoundBack size={25}/></button>
              <p className="font-bold text-3xl text-fundingBlueGreen">{ControlBook.data.ASANo ? ControlBook.data.ASANo.replace("|", " ") : ''}</p>
              <div className="relative w-auto h-auto">
                <GrCircleInformation 
                  size={28} 
                  color="gray"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}/>
                  {showTooltip && (
                    <>
                      <div className="absolute w-8 h-8 -top-[2px] -right-10 rotate-45 rounded bg-white shadow-lg shadow-gray border-[1px]"/>
                      <div className="absolute -right-[300px] -top-11 rounded-lg bg-white w-72 shadow-gray shadow-lg border-[1px]">
                        <h1 className="font-semibold w-full text-center text-white text-lg bg-fundingBlueGreen rounded-t-lg py-2">Full Information</h1>
                        <div className="w-full h-full p-3">
                          <p className="font-bold text-sm mt-1">Amount: <span className="font-normal">{formatToPeso(ControlBook.data.TotalASA)}</span></p>
                          <p className="font-bold text-sm mt-1">SARO No: <span className="font-normal">{ControlBook.data.SARONo}</span></p>
                          <p className="font-bold text-sm mt-1">Date of ASA: <span className="font-normal">{convertDate(ControlBook.data.DateOfAsa)}</span></p>
                          <p className="font-bold text-sm mt-1">Description: <span className="font-normal">{ControlBook.data.description}</span></p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="px-5">
                <button 
                  className="bg-fundingBlueGreen text-white px-5 py-2 rounded-lg"
                  onClick={showReport}
                  >Generate Report</button>
              </div>
            </div>
            <div className="w-full h-[89%]">
              <div className="w-full h-1/4 flex gap-2">
                <div className="w-1/4 h-full rounded-lg p-3 border-2">
                  <div className="w-full h-1/4">
                    <p className="font-semibold text-sm">Available ASA Budget</p>
                  </div>
                  <div className="w-full h-3/4 flex items-center justify-center">
                    <p className="font-semibold text-2xl text-fundingBlueGreen">{formatToPeso(ControlBook.data.leftBudget)}</p>
                  </div>
                </div>
                <div className="w-1/4 h-full rounded-lg p-3 border-2">
                  <div className="w-full h-1/4">
                    <p className="font-semibold text-sm">Remaining ASA Balance</p>
                  </div>
                  <div className="w-full h-3/4 flex items-center justify-center">
                    <p className="font-semibold text-2xl text-fundingBlueGreen">{formatToPeso(ControlBook.data.RO)}</p>
                  </div>
                </div>
                <div className="w-1/4 h-full rounded-lg border-2 p-3">
                  <div className="w-full h-1/4">
                    <p className="font-semibold text-sm">Total Spending</p>
                  </div>
                  <div className="w-full h-3/4 flex items-center justify-center">
                    <p className="font-semibold text-2xl text-fundingBlueGreen">{formatToPeso(ControlBook.data.FO)}</p>
                  </div>
                </div>
                <button onClick={modal} className="w-1/4 h-full rounded-lg p-2 flex items-center justify-center text-white bg-fundingBlueGreen">
                <div className="flex flex-col">
                    <div className="w-full flex items-center justify-center">
                      <IoAddOutline size={40}/>
                    </div>
                    <p className="font-semibold">New Project</p>
                </div>
                </button>
              </div>
              <div className="w-full h-3/4">
                <div className="w-full h-auto my-2 px-5">
                  <p className="font-semibold my-1">Projects({ControlBook.data.fieldOffices ? Object.entries(ControlBook.data.fieldOffices).length : 0})</p>
                </div>
                <div className="w-full h-[310px] overflow-auto border-2 rounded-lg p-1">
                    {ControlBook.data.fieldOffices && Object.entries(ControlBook.data.fieldOffices).length > 0 ? (
                      Object.entries(ControlBook.data.fieldOffices).map(([key,fieldOffice]) => (
                        <FieldOffices key={key} fieldOfficeID={key} fieldOffice={fieldOffice} ASANo={ControlBook.key}/>
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
                  <AddNewFieldOffice modal={modal} ASANo={ControlBook.key} flag={false} remainingASA={ControlBook.data.leftBudget}/>
                </div>
              </>
            )}
        </>
      ) : (
        <ControlBookReport showReport={showReport} reportData={ControlBook.data}/>
      )}
    </div>
  )
}

export default ViewControlBook