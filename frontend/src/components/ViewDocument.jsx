import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import html2pdf from 'html2pdf.js'
import Swal from 'sweetalert2';
//components
import DisbursementVoucher from './DisbursementVoucher';
import Document from "./Document";
//contexts
import { useDisbursementContext } from "../hooks/useDisbursementContext";
import { useHeadDisbursementContext } from "../hooks/useHeadDisbursementContext";
import { useAdminDisbursementContext } from '../hooks/useAdminDisbursementContext'
import { useOpDisbursementContext } from "../hooks/useOpDisbursementContext";
//hooks
import { usePreparerHook } from "../hooks/usePreparerHook";
import { useFundingHook } from "../hooks/useFundingHook";
import { useBudgetOfficerHook } from "../hooks/useBudgetOfficerHook";
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
  const [userRecord, setUserRecord] = useState('')
  const [primaryColor, setPrimaryColor] = useState('')
  const [secondaryColor, setSecondaryColor] = useState('')
  
  //contexts
  const { documents } = useDisbursementContext();
  const {OpDocuments} = useOpDisbursementContext();
  const { HeadDocuments} = useHeadDisbursementContext()
  const { AdminDocuments } = useAdminDisbursementContext()
  const { user } = useAuthContext()

  //hooks
  const {deleteDV, submitDoc, isLoading, error} = usePreparerHook()
  const {returnDoc, transferToHead, isLoading: isLoadingForFunding, error: errorForFunding} = useFundingHook()
  const {submitToAdmin, returnDocFromHeader, isLoading: isLoadingForBO, errorForBO} = useBudgetOfficerHook()
  const {approveDV, isLoading: isLoadingForApprover, error: errorForApprover} = useApproverHook()
  //redux
  const permission = useSelector((state) => state.permission) 
  const modal = () => {
    setIsModalOpen(!isModalOpen)
  } 

  useEffect(() => {
    if(user && user.role === '1'){
      setPrimaryColor('customgreen')
      setSecondaryColor('adminBlue')
    }else if(user && user.role === '2'){
      setPrimaryColor('BOGreen')
      setSecondaryColor('BOLightGreen')
    }else if(user && user.role === '3'){
      setPrimaryColor('fundingBlueGreen')
      setSecondaryColor('fundingGray')
    }else if(user && user.role === '4'){
      setPrimaryColor('preparerPrimary')
      setSecondaryColor('preparerSecondary')
    }
    else {
      setPrimaryColor('customgreen')
      setSecondaryColor('customFontColor')
    }
  },[user])
  
  const delDV = async (e) => {
    e.stopPropagation();

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
  useEffect(() => {
    if(id){
      const decoded = decodeURIComponent(id)
      console.log(decoded)
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

  const handleSubmit = async() => {
    console.log('Preparer Hit')
    const data = {
      DV: idStatus.id,
      payee: doc.payee
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#009933",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Submit it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await submitDoc(data)
        if (res) {
          Swal.fire({
            title: "Submitted!",
            text: "Your document has been submit.",
            icon: "success",
          });
          window.history.back()
        }
        else{
          Swal.fire({
            title: "Error!",
            text: {error},
            icon: "error",
          });
        }
      }
    });
  }

  const returnDV = async() => {
    const data = {
      DV: idStatus.id,
      payee: doc.payee
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#009933",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Return it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await returnDoc(data)
        if (res) {
          Swal.fire({
            title: "Returned",
            text: "Your document has been returned.",
            icon: "success",
          });
          window.history.back()
        }
        else{
          Swal.fire({
            title: "Error!",
            text: {errorForFunding},
            icon: "error",
          });
        }
      }
    });
  }

  const handleSubmitForOp = async() => {
    console.log('Funding Hit')
    const data = {
      DV: idStatus.id,
      payee: doc.payee
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#009933",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Submit it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await transferToHead(data)
        if (res) {
          Swal.fire({
            title: "Submitted!",
            text: "Your document has been submitted.",
            icon: "success",
          });
          window.history.back()
        }
        else{
          Swal.fire({
            title: "Error!",
            text: {errorForFunding},
            icon: "error",
          });
        }
      }
    });
  }

  const handleReturn = (backToRole) => {
    const data = {
      DV: idStatus.id,
      payee: doc.payee,
      returnTo: backToRole
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#009933",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Return it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let res;
        if(backToRole === '3'){
          res = returnDocFromHeader(data)
        }else if(backToRole === '4'){
          res = returnDocFromHeader(data)
        }
        if (res) {
          Swal.fire({
            title: "Returned!",
            text: "Your document has been returned.",
            icon: "success",
          });
          window.history.back()
        }
        else{
          Swal.fire({
            title: "Error!",
            text: {errorForBO},
            icon: "error",
          });
        }
      }
    });
  }

  const handleSubmitForHead = async() => {
    const data = {
      DV: idStatus.id,
      payee: doc.payee
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#009933",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Submit it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await submitToAdmin(data)
        if (res) {
          Swal.fire({
            title: "Submitted!",
            text: "Your document has been submit.",
            icon: "success",
          });
          window.history.back()
        }
        else{
          Swal.fire({
            title: "Error!",
            text: {errorForBO},
            icon: "error",
          });
        }
      }
    });
  }

  const approve = async() => {

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
        const res = await approveDV(idStatus.id)
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
            text: {errorForApprover},
            icon: "error",
          });
        }
      }
    });
  }

  return (
    <section className="w-full h-auto flex ">
      <div className="w-5/6 h-[450px] overflow-y-auto">
        <Document document={doc} />
      </div>
      <div className="w-1/6 h-full p-3">
        <div className="flex flex-col gap-2">

          {idStatus.type === '4' && (
            <button
              disabled={isLoading}
              onClick={permission.data.permission ? handleSubmitForOp : handleSubmit}
              className={`w-full px-5 py-2 rounded-lg ${isLoading ? 'bg-gray-200 text-gray-500' : 'bg-preparerPrimary text-white hover:scale-125'} transition-all duration-150`}
              >
              Submit
            </button>
          )}

          {idStatus.type === '3' && (
            <button
              disabled={isLoadingForFunding}
              onClick={handleSubmitForOp}
              className={`w-full px-5 py-2 rounded-lg ${isLoadingForFunding ? 'bg-gray-200 text-gray-500' : 'bg-fundingBlueGreen text-white hover:scale-125'} transition-all duration-150`}
              >
              Submit
            </button>
          )}

          {(idStatus.type === '2' && !permission.data.permission) && (
            <button
              disabled={isLoadingForBO}
              onClick={handleSubmitForHead}
              className={`w-full px-5 py-2 rounded-lg ${isLoadingForBO ? 'bg-gray-200 text-gray-500' : `bg-fundingBlueGreen text-white hover:scale-125`} transition-all duration-150`}
              >
              Submit
            </button>
          )}

          {((idStatus.type === '1' && idStatus.status !== 'Approved') || (permission.data.permission && idStatus.type == '2' && idStatus.status !== 'Approved')) && (
            <button
              disabled={isLoadingForApprover}
              onClick={approve}
              className={`w-full px-5 py-2 rounded-lg ${isLoadingForApprover ? 'bg-gray-200 text-gray-500' : 'bg-customgreen text-white hover:scale-125'} transition-all duration-150`}
              >
              Approve
            </button>
          )}

          {idStatus.type !== '2' && idStatus.type !== '1' && (
            <button
              onClick={modal}
              className={`w-full rounded-lg py-2 bg-${primaryColor} text-white hover:scale-125 transition-all duration-100`}
              >
              Update
            </button>
          )}

          <button
            onClick={handleDownload}
            className={`w-full rounded-lg py-2 border-[1px] border-${primaryColor} text-${primaryColor} bg-white hover:scale-125 transition-all duration-100`}
            >
            Download
          </button>

          {!(idStatus.type === '1' || idStatus.type === '2' || idStatus.status === 'Returned') && (
            <button
              disabled={isLoadingForFunding || isLoading}
              onClick={(idStatus.type === '4' || idStatus.status === 'Drafting') ? delDV : returnDV}
              className={`w-full rounded-lg py-2 text-white bg-${secondaryColor} ${isLoadingForFunding ? 'bg-gray-200 text-gray-500' : 'text-red-500 hover:scale-125'} transition-all duration-100`}
              >
              {(idStatus.type === '4' || idStatus.status === 'Drafting') ? 'Delete' : 'Return'}
            </button>
          )}

          {(idStatus.type === '2' && idStatus.status !== 'Approved') && (
            <button
              onClick={() => handleReturn('3')}
              disabled={isLoadingForBO}
              className={`w-full rounded-lg text-sm py-2 ${isLoadingForBO ? 'bg-gray-200 text-gray-500' : `text-white bg-${secondaryColor}  hover:scale-125`} transition-all duration-100`}
              >
              Return to Funding
            </button>
          )}

          {(idStatus.type === '2' && idStatus.status !== 'Approved') && (
            <button
              onClick={() => handleReturn('4')}
              disabled={isLoadingForBO}
              className={`w-full rounded-lg text-sm py-2 ${isLoadingForBO ? 'bg-gray-200 text-gray-500' : `text-white bg-${secondaryColor}  hover:scale-125`} transition-all duration-100`}
              >
              Return to Preparer
            </button>
          )}

          <button
            onClick={() => window.history.back()}
            className={`w-full py-2 rounded-lg text-white bg-${secondaryColor} hover:scale-125 transition-all duration-150`}
            >
            Back
          </button>

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
          <select 
            className="w-40 px-4 py-2 rounded-lg border-2 focus:outline-none"
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
          </select>
          <div className="pl-5">
            <p>{userRecord.replace(/,/g, ' ')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ViewDocument;
