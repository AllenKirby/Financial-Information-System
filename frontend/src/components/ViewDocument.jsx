import { useParams } from "react-router-dom";
import { useDisbursementContext } from "../hooks/useDisbursementContext";
import { useEffect, useState } from "react";
import Document from "./Document";
import html2pdf from 'html2pdf.js'

const ViewDocument = () => {
  const { id } = useParams();
  const { documents } = useDisbursementContext();
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    if (documents && documents.documents) { 
      const selectedDocument = documents.documents.find((document) => document.data.DV === id);
      if (selectedDocument) {
        setDoc(selectedDocument);
      } else {
        console.log("Error finding the document");
      }
    }
  }, [documents, id]); 
  if (!doc) {
    return <div>Loading or no document found...</div>;
  }

  const handleDownload = () => {
    const pdf = document.getElementById('pdf')
    html2pdf(pdf)
  }

  return (
    <section className="w-full h-auto">
      <button onClick={() => window.history.back()}>Back</button>
      <button onClick={handleDownload}>Download
      </button>
      <Document document={doc}/>
    </section>
  );
};

export default ViewDocument;
