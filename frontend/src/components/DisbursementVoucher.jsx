import {useState} from 'react'
import  {useCreateDisbursement}  from '../hooks/useCreateDisbursement'
import Loader from './Loader'

const DisbursementVoucher = () => {
  const [payeeData, setPayeeData] = useState({ payee: '', TIN: '', address: '', date: '', DV: '', RC: '', accTitle: '', amount: 0, particular: '', bir2percent: 0, bir3percent: 0, subAmount: 0, amountDue: 0})
  const [birData, setBirData] = useState({ birRC: '', birParticular: '', birSubAmount: 0, birAmountDue: 0})

  const [accountOptions, setAccountOptions] = useState([]);
  const {createDisbursement, isLoading, error} = useCreateDisbursement()


  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(payeeData);
    console.log(birData);

    const data = {
      payee_data: payeeData,
      bir_data: birData
    }

    await createDisbursement(data)

  }

  const formatDate = (rawDate) => {
    const formattedDate = rawDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit"
    });
    return formattedDate
  }

  const computeAmount = (amount) => {
    const parsedAmount = parseFloat(amount)
    const bir3percent = parsedAmount * 0.03;
    const bir2percent = parsedAmount * 0.02;
    const subAmount = bir2percent + bir3percent;
    const amountDue = parsedAmount - subAmount;

    const birSubAmount = subAmount;
    const birAmountDue = amountDue;

    setPayeeData({...payeeData, amount: parsedAmount, bir2percent: bir2percent, bir3percent: bir3percent, subAmount: subAmount, amountDue: amountDue});
    setBirData({...birData, birSubAmount: birSubAmount, birAmountDue: birAmountDue});
  }

  useEffect(() => {
    const fetchAccountCode = async () => {
      const storedAccountOptions = localStorage.getItem('accountOptions');
      if(storedAccountOptions){
        console.log('hit')
        setAccountOptions(JSON.parse(storedAccountOptions));
      }else{
        try{
          const response = await axios.get('http://localhost:4000/editor/getAccountCode', {
            withCredentials: true
          })

          if(response.status === 200){
            const options = response.data;
            localStorage.setItem('accountOptions', JSON.stringify(options));
            setAccountOptions(options);
            console.log('success fetching')
          }else{
            console.log('fail to fetch')
          }

        }catch(error){
          console.error('Error fetching account titles:', error);
        }
      }
    }
    fetchAccountCode();
  }, [])

  return (
    <section className="w-full h-full flex">
      <form onSubmit={handleSubmit} action="" className="w-3/5 h-full overflow-auto p-7 shadow-slate-200 shadow-customShadowStyle rounded-xl bg-white">
        <h1 className="font-semibold text-lg mb-2">Personal/Payee Information</h1>
        <div className="w-full h-auto">
          <div className='w-full h-auto flex gap-3 pb-3'>
            <input
              className="w-72 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
              type="text" 
              placeholder="Payee"
              value={payeeData.payee}
              onChange={(e) => setPayeeData({...payeeData, payee: e.target.value})} 
              required  />
            <input 
              className="w-72 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
              type="text" 
              placeholder="TIN/Employee No." 
              value={payeeData.TIN}
              onChange={(e) => setPayeeData({...payeeData, TIN: e.target.value})} 
              required  />
          </div>
          <input 
            className="w-full peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
            type="text" 
            placeholder="Address" 
            value={payeeData.address}
            onChange={(e) => setPayeeData({...payeeData, address: e.target.value})} 
            required  />
        </div>
        <h1 className="font-semibold text-lg mt-5 mb-2">Document/Transaction Information</h1>
        <div className="w-[30rem] h-auto flex flex-col gap-3 p-3">
          <div className="flex flex-col">
            <label>Fund Cluster</label>
            <select  className="w-80 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
              onChange={(e) => setPayeeData({...payeeData, fund: e.target.value})}
              value={payeeData.fund}
              required
              //value
            >
              <option value="" disabled>Select Fund Cluster</option>
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
              onChange={(e) => setPayeeData({...payeeData, date: formatDate(new Date(e.target.value))})}
              required  />
          </div>
          <input 
            className="w-80 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
            type="text" 
            placeholder="Disbursement Voucher No." 
            value={payeeData.DV}
            onChange={(e) => setPayeeData({...payeeData, DV: e.target.value})}
            required  />
          <div className="flex flex-col">
            <label>Responsibility Center</label>
            <select  className="w-80 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
              onChange={(e) => {setPayeeData({...payeeData, RC: e.target.value})}}
              value={payeeData.RC}
              required
            >
              <option value="" disabled>Select Responsibilty Center</option>
              <option value="EOD">EOD</option>
              <option value="AFD">AFD</option>
            </select>
          </div>
        </div>
        <h1 className="font-semibold text-lg mt-5 mb-2">Financial/Payment Details</h1>
        <div className="w-auto h-auto flex flex-col gap-3 p-3">
          <label>Account Title</label>
          <select  className="w-80 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
            onChange={(e) => {setPayeeData({...payeeData, accTitle: e.target.value})}}
            value={payeeData.accTitle}
            required
          >
            <option value="" disabled>Select Account Title</option>
            <option value="Training Expenses:5-02-02-010">Training Expenses</option>
            <option value="Representation Expenses:5-02-99-030">Representation Expenses</option>
            <option value="Information and Communication Technology Equipment:1-06-05-030">Information and Communication Technology Equipment</option>
          </select >
          <input 
            className="w-80 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" 
            type="number" 
            placeholder="Amount"
            onChange={(e) => computeAmount(e.target.value)}
            value={payeeData.amount}
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
            value={birData.birRC}
            required
          >
            <option value="" disabled>Select Responsibilty Center</option>
            <option value="RO">RO</option>
            <option value="ROO">ROO</option>
          </select>
        </div>
        <textarea className="w-[30rem] h-52 peer z-[21] px-4 py-2 rounded-md outline-none duration-200 ring-2 ring-[transparent] focus:ring-customgreen" placeholder="Particulars"
          onChange={(e) => {setBirData({...birData, birParticular: e.target.value})}}
          value={birData.birParticular}
          required
        />
        <div className="w-full flex items-center justify-center py-3">
          <button 
          type="submit" 
          disabled={isLoading}
          className="py-2 px-10 rounded-md bg-customgreen text-white hover:scale-125 transition-all duration-100"
          >{isLoading ? <Loader/> : 'Save'}</button>
        </div>
        {error && (<div className="w-full text-center">
            <h4 className="text-sm text-red-600">{error}</h4>
        </div>)}
      </form>
    </section>
  )
}

export default DisbursementVoucher;
