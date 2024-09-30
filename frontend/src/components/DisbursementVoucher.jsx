import {useState, useEffect} from 'react'
import axios from 'axios'

const DisbursementVoucher = () => {
  const [payeeData, setPayeeData] = useState({ payee: '', TIN: '', date: '', DV: '', RC: '', accTitle: '', amount: 0, particular: '', bir2percent: 0, bir3percent: 0, subAmount: 0, amountDue: 0})
  const [birData, setBirData] = useState({ birRC: '', birParticular: '', birSubAmount: 0, birAmountDue: 0})


  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(payeeData);
    console.log(birData);

    const data = {
      payee_data: payeeData,
      bir_data: birData
    }

    try{
      const res = await axios.post('http://localhost:4000/editor/createDV', data, {
        withCredentials: true,
      });

      if(res.status === 200){
        console.log(res.data)
      }

    }catch(error){
      console.log(`error at DV: ${error}`)
    }

  }

  return (
    <section className="w-full h-full shadow-slate-200 shadow-customShadowStyle rounded-xl flex bg-white">
      <form onSubmit={handleSubmit} action="" className="w-[40rem] h-full overflow-auto p-5">
        <h1 className="font-semibold text-lg mb-2">Personal/Payee Information</h1>
        <div className="w-full h-auto flex gap-3">
          <input
            className="w-72 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
            type="text" 
            placeholder="Payee"
            onChange={(e) => setPayeeData({...payeeData, payee: e.target.value})} 
            required  />
          <input 
            className="w-72 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
            type="text" 
            placeholder="TIN/Employee No." 
            onChange={(e) => setPayeeData({...payeeData, TIN: e.target.value})} 
            required  />
        </div>
        <h1 className="font-semibold text-lg mt-5 mb-2">Document/Transaction Information</h1>
        <div className="w-[30rem] h-auto flex flex-col gap-3 p-3">
          <div className="flex flex-col">
            <label>Fund Cluster</label>
            <select  className="w-80 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
              onChange={(e) => setPayeeData({...payeeData, fund: e.target.value})}
              required
              //value
            >
              <option value="501 LFP">501 LFP</option>
              <option value="COV">COV</option>
              <option value="501 CARP">501 CARP</option>
              <option value="501 LFP-contract farming">501 LFP-contract farming</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label>Date</label>
            <input 
              className="w-80 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
              type="date" 
              placeholder="Date"
              onChange={(e) => {
                const rawDate = new Date(e.target.value);
                const formattedDate = rawDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "2-digit"
                });
                setPayeeData({...payeeData, date: formattedDate});
              }}
              required  />
          </div>
          <input 
            className="w-80 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
            type="text" 
            placeholder="Disbursement Voucher No." 
            onChange={(e) => setPayeeData({...payeeData, DV: e.target.value})}
            required  />
          <div className="flex flex-col">
            <label>Responsibility Center</label>
            <select  className="w-80 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
              onChange={(e) => {setPayeeData({...payeeData, RC: e.target.value})}}
              required
            >
              <option value="EOD">EOD</option>
              <option value="AFD">AFD</option>
            </select>
          </div>
        </div>
        <h1 className="font-semibold text-lg mt-5 mb-2">Financial/Payment Details</h1>
        <div className="w-auto h-auto flex flex-col gap-3 p-3">
          <label>Training Expenses</label>
          <select  className="w-80 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
            onChange={(e) => {setPayeeData({...payeeData, accTitle: e.target.value})}}
            required
          >
            <option value="Training Expenses:5-02-02-010">Training Expenses</option>
            <option value="Representation Expenses:5-02-99-030">Representation Expenses</option>
            <option value="Information and Communication Technology Equipment:1-06-05-030">Information and Communication Technology Equipment</option>
          </select >
          <input 
            className="w-80 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
            type="number" 
            placeholder="Amount"
            onChange={(e) => {
              //computing BIR(e.g. 3% & 4%), subAmount, amountDue
              const amount = e.target.value
              const bir3percent = amount * 0.03;
              const bir2percent = amount * 0.02;
              const subAmount = bir2percent + bir3percent;
              const amountDue = amount - subAmount;

              const birSubAmount = subAmount;
              const birAmountDue = amountDue;

              setPayeeData({...payeeData, amount: amount, bir2percent: bir2percent, bir3percent: bir3percent, subAmount: subAmount, amountDue: amountDue});
              setBirData({...birData, birSubAmount: birSubAmount, birAmountDue: birAmountDue});
            }}
            required  />
          <textarea className="w-[30rem] h-52 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" placeholder="Particulars"
            onChange={(e) => {setPayeeData({...payeeData, particular: e.target.value})}}
            required
          />
        </div>
        <h1 className="font-semibold text-lg mt-5 mb-2">BIR Information</h1>
        <div className="flex flex-col gap-3 p-3">
          <label>Responsibility Center</label>
          <select  className="w-80 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
            onChange={(e) => {setBirData({...birData, birRC: e.target.value})}}
            required
          >
            <option value="RO">RO</option>
            <option value="ROO">ROO</option>
          </select>
        </div>
        <textarea className="w-[30rem] h-52 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" placeholder="Particulars"
          onChange={(e) => {setBirData({...birData, birParticular: e.target.value})}}
          required
        />
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
