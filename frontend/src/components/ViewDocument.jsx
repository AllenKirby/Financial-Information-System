import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import html2pdf from 'html2pdf.js'
import { PDFViewer } from '@react-pdf/renderer';
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
import DVTemplate from "./DVTemplate";
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
  const { approveDV, isLoading: isLoadingApprover, error: errorApprover } = useApproverHook();

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

  if (!doc) {
    return <div className="w-a4-width bg-gray-200 h-full animate-blink rounded-lg"></div>;
  }

  const handleDownload = () => {
    const pdf = document.getElementById('pdf')
    html2pdf(pdf)
      .from(pdf)
      .set({
        image: { type: 'jpeg', quality: 0.98 },  // Adjust image quality
        pagebreak: { mode: 'avoid-all' },        // Avoid breaking elements
        jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait', precision: 16 } // precision for higher quality
      }
    ).save();
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
    console.log(doc)
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
    <section className="w-full h-full flex-col">
      <div className="w-full h-[8%] flex items-center justify-between px-2">
        <button
            onClick={() => window.history.back()}
            className='w-auto px-5 py-2 rounded-lg hover:bg-gray-200 transition-all duration-100'
            >
            <IoMdArrowRoundBack className="text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-2xl 2xl:text-3xl"/>
        </button>
        {idStatus.type === '4' && (
          <button
            //onClick={permission.data.permission ? handleSubmitForOp : handleSubmit}
            onClick={() => openModal(permission?.data?.permission ? 'SubmitFunding' : 'SubmitPreparer')}
            className={`w-auto px-5 py-2 rounded-lg bg-preparerPrimary text-white`}
            >
            <RxPaperPlane size={20} className="block lg:hidden"/><span className="lg:text-xl xl:text-lg 2xl:text-2xl hidden lg:block">Submit</span>
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
            className={` w-full px-5 py-2 rounded-lg ${isLoadingApprover ? 'bg-gray-200 text-gray-500' : user?.role === '1' ? 'bg-customgreen' : 'bg-BOGreen'} text-white`}
            >
            <IoMdCheckmark size={20} className="block lg-landscape:hidden"/><span className="xl:text-lg 2xl:text-2xl hidden lg-landscape:block">Approve</span>
          </button>
        )}
      </div>
      <div className="relative w-full h-[92%] flex flex-col lg-portrait:flex-col lg-landscape:flex-row">
        <div className='relative w-full py-3 h-full bg-white rounded-lg'>
          {isCommentOpen && (
            <div className={`h-[inherit] absolute overflow-hidden p-2 top-0 left-0 z-10 rounded-lg transition-all duration-500 ease-in-out bg-white border-2 ${isCommentOpen ? 'w-full' : 'w-0'}`}>
              <div className="px-2 my-2">
                <h1 className="text-xl font-bold">Comments({doc.comments ? doc.comments.length : 0})</h1>
              </div>
              <div className="px-2">
                <hr />
              </div>
              <div className="w-full p-2 h-[27rem] overflow-y-auto">
                { doc.comments ? (
                    doc.comments.map((comment, index) => (
                      <Comments key={index} comment={comment}/>
                    ))
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">No Comments Found</div>
                  )
                }
              </div>
            </div>
          )}
          <div className="overflow-auto h-full w-full">
            {/* <PDFViewer width="100%" height="100%">
              <DVTemplate data={doc} />
            </PDFViewer> */}
            <Document document={doc}/>
          </div>
        </div>
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-20 w-auto h-auto px-10 py-2 border-2 shadow-lg shadow-gray-300 flex items-center justify-center bg-white rounded-lg">
          <div className="flex items-center justify-center overflow-x-auto gap-2">

            {(idStatus.type === '4' || idStatus.type === '3' && permission?.data?.permission) && (
              <button
                onClick={modal}
                className={`w-auto rounded-lg px-5 py-2 bg-${primaryColor} text-white`}
                >
                <FiEdit3 className="text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-2xl 2xl:text-3xl"/>
              </button>
            )}
            {(idStatus.type === '3' || idStatus.type === '4' && permission?.data?.permission) && (
              <button
                onClick={isFundingModalOpen}
                className={`w-full px-5 rounded-lg py-2 bg-${primaryColor} text-white`}
                >
                <IoMdAdd className="text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-2xl 2xl:text-3xl"/>
              </button>
            )}

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

            {idStatus.type === '4' && idStatus.status === 'Drafting' && (
              <button
                onClick={delDV}
                disabled={isLoadingPreparer}
                className={`w-auto lg-landscape:w-full px-5 rounded-lg py-2 bg-red-500 ${secondaryColor} ${isLoadingPreparer ? 'bg-gray-200 text-gray-500' : 'text-white '}`}
                >
                <MdDeleteOutline className="text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-2xl 2xl:text-3xl"/>
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
            {/* <select 
              className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none"
              onChange={(e) => setUserRecord(e.target.value)}
              value={userRecord}>
              <option value='' disabled>Select action:</option>
          
              {(() => {
                const { createdBy, submittedBy, updatedBy, reviewedBy, approvedBy } = doc;
                const userActions = { createdBy, submittedBy, updatedBy, reviewedBy, approvedBy };

                return Object.keys(userActions).map((key) => {
                  const formattedKey = key
                    .replace(/([A-Z])/g, ' $1')  // Add space before capital letters
                    .trim()                      // Trim leading/trailing spaces
                    .toLowerCase()               // Convert all to lowercase first
                    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word

                  return <option key={key} value={doc[key]}>{formattedKey}:</option>;
                  });
              })()}
            </select> */}
            {/* <div className="pl-5">
              <p>{userRecord.replace(/[,|]/g, ' ')}</p>
            </div> */}
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
            className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center"
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
    </section>
  );
};

export default ViewDocument;
