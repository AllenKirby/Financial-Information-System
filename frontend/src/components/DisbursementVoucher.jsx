//import html2pdf from 'html2pdf.js';
//import Document from "./Document";

const DisbursementVoucher = () => {

  /*const downloadPDF = () => {
    const pdf = document.getElementById('pdf');
    html2pdf(pdf);
  }*/

  return (
    <section className="w-full h-full shadow-slate-200 shadow-customShadowStyle rounded-xl flex">
      <form action="" className="w-[40rem] h-full overflow-auto p-5">
        <h1 className="font-semibold text-lg mb-2">Personal/Payee Information</h1>
        <div className="w-full h-auto flex gap-3">
          <input
            className="w-72 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
            type="text" 
            placeholder="Payee" 
            required  />
          <input 
            className="w-72 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
            type="text" 
            placeholder="TIN/Employee No." 
            required  />
        </div>
        <h1 className="font-semibold text-lg mt-5 mb-2">Document/Transaction Information</h1>
        <div className="w-[30rem] h-auto flex flex-col gap-3 p-3">
          <input 
            className="w-80 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
            type="text" 
            placeholder="Fund Cluster" 
            required  />
          <div className="flex flex-col">
            <label>Date</label>
            <input 
              className="w-80 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
              type="date" 
              placeholder="Date" 
              required  />
          </div>
          <input 
            className="w-80 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
            type="text" 
            placeholder="ORS/BURS No." 
            required  />
          <input 
            className="w-80 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
            type="text" 
            placeholder="Responsibility Center" 
            required  />
        </div>
        <h1 className="font-semibold text-lg mt-5 mb-2">Financial/Payment Details</h1>
        <div className="w-auto h-auto flex flex-col gap-3">
          <input 
            className="w-80 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
            type="number" 
            placeholder="Amount" 
            required  />
          <label>Training Expenses</label>
          <select  className="w-80 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" >
            <option value="asdas">dasdsa</option>
            <option value="asdas">dasdsa</option>
            <option value="asdas">dasdsa</option>
          </select >
          <label>Due to BIR (3%)</label>
          <select className="w-80 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" >
            <option value="asdas">dasdsa</option>
            <option value="asdas">dasdsa</option>
            <option value="asdas">dasdsa</option>
          </select>
          <label>Due to BIR (2%)</label>
          <select  className="w-80 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" >
            <option value="asdas">dasdsa</option>
            <option value="asdas">dasdsa</option>
            <option value="asdas">dasdsa</option>
          </select>
          <label>Cash in Bank</label>
          <select  className="w-80 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" >
            <option value="asdas">dasdsa</option>
            <option value="asdas">dasdsa</option>
            <option value="asdas">dasdsa</option>
          </select>
          <textarea className="w-[30rem] h-52 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" placeholder="Particulars"></textarea>
        </div>
        <div className="w-full flex items-center justify-center py-3">
            <button 
            type="submit" 
            className="py-2 px-10 rounded-md bg-customgreen text-white hover:scale-125 transition-all duration-100"
            >Save</button>
        </div>
      </form>
      <section className="w-fit p-5 flex items-center justify-center">
        <div className="container w-96 h-full bg-custom rounded-xl"></div>
      </section>
    </section>
  )
}

export default DisbursementVoucher;
