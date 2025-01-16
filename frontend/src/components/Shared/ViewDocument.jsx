import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
//icons
import { RxPaperPlane } from "react-icons/rx";
import { FiEdit3 } from "react-icons/fi";
import { MdDeleteOutline, MdOutlineFileDownload  } from "react-icons/md";
import { IoMdArrowRoundBack, IoMdCheckmark, IoMdAdd  } from "react-icons/io";
import { BsArrowLeft } from "react-icons/bs";
//components
import DisbursementVoucher from '../EditorComponents/DisbursementVoucher';
import LargeLoader from "../Loaders/LargeLoader";
import DVTemplate from "./DVTemplate";
import FundingModal from "../OperatorComponents/FundingModal";
import AddComment from "./AddComment";
import Comments from "./Comments";

//contexts
import { useDisbursementContext } from "../../hooks/useDisbursementContext";
import { useHeadDisbursementContext } from "../../hooks/useHeadDisbursementContext";
import { useAdminDisbursementContext } from '../../hooks/useAdminDisbursementContext'
import { useOpDisbursementContext } from "../../hooks/useOpDisbursementContext";

//hooks
import { usePreparerHook } from "../../hooks/usePreparerHook";
import { useApproverHook } from "../../hooks/useApproverHook";

//redux
import { useSelector } from "react-redux";
import { useAuthContext } from "../../hooks/useAuthContext";

const ViewDocument = () => {
  //states
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [idStatus, setIdStatus] = useState({id: '', status: '', type: ''})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalComment, setModalComment] = useState(false)
  //const [userRecord, setUserRecord] = useState('')
  //const [primaryColor, setPrimaryColor] = useState('')
  const [type, setType] = useState('')
  const [fundingModal, setFundingModal] = useState(false)
  const [returnFlag, setReturnFlag] = useState(false)

  //contexts
  const { documents } = useDisbursementContext();
  const {OpDocuments} = useOpDisbursementContext();
  const { HeadDocuments} = useHeadDisbursementContext()
  const { AdminDocuments } = useAdminDisbursementContext()
  const { user } = useAuthContext()

  //hooks
  const { deleteDV, isLoading: isLoadingPreparer} = usePreparerHook();
  const { approveDV, downloadDV, isLoading: isLoadingApprover, error: errorApprover } = useApproverHook();

  //redux
  const permission = useSelector((state) => state.permission) 

  const modal = () => {
    setIsModalOpen(!isModalOpen)
  } 

  const openModal = (type) => {
    setType(type)
    setModalComment(true)
  }
  const closeCommentModal = () => {
    setModalComment(false)
  } 
  const isFundingModalOpen = () => {
    setFundingModal(!fundingModal)
  }

  // useEffect(() => {
  //   if(user && user.role === '1'){
  //     setPrimaryColor('customgreen')
  //   }else if(user && user.role === '2'){
  //     setPrimaryColor('BOGreen')
  //   }else if(user && user.role === '3'){
  //     setPrimaryColor('fundingBlueGreen')
  //   }else if(user && user.role === '4'){
  //     setPrimaryColor('preparerPrimary')
  //   }
  //   else {
  //     setPrimaryColor('customgreen')
  //   }
  // },[user])

  useEffect(() => {
    if(id){
      const decoded = decodeURIComponent(id)
      setIdStatus({id: `${decoded.split('|').slice()[0]}|${decoded.split('|').slice()[1]}`, status: decoded.split('|').slice()[2], type: decoded.split('|').slice()[3]})
    }
  }, [id])

  useEffect(() => {

    if (idStatus.type === '4') {
      if (documents && Object.keys(documents).length > 0) {

        const selectedDocument = Object.entries(documents).find(([, document]) => document.DVKey === idStatus.id);
        
        if (selectedDocument) {
          setDoc(selectedDocument[1]);
        } else {
          console.log(`Error: No document found with DV matching idStatus.id: ${idStatus.id}`);
        }
      } else {
        console.log("Error: Documents are empty or undefined.");
      }
    }
    else if (idStatus.type === '3'){
      if(OpDocuments && Object.keys(OpDocuments).length > 0){

        const selectedDocument = Object.entries(OpDocuments.documents).find(([, document]) => document.data.DVKey === idStatus.id);

        if (selectedDocument) {
          setDoc(selectedDocument[1].data);
        } else {
          console.log("Error finding the operator document");
        }
      }
    }else if (idStatus.type === '2'){
      if(HeadDocuments && Object.keys(HeadDocuments).length > 0){

        const selectedDocument = Object.entries(HeadDocuments).find(([, document]) => document.data.DVKey === idStatus.id);

        if (selectedDocument) {
          setDoc(selectedDocument[1].data);
        } else {
          console.log("Error finding the Head document");
        }
      }
    }else if(idStatus.type === '1'){
      if(AdminDocuments && Object.keys(AdminDocuments).length > 0){
        const selectedDocument = Object.entries(AdminDocuments).find(([, document]) => document.data.DVKey === idStatus.id);
        if (selectedDocument) {
          setDoc(selectedDocument[1].data);
        } else {
          console.log("Error finding the Head document");
        }
      }
    }
  }, [OpDocuments, HeadDocuments, documents, idStatus, AdminDocuments]); 

  const handleDownload = async() => {
    await downloadDV(doc)
  }

  const delDV = async () => {
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
        const res = await deleteDV(idStatus.id);
        if (res) {
          Swal.fire({
            title: "Deleted!",
            text: "Your document has been deleted.",
            icon: "success",
          });
          window.history.back()
        }
      }
    });
  };

  const approve = async() => {
    const data = {
      payee: doc.payee,
      amount: doc.amount,
      fund: doc.fund,
      date: doc.date,
      optionalAmount: doc.optionalAmount,
      accCategory: doc.accCategory
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
        const res = await approveDV(idStatus.id, data)
        if (res) {
          Swal.fire({
            title: "Approved!",
            text: "Your document has been Approved.",
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

  return (
    <section className="w-full sm:w-3/4 lg:w-3/5 h-full sm:h-5/6 flex flex-col bg-white sm:rounded-lg">
      <div className="w-full h-auto flex items-center justify-between px-3 py-2 border-b-2">
        <button
            onClick={() => window.history.back()}
            className='w-auto px-5 py-2 rounded-lg text-gray-500 hover:bg-gray-200 transition-all duration-100'
            >
            <IoMdArrowRoundBack size={20}/>
        </button>
        <div className="flex items-center justify-center gap-2">
          {idStatus.status === 'Approved' && (
            <button
              onClick={handleDownload}
              className={`w-auto px-5 py-2 rounded-lg flex items-center justify-center gap-2 ${permission?.data.permission && permission?.data?.roleName === 'Budget Officer' ? 'bg-BOGreen border-BOGreen hover:text-BOGreen' : 'bg-customgreen border-customgreen hover:text-customgreen'} border-2 hover:bg-white text-white transition-all duration-150`}
              >
            <MdOutlineFileDownload size={20} /> <span className="hidden sm:block ">Download</span>
          </button>)}

          {idStatus.type === '3' && idStatus.status === 'In Review' && (
            <button
              onClick={() => openModal('ReturnDV')}
              className="w-auto px-5 rounded-lg py-3 sm:py-2 text-red-500 bg-white border-2 border-red-500 hover:bg-red-500 hover:text-white transition-all duration-150 flex items-center justify-center gap-2"
            >
              <BsArrowLeft size={20}/> <span className="hidden sm:block ">Return to Preparer</span>
            </button>
          )}

          {/* {(idStatus.type === '2' && idStatus.status !== 'Approved') && (
            <button
              onClick={() => openModal('ReturnToFunding')}
              className="w-auto px-5 rounded-lg py-3 sm:py-2 text-white bg-red-500 border-2 border-red-500 hover:bg-white hover:text-red-500 transition-all duration-150 flex items-center justify-center gap-2"
              >
              <BsArrowLeft/> <span className="hidden sm:block ">Return to Funding</span>
            </button>
          )}

          {(idStatus.type === '2' && idStatus.status !== 'Approved') && (
            <button
              onClick={() => openModal('ReturnToPreparer')}
              className="w-auto px-5 rounded-lg py-3 sm:py-2 text-white bg-red-500 border-2 border-red-500 hover:bg-white hover:text-red-500 transition-all duration-150 flex items-center justify-center gap-2"
              >
              <BsArrowLeft/> <span className="hidden sm:block ">Return to Preparer</span>
            </button>
          )} */}
          
          {(idStatus.type === '2' && idStatus.status !== 'Approved' && idStatus.status !== 'For Approval') && (
            <div className="w-auto h-auto relative">
              <button onClick={() => setReturnFlag(!returnFlag)} className="w-auto px-3 py-2 flex items-center justify-center gap-2 font-semibold border-2 rounded-lg text-red-500 border-red-500 hover:bg-red-500 hover:text-white transition-all duration-150"><BsArrowLeft/> Return</button>
              {returnFlag && (
                <>
                  <div className="fixed inset-0 z-0" onClick={() => setReturnFlag(!returnFlag)}/>
                  <div className='absolute w-24 sm:w-28 md:w-32 lg:w-full bg-white right-0 top-12 z-0 p-1 border-[1px] text-xs lg:text-sm'>
                    <div onClick={() => openModal('ReturnToPreparer')} className='text-center mt-1 hover:bg-slate-100 cursor-pointer py-1 text-sm'>Preparer</div>
                    <div onClick={() => openModal('ReturnToFunding')} className='text-center mt-1 hover:bg-slate-100 cursor-pointer py-1 text-sm'>Funding</div>
                  </div>
                </>
              )}
            </div>
          )}

          {(idStatus.type === '1' && idStatus.status === 'For Approval') && (
            <div className="w-auto h-auto relative">
              <button onClick={() => setReturnFlag(!returnFlag)} className="w-auto px-3 py-2 flex items-center justify-center gap-2 font-semibold border-2 rounded-lg text-red-500 border-red-500 hover:bg-red-500 hover:text-white transition-all duration-150"><BsArrowLeft/> Return</button>
              {returnFlag && (
                <>
                  <div className="fixed inset-0 z-0" onClick={() => setReturnFlag(!returnFlag)}/>
                  <div className='absolute w-24 sm:w-28 md:w-32 lg:w-full bg-white right-0 top-12 z-0 p-1 border-[1px] text-xs lg:text-sm'>
                    <div onClick={() => openModal('ReturnToPreparerFromAdmin')} className='text-center mt-1 hover:bg-slate-100 cursor-pointer py-1 text-sm'>Preparer</div>
                    <div onClick={() => openModal('ReturnToFundingFromAdmin')} className='text-center mt-1 hover:bg-slate-100 cursor-pointer py-1 text-sm'>Funding</div>
                    <div onClick={() => openModal('ReturnToBOFromAdmin')} className='text-center mt-1 hover:bg-slate-100 cursor-pointer py-1 text-sm'>Budget Officer</div>
                  </div>
                </>
              )}
            </div>
          )}
          
          {idStatus.type === '4' && idStatus.status === 'Drafting' && (
            <button
              onClick={delDV}
              className={`w-auto px-5 rounded-lg py-2 text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-white transtion-all duration-150`}
              >
              <MdDeleteOutline size={20}/>
            </button>
          )}
          {(idStatus.type === '4' || idStatus.type === '3' && permission?.data?.permission) && (
            <button
              onClick={modal}
              className={`w-auto rounded-lg px-5 py-2 border-2 transition-all duration-150 ${user?.role === '4' ? 'border-preparerPrimary text-preparerPrimary hover:bg-preparerPrimary hover:text-white': 'border-blue-500 bg-blue-500 text-white hover:bg-white hover:text-blue-500'}`}
              >
              <FiEdit3 size={20}/>
            </button>
          )}
          {(idStatus.type === '3' || idStatus.type === '4' && permission?.data?.permission) && (
            <button
              onClick={isFundingModalOpen}
              className={`w-auto rounded-lg px-5 py-2 border-2 hover:text-white transition-all duration-150 ${user?.role === '4' ? 'border-blue-500 text-blue-500 hover:bg-blue-500': 'border-fundingBlueGreen text-fundingBlueGreen hover:bg-fundingBlueGreen'}`}
              >
              <IoMdAdd size={20}/>
            </button>
          )}
          {idStatus.type === '4' && (
            <button
              //onClick={permission.data.permission ? handleSubmitForOp : handleSubmit}
              onClick={() => openModal(permission?.data?.permission ? 'SubmitFunding' : 'SubmitPreparer')}
              className={`w-auto px-5 py-2 rounded-lg bg-preparerPrimary border-2 border-preparerPrimary hover:bg-white hover:text-preparerPrimary text-white transition-all duration-150`}
              >
              <RxPaperPlane size={20} className="block lg:hidden"/><span className="lg:text-xl xl:text-base 2xl:text-2xl hidden lg:block">Submit</span>
            </button>
          )}

          {idStatus.type === '3' && (
            <button
              onClick={() => openModal('SubmitFunding')}
              className={`w-auto px-5 py-2 rounded-lg bg-fundingBlueGreen border-2 border-fundingBlueGreen hover:bg-white hover:text-fundingBlueGreen text-white transition-all duration-150`}
              >
              <RxPaperPlane size={20} className="block lg-landscape:hidden"/><span className="xl:text-lg 2xl:text-2xl hidden lg-landscape:block">Submit</span>
            </button>
          )}

          {(idStatus.type === '2' && !permission.data.permission) && (
            <button
              onClick={() => openModal('SubmitBO')}
              className={`w-auto px-5 py-2 rounded-lg bg-BOGreen border-2 border-BOGreen hover:bg-white hover:text-BOGreen text-white transition-all duration-150`}
              >
              <RxPaperPlane size={20} className="block lg-landscape:hidden"/><span className="xl:text-lg 2xl:text-2xl hidden lg-landscape:block">Submit</span>
            </button>
          )}

          {((idStatus.type === '1' && idStatus.status !== 'Approved') || (permission?.data?.permission && idStatus.type == '2' && idStatus.status !== 'Approved')) && (
            <button
              onClick={approve}
              className={` w-auto px-5 py-2 border-2 rounded-lg ${isLoadingApprover ? 'bg-gray-200 text-gray-500' : user?.role === '1' ? 'bg-customgreen border-customgreen hover:bg-white hover:text-customgreen' : 'bg-BOGreen border-BOGreen hover:bg-white hover:text-BOGreen'} text-white transition-all duration-150`}
              >
              <IoMdCheckmark size={20} className="block lg-landscape:hidden"/><span className="xl:text-lg 2xl:text-2xl hidden lg-landscape:block">Approve</span>
            </button>
          )}
        </div>
      </div>
      <div className="w-full flex-1 overflow-y-auto">
        <DVTemplate document={doc}/>
        <div className="w-full h-auto">
          <div className="px-2 my-2">
            <h1 className="text-lg font-bold">Comments({doc?.comments ? doc.comments?.length : 0})</h1>
          </div>
          <div className="px-2">
            <hr />
          </div>
          <div className="w-full p-3 h-auto overflow-y-auto">
            { doc?.comments && doc?.comments.length > 0 ? (
                doc?.comments.map((comment, index) => (
                  <Comments key={index} comment={comment}/>
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center">No Comments Found</div>
              )
            }
          </div>
        </div>
      </div>
      {modalComment && (
        <>
          <div className="fixed inset-0 z-20 bg-black opacity-50" />
          <div className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
            <AddComment idStatus={idStatus} doc={doc} modal={closeCommentModal} type={type} ASA={doc.ASA} permission={permission?.data?.permission}/>
          </div>
        </>
      )}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 z-20 bg-black opacity-50" onClick={modal} />
          <section
            onClick={(e) => e.stopPropagation()}
            className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-end"
            >
            <DisbursementVoucher modal={modal} document={doc} flag={true} />
            
          </section>
        </>
      )}
      {fundingModal && (
        <>
          <div className="fixed inset-0 z-20 bg-black opacity-50" onClick={isFundingModalOpen} />
          <section
            onClick={(e) => e.stopPropagation()}
            className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center"
            >
              <FundingModal modal={isFundingModalOpen} data={doc}/>
          </section>
        </>
      )}
      {(isLoadingApprover || isLoadingPreparer) && (
        <LargeLoader/>
      )}
    </section>
  );
};

export default ViewDocument;
