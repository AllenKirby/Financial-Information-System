import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"

import { IoAddOutline } from "react-icons/io5";
import { IoMdArrowRoundBack } from "react-icons/io";
import { GrCircleInformation } from "react-icons/gr";
import { FiFileText } from "react-icons/fi";

import AddNewFieldOffice from "./AddNewFieldOffice";
import FieldOffices from "./FieldOffices";
import ControlBookReport from "./ControlBookReport";
import AddTab from "./AddTab"

import {useAuthContext} from '../../hooks/useAuthContext'

const ViewControlBook = () => {
  const { id } = useParams()
  const controlBooks = useSelector((state) => state.controlBook)
  const {user} = useAuthContext()   
  const [ControlBook, setControlBook] = useState({key: '', data: {}})
  const [FieldOfficeModal, setFieldOfficeModal] = useState(false)
  const [modalTab, setModalTab] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [reportFlag, setReportFlag] = useState(false)

  const modal = () => setFieldOfficeModal(!FieldOfficeModal)
  const tabModal = () => setModalTab(!modalTab)

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
        setControlBook({key: selectedkey, data: selectedControlBook[1]})
      } else {
        console.log('No Control Book Found')
      }
    } else {
      console.log('Control Books Redux is Empty')
    }

  }, [controlBooks, id])
  
  const sortTimePassedDesc = (docu) => {
    if (docu && Object.keys(docu).length > 0) {
      const sortedEntries = Object.entries(docu).sort(([, a], [, b]) => {
        const parsedA = a.createdAt ? a.createdAt : null;
        const parsedB = b.createdAt ? b.createdAt : null;
        return new Date(parsedB) - new Date(parsedA)
      });
      return Object.fromEntries(sortedEntries)
    } else {
      return {} 
    }
  }

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
                className="px-5 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-100"><IoMdArrowRoundBack size={20}/></button>
              <p className={`${user?.role === '3' ? 'text-fundingBlueGreen' : 'text-preparerPrimary'} font-bold text-base sm:text-xl lg:text-2xl text-fundingBlueGreen`}>{ControlBook.data.ASANo ? ControlBook.data.ASANo.replace("|", " ").split('!')[0] : ''}</p>
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
                        <h1 className={`${user?.role === '3' ? 'bg-fundingBlueGreen' : 'bg-preparerPrimary'} font-semibold w-full text-center text-white text-lg bg-fundingBlueGreen rounded-t-lg py-2`}>Full Information</h1>
                        <div className="w-full h-full p-3">
                          <p className="font-bold text-sm mt-1">Amount: <span className="font-normal">{formatToPeso(ControlBook.data.TotalASA)}</span></p>
                          <p className="font-bold text-sm mt-1">SARO No: <span className="font-normal">{ControlBook.data.SARONo}</span></p>
                          <p className="font-bold text-sm mt-1">Fund Cluster: <span className="font-normal">{ControlBook.data.FundCluster || '--' }</span></p>
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
                  className={`${user?.role === '3' ? 'border-fundingBlueGreen bg-fundingBlueGreen hover:text-fundingBlueGreen' : 'border-preparerPrimary bg-preparerPrimary hover:text-preparerPrimary'} text-white px-5 py-2 rounded-lg 2xl:text-lg border-2 hover:bg-white transition-all duration-150`}
                  onClick={showReport}
                  ><FiFileText className="block sm:hidden"/> <span className="hidden sm:block">Generate Report</span></button>
              </div>
            </div>
            <div className="w-full h-[90%] flex flex-col">
              <div className="w-full h-auto flex flex-col sm:flex-row gap-2">
                <div className="w-full sm:w-1/2 flex gap-2">
                  <div className="w-1/2 h-full rounded-lg p-3 border-2 ">
                    <div className="w-full mb-2">
                      <p className="font-semibold text-xs 2xl:text-lg">IMO Budget</p>
                    </div>
                    <div className="w-full flex items-center justify-center">
                      <p className={`${user?.role === '3' ? 'text-fundingBlueGreen' : 'text-preparerPrimary'} font-semibold lg:text-2xl 2xl:text-3xl`}>{formatToPeso(ControlBook.data.leftBudget)}</p>
                    </div>
                  </div>
                  <div className="w-1/2 h-full rounded-lg p-3 border-2">
                    <div className="w-full mb-2">
                      <p className="font-semibold text-xs 2xl:text-lg">FO Balance</p>
                    </div>
                    <div className="w-full flex items-center justify-center">
                      <p className={`${user?.role === '3' ? 'text-fundingBlueGreen' : 'text-preparerPrimary'} font-semibold lg:text-2xl 2xl:text-3xl`}>{formatToPeso(ControlBook.data.RO)}</p>
                    </div>
                  </div>
                </div>
                <div className="w-full sm:w-1/2 flex flex-col sm:flex-row gap-2">
                  <div className="w-full sm:w-1/2 h-full rounded-lg border-2 p-3">
                    <div className="w-1/2 mb-2">
                      <p className="font-semibold text-xs 2xl:text-lg">Total Spending</p>
                    </div>
                    <div className="w-full flex items-center justify-center">
                      <p className={`${user?.role === '3' ? 'text-fundingBlueGreen' : 'text-preparerPrimary'} font-semibold lg:text-2xl 2xl:text-3xl`}>{formatToPeso(ControlBook.data.FO)}</p>
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2 h-auto flex flex-row md:flex-col gap-2">
                    <button onClick={modal} className={`${user?.role === '3' ? 'border-fundingBlueGreen bg-fundingBlueGreen hover:text-fundingBlueGreen' : 'border-preparerPrimary bg-preparerPrimary hover:text-preparerPrimary'} w-1/2 sm:w-full h-full border-2 rounded-lg p-2 flex items-center justify-center text-white hover:bg-white transition-all duration-150`}>
                      <div className="flex flex-row items-center justify-center gap-2">
                        <IoAddOutline size={30}/>
                        <p className="font-semibold lg:text-base 2xl:text-lg">New Project</p>
                      </div>
                    </button>
                    <button onClick={tabModal} className={`${user?.role === '3' ? 'border-fundingBlueGreen text-fundingBlueGreen hover:bg-fundingBlueGreen' : 'border-preparerPrimary text-preparerPrimary hover:bg-preparerPrimary'} w-1/2 sm:w-full h-full rounded-lg p-2 flex border-2 items-center justify-center hover:text-white transition-all duration-150`}>
                      <div className="flex flex-row items-center justify-center gap-2">
                        <IoAddOutline size={30}/>
                        <p className="font-semibold lg:text-base 2xl:text-lg">Add Tab</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full h-auto bg-gray-100 rounded-lg mt-2 py-1 pr-6 hidden lg:flex items-center justify-center">
                <div className="w-[95%] text-sm h-full flex items-center justify-center">
                  <div className="w-1/4 h-full py-1 flex items-center justify-center">
                    <p className="font-semibold">Field Office</p>
                  </div>
                  <div className="w-1/4 h-full py-1 flex items-center justify-center">
                    <p className="font-semibold">Project Name</p>
                  </div>
                  <div className="w-1/4 h-auto py-1 flex flex-col">
                    <div className="w-full h-auto text-center">
                      <p className="font-semibold">ASA</p>
                    </div>
                    <div className="w-full h-auto flex items-center justify-center">
                      <div className="w-1/3 text-center ">
                        <p className="font-semibold">Beginning</p>
                      </div>
                      <div className="w-1/3 text-center ">
                        <p className="font-semibold">Utilized</p>
                      </div>
                      <div className="w-1/3 text-center">
                        <p className="font-semibold">Balance</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-1/4 h-auto py-1 flex flex-col">
                    <div className="w-full h-auto text-center">
                      <p className="font-semibold">Cash</p>
                    </div>
                    <div className="w-full h-auto flex items-center justify-center">
                      <div className="w-1/3 text-center">
                        <p className="font-semibold">Beginning</p>
                      </div>
                      <div className="w-1/3 text-center">
                        <p className="font-semibold">Disbursed</p>
                      </div>
                      <div className="w-1/3 text-center">
                        <p className="font-semibold">Balance</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[5%] h-full"></div>
              </div>
              <div className="w-full flex-1 overflow-y-auto py-2">
                {ControlBook.data.fieldOffices && Object.entries(ControlBook.data.fieldOffices).length > 0 ? (
                  Object.entries(sortTimePassedDesc(ControlBook.data.fieldOffices)).map(([key,fieldOffice], index) => (
                    <FieldOffices key={key} index={index} fieldOfficeID={key} fieldOffice={fieldOffice} ASANo={ControlBook.key} remainingASA={ControlBook.data.leftBudget} test={ControlBook.data.fieldOffices} tabs={ControlBook.data.tabs}/>
                  ))
                ) : (
                  <div className="flex items-center justify-center w-full h-full font-semibold">No Field Offices Found</div>
                )}
              </div>
            </div>
            {FieldOfficeModal && (
              <>
                <div className="fixed inset-0 z-20 bg-black opacity-50"/>
                <div className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
                  <AddNewFieldOffice modal={modal} ASANo={ControlBook.key} flag={false} remainingASA={ControlBook.data.leftBudget} tabs={ControlBook.data.tabs} cbFO={ControlBook.data.FO} test={ControlBook.data.fieldOffices}/>
                </div>
              </>
            )}
            {modalTab && (
              <>
                <div className="fixed inset-0 z-20 bg-black opacity-50 border-2 px-5 py-2 rounded-lg text-white font-semibold transition-all duration-150"/>
                <div className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
                  <AddTab modal={tabModal} ASANo={ControlBook.key} currTabs={ControlBook.data.tabs} remainingASA={ControlBook.data.TotalASA}/>
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