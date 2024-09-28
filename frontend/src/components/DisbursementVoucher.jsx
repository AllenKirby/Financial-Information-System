import html2pdf from 'html2pdf.js';
import Document from "./Document";

const DisbursementVoucher = () => {

  const downloadPDF = () => {
    const pdf = document.getElementById('pdf');
    html2pdf(pdf);
  }

  return (
    <section className="w-full h-auto">
      <button onClick={downloadPDF}>Download</button>
      <Document/>
    </section>
  )
}

export default DisbursementVoucher;
