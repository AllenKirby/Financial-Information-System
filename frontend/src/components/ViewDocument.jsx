import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
//icons
import { RxPaperPlane } from "react-icons/rx";
import { FiEdit3 } from "react-icons/fi";
import { MdDeleteOutline, MdOutlineFileDownload  } from "react-icons/md";
import { IoMdArrowRoundBack, IoMdCheckmark, IoMdAdd  } from "react-icons/io";
import { IoCloseSharp, IoReturnDownBackOutline, IoReturnDownForward  } from "react-icons/io5";
import { LiaCommentSolid } from "react-icons/lia";
//components
import DisbursementVoucher from './DisbursementVoucher';
//import Document from "./Document";
import FundingModal from "./FundingModal";
import AddComment from "./AddComment";
import Comments from "./Comments";
import Document from "./Document";

//contexts
import { useDisbursementContext } from "../hooks/useDisbursementContext";
import { useHeadDisbursementContext } from "../hooks/useHeadDisbursementContext";
import { useAdminDisbursementContext } from '../hooks/useAdminDisbursementContext'
import { useOpDisbursementContext } from "../hooks/useOpDisbursementContext";

//hooks
import { usePreparerHook } from "../hooks/usePreparerHook";
import { useApproverHook } from "../hooks/useApproverHook";

//redux
import { useSelector } from "react-redux";
import { useAuthContext } from "../hooks/useAuthContext";
import LargeLoader from "./LargeLoader";
import DVTemplate from "./DVTemplate";

const ViewDocument = () => {
  //states
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [idStatus, setIdStatus] = useState({id: '', status: '', type: ''})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalComment, setModalComment] = useState(false)
  //const [userRecord, setUserRecord] = useState('')
  const [primaryColor, setPrimaryColor] = useState('')
  const [secondaryColor, setSecondaryColor] = useState('')
  const [type, setType] = useState('')
  const [isCommentOpen, setIsCommentOpen] = useState(false)
  const [fundingModal, setFundingModal] = useState(false)
  
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

  useEffect(() => {
    if(user && user.role === '1'){
      setPrimaryColor('customgreen')
      setSecondaryColor('bg-adminBlue')
    }else if(user && user.role === '2'){
      setPrimaryColor('BOGreen')
      setSecondaryColor('bg-BOLightGreen')
    }else if(user && user.role === '3'){
      setPrimaryColor('fundingBlueGreen')
      setSecondaryColor('bg-fundingGray')
    }else if(user && user.role === '4'){
      setPrimaryColor('preparerPrimary')
      setSecondaryColor('bg-preparerSecondary')
    }
    else {
      setPrimaryColor('customgreen')
      setSecondaryColor('bg-customFontColor')
    }
  },[user])

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
    <section className="w-full sm:w-3/4 lg:w-2/4 h-full sm:h-5/6 flex flex-col bg-white sm:rounded-lg">
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
              className={`w-full px-5 rounded-lg py-2 border-[1px] border-${primaryColor} text-${primaryColor} bg-white`}
              >
            <MdOutlineFileDownload className="text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-2xl 2xl:text-3xl"/>
          </button>)}

          {idStatus.type === '3' && idStatus.status === 'In Review' && (
            <button
              onClick={() => openModal('ReturnDV')}
              disabled={isLoadingPreparer}
              className={`w-auto px-5 rounded-lg py-2 text-white ${secondaryColor} ${
                isLoadingPreparer ? 'bg-gray-200 text-gray-500' : 'text-red-500 '
              }`}
            >
              <IoReturnDownBackOutline className="text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-2xl 2xl:text-3xl" />
            </button>
          )}

          {(idStatus.type === '2' && idStatus.status !== 'Approved') && (
            <button
              onClick={() => openModal('ReturnToFunding')}
              className={`w-full px-5 rounded-lg text-sm py-2 text-white ${secondaryColor}`}
              >
              <IoReturnDownBackOutline className="text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-2xl 2xl:text-3xl" />
            </button>
          )}

          {(idStatus.type === '2' && idStatus.status !== 'Approved') && (
            <button
              onClick={() => openModal('ReturnToPreparer')}
              className={`w-full px-5 rounded-lg text-sm py-2 text-white ${secondaryColor}`}
              >
              <IoReturnDownForward className="text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-2xl 2xl:text-3xl" />
            </button>
          )}
          
          {idStatus.status !== 'Drafting' && (
            <button 
              onClick={() => setIsCommentOpen(!isCommentOpen)}
              className={`w-auto px-5 py-2 rounded-lg text-customFontColor border-2 border-customFontColor`}>
              {isCommentOpen ? <IoCloseSharp className="text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-2xl 2xl:text-3xl"/> : <LiaCommentSolid className="text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-2xl 2xl:text-3xl"/>}
            </button>
          )}
          {idStatus.type === '4' && idStatus.status === 'Drafting' && (
            <button
              onClick={delDV}
              disabled={isLoadingPreparer}
              className={`w-auto px-5 rounded-lg py-2 text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-white transtion-all duration-150`}
              >
              <MdDeleteOutline size={20}/>
            </button>
          )}
          {(idStatus.type === '3' || idStatus.type === '4' && permission?.data?.permission) && (
            <button
              onClick={isFundingModalOpen}
              className={`w-auto rounded-lg px-5 py-2 border-2 hover:text-white transition-all duration-150 ${user?.role === '4' ? 'border-blue-500 text-blue-500 hover:bg-blue-500': 'border-fundingBlueGreen text-fundingBlueGreen'}`}
              >
              <IoMdAdd size={20}/>
            </button>
          )}
          {(idStatus.type === '4' || idStatus.type === '3' && permission?.data?.permission) && (
            <button
              onClick={modal}
              className={`w-auto rounded-lg px-5 py-2 border-2 hover:text-white transition-all duration-150 ${user?.role === '4' ? 'border-preparerPrimary text-preparerPrimary hover:bg-preparerPrimary': 'border-fundingBlueGreen text-fundingBlueGreen'}`}
              >
              <FiEdit3 className="text-xl sm:text-2xl md:text-3xl lg:text-lg 2xl:text-xl"/>
            </button>
          )}
          {idStatus.type === '4' && (
            <button
              //onClick={permission.data.permission ? handleSubmitForOp : handleSubmit}
              onClick={() => openModal(permission?.data?.permission ? 'SubmitFunding' : 'SubmitPreparer')}
              className={`w-auto px-5 py-2 rounded-lg bg-preparerPrimary text-white`}
              >
              <RxPaperPlane size={20} className="block lg:hidden"/><span className="lg:text-xl xl:text-base 2xl:text-2xl hidden lg:block">Submit</span>
            </button>
          )}

          {idStatus.type === '3' && (
            <button
              onClick={() => openModal('SubmitFunding')}
              className={`w-auto px-5 py-2 rounded-lg bg-fundingBlueGreen text-white`}
              >
              <RxPaperPlane size={20} className="block lg-landscape:hidden"/><span className="xl:text-lg 2xl:text-2xl hidden lg-landscape:block">Submit</span>
            </button>
          )}

          {(idStatus.type === '2' && !permission.data.permission) && (
            <button
              onClick={() => openModal('SubmitBO')}
              className={`w-auto px-5 py-2 rounded-lg bg-fundingBlueGreen text-white`}
              >
              <RxPaperPlane size={20} className="block lg-landscape:hidden"/><span className="xl:text-lg 2xl:text-2xl hidden lg-landscape:block">Submit</span>
            </button>
          )}

          {((idStatus.type === '1' && idStatus.status !== 'Approved') || (permission?.data?.permission && idStatus.type == '2' && idStatus.status !== 'Approved')) && (
            <button
              onClick={approve}
              disabled={isLoadingApprover}
              className={` w-auto px-5 py-2 rounded-lg ${isLoadingApprover ? 'bg-gray-200 text-gray-500' : user?.role === '1' ? 'bg-customgreen' : 'bg-BOGreen'} text-white`}
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
          <div className="w-full p-5 h-auto overflow-y-auto">
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
            <AddComment idStatus={idStatus} doc={doc} modal={closeCommentModal} type={type} ASA={doc.ASA} permission={permission.data.permission}/>
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
      {isLoadingApprover || isLoadingPreparer && (
        <LargeLoader/>
      )}
    </section>
  );
};

export default ViewDocument;
