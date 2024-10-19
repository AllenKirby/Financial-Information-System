import { useParams } from "react-router-dom";
import { useDisbursementContext } from "../hooks/useDisbursementContext";
import { useEffect, useState } from "react";
import Document from "./Document";
import html2pdf from 'html2pdf.js'
import { useOpDisbursementContext } from "../hooks/useOpDisbursementContext";
import { FaAngleDown, FaAngleUp, FaAngleLeft } from "react-icons/fa";
import DisbursementVoucher from './DisbursementVoucher';
import Swal from 'sweetalert2';
import { useDeleteDisbursement } from "../hooks/useDeleteDisbursement";
import { useToOperator } from "../hooks/useToOperator";
import { useBackToEditor } from "../hooks/useBackToEditor";
import { useToHead } from "../hooks/useToHead";
import { useHeadDisbursementContext } from "../hooks/useHeadDisbursementContext";
import { useReturnFromHead } from '../hooks/useReturnFromHead'
import { useToAdmin } from "../hooks/useToAdmin";
import { useAdminDisbursementContext } from '../hooks/useAdminDisbursementContext'


const ViewDocument = () => {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [idStatus, setIdStatus] = useState({id: '', status: '', type: ''})
  const [dropDown, setDropDown] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  //contexts
  const { documents } = useDisbursementContext();
  const {OpDocuments} = useOpDisbursementContext();
  const { HeadDocuments} = useHeadDisbursementContext()
  const { AdminDocuments } = useAdminDisbursementContext()

  //hooks
  const { deleteDV } = useDeleteDisbursement();
  const { submitDoc, isLoading, error } = useToOperator()
  const {returnDoc, isLoadingReturn_OpToEditor, errorReturn_OpToEditor} = useBackToEditor();
  const { transferToHead, isLoadingToHead, errorToHead } = useToHead()
  const {returnDocFromHeader, isLoadingReturn_fromHeader, errorReturn_fromHeader} = useReturnFromHead()
  const {submitToAdmin, isLoadingToAdmin, errorToAdmin} = useToAdmin()

  let isDisabled = (idStatus.status !== 'Drafting' && idStatus.status !== 'Returned') && idStatus.type === '4';
  const isDisabledForOp = (idStatus.status !== 'In Review' && idStatus.status !== 'Returned') && idStatus === '3';

  const modal = () => {
    setIsModalOpen(!isModalOpen)
  } 
  
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
      setIdStatus({id: decoded.split('|').slice()[0], status: decoded.split('|').slice()[1], type: decoded.split('|').slice()[2]})
    }
  }, [id])

  useEffect(() => {

    if (idStatus.type === '4') {
      const selectedDocument = Object.entries(documents).find(([,document]) => document.DV === idStatus.id);
      if (selectedDocument) {
        console.log('Editor',selectedDocument[1])
        setDoc(selectedDocument[1]);
      } else {
        console.log("Error finding the document");
      }
    }else if (idStatus.type === '3'){
      const selectedDocument = Object.entries(OpDocuments.documents).find(([, document]) => document.data.DV === idStatus.id);
      if (selectedDocument) {
        console.log('Operator',selectedDocument[1].data)
        setDoc(selectedDocument[1].data);
      } else {
        console.log("Error finding the operator document");
      }
    }else if (idStatus.type === '2'){
      const selectedDocument = Object.entries(HeadDocuments).find(([, document]) => document.data.DV === idStatus.id);
      if (selectedDocument) {
        console.log('Head',selectedDocument[1].data)
        setDoc(selectedDocument[1].data);
      } else {
        console.log("Error finding the Head document");
      }
    }else if(idStatus.type === '1'){
      const selectedDocument = Object.entries(AdminDocuments).find(([, document]) => document.data.DV === idStatus.id);
      if (selectedDocument) {
        console.log('Head',selectedDocument[1].data)
        setDoc(selectedDocument[1].data);
      } else {
        console.log("Error finding the Head document");
      }
    }
  }, [OpDocuments, HeadDocuments, documents, idStatus, AdminDocuments]); 

  if (!doc) {
    return <div className="w-a4-width bg-gray-200 h-full animate-blink rounded-md"></div>;
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
            text: {errorReturn_OpToEditor},
            icon: "error",
          });
        }
      }
    });
  }

  const handleSubmitForOp = async() => {
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
            text: {errorToHead},
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
            text: {errorReturn_fromHeader},
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
            text: {errorToAdmin},
            icon: "error",
          });
        }
      }
    });
  }

  return (
    <section className="w-full h-auto">
      <div className="px-5 py-4 flex items-center justify-between"> 
        <button onClick={() => window.history.back()} className="px-5 py-2 border-2  rounded-lg text-customgreen hover:scale-125 transition-all duration-150"><FaAngleLeft size={20}/></button>
        <div className="flex items-center justify-center gap-16">
          {idStatus.type === '4' && (<button disabled={isDisabled || isLoading} onClick={handleSubmit} className={`px-5 py-2 rounded-lg ${ isDisabled || isLoading ? `bg-gray-200 text-gray-500` : `bg-customgreen text-white hover:scale-125`} transition-all duration-150`}>Submit</button>)}
          {idStatus.type === '3' && (<button disabled={isDisabledForOp || isLoadingToHead} onClick={handleSubmitForOp} className={`px-5 py-2 rounded-lg ${ isDisabled || isLoadingToHead ? `bg-gray-200 text-gray-500` : `bg-customgreen text-white hover:scale-125`} transition-all duration-150`}>Submit</button>)}
          {idStatus.type === '2' && (<button disabled={isLoadingToAdmin} onClick={handleSubmitForHead} className={`px-5 py-2 rounded-lg ${isLoadingToAdmin ? `bg-gray-200 text-gray-500` : `bg-customgreen text-white hover:scale-125`} transition-all duration-150`}>Submit</button>)}
          {/* Options column */}
          <div className=" flex items-center justify-end w-1/6 relative">
            <button onClick={() => setDropDown(!dropDown)} className="flex z-10 px-3 py-2 gap-2 rounded-lg bg-customgreen text-white">
              {dropDown ? <FaAngleDown size={20}/> : <FaAngleUp size={20}/>} More
            </button>
            {dropDown && <>
                <div className="fixed inset-0 z-0" onClick={() => setDropDown(!dropDown)}></div>
                <div className="absolute top-6 z-0 right-0 bg-white rounded-xl px-1 pb-1 pt-5 border-2 border-gray-200 flex flex-col gap-1">
                  {idStatus.type !== '2' && <button disabled={isDisabled} onClick={modal} className={`w-20 rounded-md text-xs py-1 font-semibold ${isDisabled ? 'bg-gray-200 text-gray-500' : 'text-customFontGreen hover:bg-gray-200 hover:scale-105'} transition-all duration-100`}>Update</button>}
                  {idStatus.type !== '2' && <button disabled={isDisabled || isLoadingReturn_OpToEditor} onClick={idStatus.type === '4' ? delDV : returnDV} className={`w-20 rounded-md text-xs py-1 font-semibold ${isDisabled || isLoadingReturn_OpToEditor ? 'bg-gray-200 text-gray-500' : 'text-red-500  hover:bg-gray-200 hover:scale-105'} transition-all duration-100`}>{idStatus.type === '4' ? 'Delete' : 'Return'}</button>}
                  <button onClick={handleDownload} className="w-20 rounded-md text-xs py-1 font-semibold text-customFontGreen hover:bg-gray-200 hover:scale-105 transition-all duration-100">Download</button>
                  {idStatus.type === '2' && <button onClick={() => handleReturn('3')} disabled={isLoadingReturn_fromHeader || isDisabled} className={`w-20 rounded-md text-xs py-1 font-semibold ${isDisabled || isLoadingReturn_fromHeader ? 'bg-gray-200 text-gray-500' : 'text-red-500  hover:bg-gray-200 hover:scale-105'} transition-all duration-100`}>Return to Operator</button>}
                  {idStatus.type === '2' && <button onClick={() => handleReturn('4')} disabled={isLoadingReturn_fromHeader || isDisabled} className={`w-20 rounded-md text-xs py-1 font-semibold ${isDisabled || isLoadingReturn_fromHeader ? 'bg-gray-200 text-gray-500' : 'text-red-500  hover:bg-gray-200 hover:scale-105'} transition-all duration-100`}>Return to Editor</button>}
                </div>
              </>}
          </div>
          {isModalOpen && (
            <>
              <div className="fixed inset-0 z-20 bg-black opacity-50" onClick={modal} />
              <section onClick={(e) => e.stopPropagation()} className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
                  <DisbursementVoucher modal={modal} document={doc} flag={true}/>
              </section>
            </>
          )}
        </div>
      </div>
      <section className="w-full h-96 overflow-y-auto">
        <Document document={doc}/>
      </section>
    </section>
  );
};

export default ViewDocument;
