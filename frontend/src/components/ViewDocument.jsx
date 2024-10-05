import { useParams } from "react-router-dom";
import { useDisbursementContext } from "../hooks/useDisbursementContext";
import { useEffect, useState } from "react";
import Document from "./Document";
import axios from "axios";
//import html2pdf from 'html2pdf.js'
import { useOpDisbursementContext } from "../hooks/useOpDisbursementContext";

const ViewDocument = () => {
  const { id } = useParams();
  const { documents } = useDisbursementContext();
  const [doc, setDoc] = useState(null);
  const {OpDocuments} = useOpDisbursementContext();

  useEffect(() => {
    if (documents) { 
      const selectedDocument = Object.entries(documents).find(([,document]) => document.DV === id);
      if (selectedDocument) {
        setDoc(selectedDocument);
      } else {
        console.log("Error finding the document");
      }
    }else if (OpDocuments){
      const selectedDocument = Object.entries(OpDocuments).find((document) => document.DV === id);
      if (selectedDocument) {
        setDoc(selectedDocument);
      } else {
        console.log("Error finding the operator document");
      }
    }
  }, [OpDocuments, documents, id]); 
  if (!doc) {
    return <div>Loading or no document found...</div>;
  }

  /*const handleDownload = () => {
    const pdf = document.getElementById('pdf')
    html2pdf(pdf)
        .from(pdf)
        .set({
          image: { type: 'jpeg', quality: 0.98 },  // Adjust image quality
          pagebreak: { mode: 'avoid-all' },        // Avoid breaking elements
          jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait', precision: 16 } // precision for higher quality
        })
        .save();
  }*/

  const handleSubmit = async() => {
    try{
      const data = {
        DV: id,
        payee: doc[1].payee
      }
      const res = await axios.post('http://localhost:4000/editor/passRecord', data, {
        withCredentials: true
      });
      if(res.status === 200){
        console.log(`passed record: ${res.data}`)
      }
    }catch(error){
      console.log('Error in passing records', error)
    }
  }

  return (
    <section className="w-full h-auto">
      <div className="px-5 py-4 flex items-center justify-between"> 
        <button onClick={() => window.history.back()} className="px-7 py-2 bg-customgreen rounded-xl text-white hover:scale-125 transition-all duration-150">Back</button>
        <button onClick={handleSubmit} className="px-7 py-2 bg-customgreen rounded-xl text-white hover:scale-125 transition-all duration-150">Submit</button>
      </div>
      <Document document={doc}/>
    </section>
  );
};

export default ViewDocument;
