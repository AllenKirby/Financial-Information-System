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


const ViewDocument = () => {
  const { id } = useParams();
  const { documents } = useDisbursementContext();
  const [doc, setDoc] = useState(null);
  const {OpDocuments} = useOpDisbursementContext();
  const [idStatus, setIdStatus] = useState({id: '', status: '', type: ''})
  const [dropDown, setDropDown] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { deleteDV } = useDeleteDisbursement();
  const { submitDoc, isLoading, error } = useToOperator()

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
    if (documents) { 
      const selectedDocument = Object.entries(documents).find(([,document]) => document.DV === idStatus.id);
      if (selectedDocument) {
        console.log('Editor',selectedDocument)
        setDoc(selectedDocument);
      } else {
        console.log("Error finding the document");
      }
    }else if (OpDocuments){
      const selectedDocument = Object.entries(OpDocuments.documents).find(([, document]) => document.key === idStatus.id);
      if (selectedDocument) {
        console.log('Operator',selectedDocument)
        setDoc(selectedDocument);
      } else {
        console.log("Error finding the operator document");
      }
    }
  }, [OpDocuments, documents, idStatus]); 

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
        })
        .save();
  }

  const handleSubmit = async() => {
    const data = {
      DV: idStatus.id,
      payee: doc[1].payee
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
  const isDisabled = idStatus.status === 'In Review' && idStatus.type === '4';

  const returnDV = async() => {

  }

  return (
    <section className="w-full h-auto">
      <div className="px-5 py-4 flex items-center justify-between"> 
        <button onClick={() => window.history.back()} className="px-5 py-2 bg-customgreen rounded-lg text-white hover:scale-125 transition-all duration-150"><FaAngleLeft size={20}/></button>
        <div className="flex items-center justify-center gap-16">
          <button disabled={isDisabled || isLoading} onClick={handleSubmit} className={`px-5 py-2 rounded-lg ${ isDisabled ? `bg-gray-200 text-gray-500` : `bg-customgreen text-white hover:scale-125`} transition-all duration-150`}>Submit</button>
          {/* Options column */}
          <div className=" flex items-center justify-end w-1/6 relative">
            <button onClick={() => setDropDown(!dropDown)} className="flex z-20 px-3 py-2 gap-2 rounded-lg bg-customgreen text-white">
              {dropDown ? <FaAngleDown size={20}/> : <FaAngleUp size={20}/>} More
            </button>
            {dropDown && <>
                <div className="absolute top-6 z-0 right-0 bg-white rounded-xl px-1 pb-1 pt-5 border-2 border-gray-200 flex flex-col gap-1">
                  <button disabled={isDisabled} onClick={modal} className={`w-20 rounded-md text-xs py-1 font-semibold ${isDisabled ? 'bg-gray-200 text-gray-500' : 'text-customFontGreen hover:bg-gray-200 hover:scale-105'} transition-all duration-100`}>Update</button>
                  <button onClick={handleDownload} className="w-20 rounded-md text-xs py-1 font-semibold text-customFontGreen hover:bg-gray-200 hover:scale-105 transition-all duration-100">Download</button>
                  <button disabled={isDisabled} onClick={idStatus.type === 'Editor' ? delDV : returnDV} className={`w-20 rounded-md text-xs py-1 font-semibold ${isDisabled ? 'bg-gray-200 text-gray-500' : 'text-red-500  hover:bg-gray-200 hover:scale-105'} transition-all duration-100`}>{idStatus.type === 'Editor' ? 'Delete' : 'Return'}</button>
                </div>
              </>}
          </div>
          {isModalOpen && (
            <>
              <div className="fixed inset-0 z-20 bg-black opacity-50" onClick={modal} />
              <section onClick={(e) => e.stopPropagation()} className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
                  <DisbursementVoucher modal={modal} document={doc[1]} flag={true}/>
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
