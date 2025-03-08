import { useAuthContext } from "../../hooks/useAuthContext"
import { useFundingHook } from "../../hooks/useFundingHook";

import Comments from '../Shared/Comments'
import LargeLoader from "../Loaders/LargeLoader";
import DisbursementVoucher from "../EditorComponents/DisbursementVoucher";
import AddComment from "./AddComment";

import Swal from "sweetalert2";

import { RxPaperPlane } from "react-icons/rx";
import { FiEdit3 } from "react-icons/fi";
import { MdDelete  } from "react-icons/md";
import { IoMdArrowRoundBack  } from "react-icons/io";
import { BsArrowLeft } from "react-icons/bs";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useApproverHook } from "../../hooks/useApproverHook";

const ViewBUR = () => {
  const { user } = useAuthContext()
  const { id } = useParams()
  const [selectedBUR, setSelectedBUR] = useState(null)
  const BUR = useSelector((state) =>  state.burRecords)
  const [fontColor, setFontColor] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [type, setType] = useState('')
  const [modalComment, setModalComment] = useState(false)
  const [returnFlag, setReturnFlag] = useState(false)
  const permission = useSelector((state) => state.permission)

  const {handleBURDeletion, isLoading, error} = useFundingHook()
  const { approveBUR, isLoading: isLoadingApprover, error: errorApprover } = useApproverHook()

  const modal = () => setIsModalOpen(!isModalOpen)

  const openModal = (type) => {
    setType(type)
    setModalComment(true)
  }
  const closeCommentModal = () => {
    setModalComment(false)
  } 
  
  useEffect(() => {
    const selectedDoc = BUR.filter((item) => item.id === id)
    setSelectedBUR(selectedDoc[0])
  }, [BUR, id])

  useEffect(() => {
    if(user && user.role) {
      switch(user.role) {
        case '4': 
          setFontColor('text-preparerPrimary')
          break
        case '3': 
          setFontColor('text-fundingBlueGreen')
          break
        case '2': 
          setFontColor('text-BOGreen')
          break
        case '1': 
          setFontColor('text-customgreen')
          break
      
      }
    }
  }, [user])

  const formatToPeso = (value) => {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
    }).format(value);
  };

  const deleteBUR = async() => {
    const res = await handleBURDeletion(selectedBUR.id)
    if(res){
      Swal.fire({
        title: "Saved",
        text: "BUR Successfully Deleted!",
        icon: "success",
        confirmButtonColor: "#009933"
      });
      window.history.back()
    } else {
      Swal.fire({
        title: "Error",
        text: {error},
        icon: "error",
        confirmButtonColor: "#FF0000"
      });
    }
  }

  const approve = async() => {
      const data = {
        payee: selectedBUR.payee
      }
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#009933",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Approve it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = await approveBUR(selectedBUR.id, data)
          if (res) {
            Swal.fire({
              title: "Approved!",
              text: "BUR has been Approved.",
              icon: "success",
            });
            window.history.back()
          }
          else{
            Swal.fire({
              title: "Error!",
              text: {errorApprover},
              icon: "error",
            });
          }
        }
      });
    }

  const projects = selectedBUR?.amount.map((item) => item)
  const amounts = selectedBUR?.amount.map((item) => item.amount)
  const amountDue = amounts?.reduce((sum, num) => sum + Number(num), 0);
  //console.log(selectedBUR?.comments)

  return (
    <div className="w-full sm:w-3/4 lg:w-3/5 h-full sm:h-5/6 flex flex-col bg-white sm:rounded-lg">
      <div className="w-full h-auto flex items-center justify-between px-5 py-3 border-b-2">
        <div>
          <button 
          className='w-auto px-5 py-2 rounded-lg text-gray-500 hover:bg-gray-200 transition-all duration-100'
            onClick={() => window.history.back()}><IoMdArrowRoundBack size={20}/></button>
        </div>
        <div className='flex items-center justify-center gap-2'>
          {user?.role === '1' && selectedBUR?.status === 'For Approval' && (
            <div className="w-auto h-auto relative">
              <button onClick={() => setReturnFlag(!returnFlag)} className="w-auto px-5 rounded-lg py-3 sm:py-2.5 text-red-500 font-semibold transition-all duration-150 flex items-center justify-center gap-2"><BsArrowLeft/> Return</button>
              {returnFlag && (
                <>
                  <div className="fixed inset-0 z-0" onClick={() => setReturnFlag(!returnFlag)}/>
                  <div className='absolute w-24 sm:w-28 md:w-32 lg:w-full bg-white right-0 top-12 z-0 p-1 border-[1px] text-xs lg:text-sm'>
                    <div onClick={() => openModal('ReturnToFundingFromApprover')} className='text-center mt-1 hover:bg-slate-100 cursor-pointer py-1 text-sm'>Funding</div>
                    <div onClick={() => openModal('ReturnToBOFromApprover')} className='text-center mt-1 hover:bg-slate-100 cursor-pointer py-1 text-sm'>Budget Officer</div>
                  </div>
                </>
              )}
            </div>
          )}
          {user?.role === '2' && selectedBUR?.status === 'Under Review' && (
            <button
              onClick={() => openModal('ReturnBURFromBO')}
              className="w-auto px-5 rounded-lg py-3 sm:py-2.5 text-red-500 font-semibold transition-all duration-150 flex items-center justify-center gap-2"
            >
              <BsArrowLeft size={20}/> <span className="hidden sm:block ">Return to Funding</span>
            </button>
          )}
          {user?.role === '3' || permission?.data?.permission && permission?.data?.roleName === 'Preparer' && (
            <>
              {selectedBUR?.status === 'Drafting' && (
                <button 
                  onClick={deleteBUR}
                  className="text-red-500 px-5">
                    <MdDelete size={20}/>
                </button>
              )}
              <button
                onClick={modal}
                className={`w-auto rounded-lg px-5 py-2 border-2 transition-all duration-150 ${user?.role === '3' ? 'border-fundingBlueGreen text-fundingBlueGreen hover:bg-fundingBlueGreen hover:text-white': 'border-BOGreen text-BOGreen'}`}
                >
                  <FiEdit3 size={20}/>
              </button>
            </>
          )}
          {(user?.role === '3' || user?.role === '2' && !permission?.data?.permission && permission?.data?.roleName === 'Budget Officer' || permission?.data?.permission && permission?.data?.roleName === 'Preparer') && (
            <button
              onClick={() => openModal(user?.role === '3' ? 'SubmitBURToBO' : 'SubmitBURToApprover')}
              className={`w-auto px-5 py-2 rounded-lg bg-fundingBlueGreen border-2 border-fundingBlueGreen hover:bg-white hover:text-fundingBlueGreen text-white transition-all duration-150`}
              >
              <RxPaperPlane size={20} className="block lg-landscape:hidden"/><span>Submit</span>
            </button>
          )}
          {(user?.role === '1' || user?.role === '2' && permission?.data?.permission && permission?.data?.roleName === 'Budget Officer' && selectedBUR?.status === 'Under Review' || selectedBUR?.status === 'For Approval') && (
            <button
              onClick={approve}
              className={`w-auto px-5 py-2 rounded-lg ${user?.role === '2' ? 'bg-fundingBlueGreen border-fundingBlueGreen hover:text-fundingBlueGreen' : 'bg-customgreen border-customgreen hover:text-customgreen'} border-2 hover:bg-white text-white transition-all duration-150`}
              >Approve
            </button>
          )}
        </div>
      </div>
      <div className="w-full flex-1 overflow-y-auto p-5">
        <div className='mb-2'>
          <p className={`font-bold text-xl 2xl:text-2xl ${fontColor}`}>{selectedBUR?.payee}</p>
        </div>
        <div className='w-full h-auto'>
          <div className='flex flex-col'>
            <div className='w-full py-1'>
              <h1 className='text-lg 2xl:text-xl font-semibold'>Payee Information</h1>
            </div>
            <div className='py-1 flex flex-col px-2 text-sm sm:text-base 2xl:text-lg'>
              <div className='w-full h-auto flex items-center justify-center'>
                <p className='text-gray-500 w-2/5'>Office</p>
                <p className='text-customFontColor font-medium w-3/5'>{selectedBUR?.office}</p>
              </div>
              <div className='w-full h-auto flex items-center justify-center'>
                <p className='text-gray-500 w-2/5'>Address</p>
                <p className='text-customFontColor font-medium w-3/5'>{selectedBUR?.address}</p>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col'>
          <div className='w-full py-1'>
            <h1 className='text-lg 2xl:text-xl font-semibold'>Disbursement Voucher Details</h1>
          </div>
          <div className='py-1 flex flex-col px-2 text-sm sm:text-base 2xl:text-lg'>
            <div className='w-full h-auto flex items-center justify-center'>
              <p className='text-gray-500 w-2/5'>Date</p>
              <p className='text-customFontColor font-medium w-3/5'>{selectedBUR?.date}</p>
            </div>
            <div className='w-full h-auto flex items-center justify-center'>
              <p className='text-gray-500 w-2/5'>GAA</p>
              <p className='text-customFontColor font-medium w-3/5'>{selectedBUR?.GAA}</p>
            </div>
            <div className='w-full h-auto flex items-center justify-center'>
              <p className='text-gray-500 w-2/5'>No.</p>
              <p className='text-customFontColor font-medium w-3/5'>{selectedBUR?.No}</p>
            </div>
          </div>
        </div>
        <div className='flex flex-col'>
          <div className='w-full py-1'>
            <h1 className='text-lg 2xl:text-xl font-semibold'>Financial Details</h1>
          </div>
          <div className='py-1 flex flex-col px-2 text-sm sm:text-base 2xl:text-lg'>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='text-gray-500 w-2/5'>Amount</p>
              <div className="w-3/5 flex flex-col">
                {projects?.map((item, index) => (
                  <li key={index} className='text-customFontColor font-medium'>{`${item?.title} - ${formatToPeso(item?.amount)}`}</li>
                ))}
              </div>
            </div>
            <div className='w-full h-auto flex items-center justify-center'>
              <p className='text-gray-500 w-2/5'>Amount Due</p>
              <p className='text-customFontColor font-medium w-3/5'>{`${formatToPeso(amountDue)}`}</p>
            </div>
          </div>
        </div>
        <div className='flex flex-col'>
          <div className='w-full py-1'>
            <h1 className='text-lg 2xl:text-xl font-semibold'>Other Information</h1>
          </div>
          <div className='py-1 flex flex-col px-2 text-sm sm:text-base 2xl:text-lg'>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='text-gray-500 w-2/5'>Responsibility Center</p>
              <p className='text-customFontColor font-semibold w-3/5'>{selectedBUR?.resCenter}</p>
            </div>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='text-gray-500 w-2/5'>MFO/PAP</p>
              <p className='text-customFontColor font-semibold w-3/5'>{selectedBUR?.MFOPAP}</p>
            </div>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='text-gray-500 w-2/5'>UACS Code</p>
              <p className='text-customFontColor font-semibold w-3/5'>{selectedBUR?.uacsCode}</p>
            </div>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='text-gray-500 w-2/5'>A. Certified</p>
              <p className='text-customFontColor font-semibold w-3/5'>{`${selectedBUR?.NFNameA} - ${selectedBUR?.NFOfficeA}`}</p>
            </div>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='text-gray-500 w-2/5'>B. Certified</p>
              <p className='text-customFontColor font-semibold w-3/5'>{`${selectedBUR?.NFNameB} - ${selectedBUR?.NFOfficeB}`}</p>
            </div>
          </div>
        </div>
        <div className='flex flex-col'>
          <div className='w-full py-1'>
            <h1 className='text-lg 2xl:text-xl font-semibold'>Action Log</h1>
          </div>
          <div className='py-1 flex flex-col px-2 text-sm sm:text-base 2xl:text-lg'>
            <div className='w-full h-auto flex items-start justify-centerl'>
              <p className='text-gray-500 w-2/5'>Created By</p>
              <p className='text-customFontColor font-medium w-3/5'>{selectedBUR?.createdBy}</p>
            </div>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='text-gray-500 w-2/5'>Submitted By</p>
              <p className='text-customFontColor font-medium w-3/5'>{selectedBUR?.submittedBy ? selectedBUR?.submittedBy.replace('|', ' on ') : '--'}</p>
            </div>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='text-gray-500 w-2/5'>Reviewed By</p>
              <p className='text-customFontColor font-medium w-3/5'>{selectedBUR?.reviewedBy ? selectedBUR?.reviewedBy.replace('|', ' on ') : '--'}</p>
            </div>
            <div className='w-full h-auto flex items-start justify-center'>
              <p className='text-gray-500 w-2/5'>Approved By</p>
              <p className='text-customFontColor font-medium w-3/5'>{selectedBUR?.approvedBy ? selectedBUR?.approvedBy.replace('|', ' on ') : '--'}</p>
            </div>
          </div>
          <div className="w-full h-auto">
            <div className="px-2 my-2">
              <h1 className="text-lg font-bold">Comments({selectedBUR?.comments ? selectedBUR.comments?.length : 0})</h1>
            </div>
            <div className="px-2">
              <hr />
            </div>
            <div className="w-full p-3 h-auto overflow-y-auto">
              { selectedBUR?.comments && selectedBUR?.comments.length > 0 ? (
                  selectedBUR?.comments.map((comment, index) => (
                    <Comments key={index} comment={comment}/>
                  ))
                ) : (
                  <div className="w-full h-full flex items-center justify-center">No Comments Found</div>
                )
              }
            </div>
          </div>
        </div>
      </div>
      {isLoading || isLoadingApprover && (
        <LargeLoader/>
      )}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 z-20 bg-black opacity-50"/>
          <section
            onClick={(e) => e.stopPropagation()}
            className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-end"
            >
            <DisbursementVoucher modal={modal} document={selectedBUR} flag={true}/>
            
          </section>
        </>
      )}
      {modalComment && (
        <>
          <div className="fixed inset-0 z-20 bg-black opacity-50" />
          <div className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
            <AddComment doc={selectedBUR} modal={closeCommentModal} type={type}/>
          </div>
        </>
      )}
    </div>
  )
}

export default ViewBUR