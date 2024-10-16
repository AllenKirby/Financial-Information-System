import {useState, useEffect} from 'react'
import  {useCreateDisbursement}  from '../hooks/useCreateDisbursement'
import {useUpdateDisbursement} from '../hooks/useUpdateDisbursement'
import Loader from './Loader'
import axios from 'axios'
import PropTypes from 'prop-types'
import Swal from "sweetalert2"
import { useAuthContext } from '../hooks/useAuthContext'
import { useInputOperator } from '../hooks/useInputOperator'

const DisbursementVoucher = ({modal, document = {}, flag}) => {
  const [payeeData, setPayeeData] = useState({ payee: '', TIN: '', address: '',fund: '', date: '', DV: '', RC: '', accTitle: '', accCode: '', amount: 0, particular: '', bir2percent: 0, bir3percent: 0, subAmount: 0, amountDue: 0})
  const [birData, setBirData] = useState({ birRC: '', birParticular: '', birSubAmount: 0})
  const [operatorInput, setOperatorInput] = useState({ors: '', asa: ''})

  const [accountOptions, setAccountOptions] = useState([]);
  const {createDisbursement, isLoading, error} = useCreateDisbursement()
  const {updateDV, isLoadingForUpdate, errorForUpdate} = useUpdateDisbursement()
  const {inputOperator, isLoadingForOp, errorForOp} = useInputOperator()
  const { user } = useAuthContext()

  useEffect(() => {
    if (flag && document) {
      setPayeeData({
        payee: document.payee || '',
        TIN: document.TIN || '',
        address: document.address || '',
        fund: document.fund || '',
        date: formatDateforUpdate(document.date) || '',
        DV: document.DV || '',
        RC: document.RC || '',
        accTitle: document.accTitle || '',
        accCode: document.accCode || '',
        amount: document.amount || 0,
        particular: document.particular || '',
        bir2percent: document.bir2percent || 0,
        bir3percent: document.bir3percent || 0,
        subAmount: document.subAmount || 0,
        amountDue: document.amountDue || 0,
      });
      setBirData({
        birRC: document.birRC || '',
        birParticular: document.birParticular || '',
        birSubAmount: document.birSubAmount || 0,
      });
      setOperatorInput({
        ors: document.ORSBURS || '',
        asa: document.ASA || ''
      })
    }
  }, [document, flag]);

  const formatDateforUpdate = (rawDate) => {
    if (typeof rawDate === 'string') {
      // Parse the date string into a Date object
      const date = new Date(rawDate);
  
      // Check if the date is valid
      if (!isNaN(date)) {
        // Convert to 'yyyy-MM-dd' format
        const formattedDate = date.toISOString().split('T')[0];
        return formattedDate;
      }
    }
    return 
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(payeeData);
    console.log(birData);
    const data = {
      payee_data: payeeData,
      bir_data: birData
    }

    const res = await createDisbursement(data)

    if(res){
      Swal.fire({
        title: "Saved",
        text: "Dibursement Voucher is successfully created!",
        icon: "success",
        confirmButtonColor: "#009933"
      });
    }
    modal()
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
      const storedAccountOptions = localStorage.getItem('account_fields')
      if(storedAccountOptions){
        console.log(`from local storage`)
        console.log(JSON.parse(storedAccountOptions))
        setAccountOptions(JSON.parse(storedAccountOptions));
      }else{
        try{
          const response = await axios.get('http://localhost:4000/editor/getAccountCode', {
            withCredentials: true
          })

          if(response.status === 200){
            const options = response.data;
            console.log(options)
            localStorage.setItem('account_fields', JSON.stringify(options));
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

  const handleUpdate = async(e) => {
    e.preventDefault()

    const data = {
      payee_data: payeeData,
      bir_data: birData
    }

    const res = await updateDV(data, document.DV)
    if(res){
      Swal.fire({
        title: "Saved",
        text: "Disbursement Voucher is successfully updated!",
        icon: "success",
        confirmButtonColor: "#009933"
      });
      modal()
    }
  }

  const handleOpInput = async(e) => {
    e.preventDefault()

    const res = await inputOperator(operatorInput, payeeData.DV)
    if(res){
      Swal.fire({
        title: "Saved",
        text: "Disbursement Voucher is successfully save!",
        icon: "success",
        confirmButtonColor: "#009933"
      });
      modal()
    }
  }

  const isDisabled = user.role === '3'

  return (
    <form onSubmit={(e) => {
        if(user.role === '3'){
          handleOpInput(e)
        }else{
          flag && user.role === '4' ? handleUpdate(e) : handleSubmit(e)
        }
      }} action="" className="bg-white w-2/5 h-5/6 p-7 rounded-xl">
      <div className='w-full h-auto py-2 text-center'>
        <h1 className='text-xl font-bold'>{flag ? 'Update Disbursement Voucher' : 'Create Disbursement Voucher'}</h1>
      </div>
      <div className='w-full h-4/5 p-3 overflow-y-auto'>
        <h1 className="font-semibold text-lg mb-2">Personal/Payee Information</h1>
        <div className="w-full h-auto">
          <div className='w-full py-2'>
            <label>Payee</label>
            <input
              className="w-full px-4 py-2 rounded-md border-2 focus:outline-none" 
              disabled={isDisabled}
              type="text" 
              value={payeeData.payee}
              onChange={(e) => setPayeeData({...payeeData, payee: e.target.value})} 
              required  />
          </div>
          <div className='w-full flex gap-2'>
            <div className='w-1/2'>
              <label>Address</label>
              <input 
                className="w-full px-4 py-2 rounded-md border-2 focus:outline-none" 
                disabled={isDisabled}
                type="text" 
                value={payeeData.address}
                onChange={(e) => setPayeeData({...payeeData, address: e.target.value})} 
                required  />
            </div>
            <div className='w-1/2'>
              <label>TIN/Employee No.</label>
              <input 
                className="w-full px-4 py-2 rounded-md border-2 focus:outline-none" 
                disabled={isDisabled}
                type="text" 
                value={payeeData.TIN}
                onChange={(e) => setPayeeData({...payeeData, TIN: e.target.value})} 
                required  />
            </div>
          </div>
        </div>
        <h1 className="font-semibold text-lg mt-5 mb-2">Document/Transaction Information</h1>
        <div className="w-full h-auto flex flex-col gap-3 py-2">
          <div className='w-full flex gap-2'>
            <div className="flex flex-col w-4/6">
              <label>Fund Cluster</label>
              <select className="w-full px-4 py-2 rounded-md border-2 focus:outline-none" 
                onChange={(e) => setPayeeData({...payeeData, fund: e.target.value})}
                value={payeeData.fund}
                disabled={isDisabled}
                required
                //value
              >
                <option value="" disabled>Select</option>
                <option value="501 LFP">501 LFP</option>
                <option value="COV">501 COB</option>
                <option value="501 CARP">501 CARP</option>
                <option value="501 LFP-contract farming">Contract farming</option>
              </select>
            </div>
            <div className="flex flex-col w-2/6">
              <label>Date</label>
              <input 
                className="w-full px-4 py-2 rounded-md border-2 focus:outline-none" 
                type="date" 
                disabled={isDisabled}
                value={payeeData.date}
                placeholder="Date"
                onChange={(e) => setPayeeData({...payeeData, date: e.target.value})}
                required  />
            </div>
          </div>
          <div className='w-full flex gap-2'>
            <div className='w-1/2'>
              <label>DV No.</label>
              <input 
                className="w-full px-4 py-2 rounded-md border-2 focus:outline-none" 
                type="text" 
                disabled={isDisabled} 
                value={payeeData.DV}
                onChange={(e) => setPayeeData({...payeeData, DV: e.target.value})}
                required  />
            </div>
            <div className="flex flex-col w-1/2">
              <label>Responsibility Center</label>
              <select  className="w-full px-4 py-2 rounded-md border-2 focus:outline-none" 
                onChange={(e) => {setPayeeData({...payeeData, RC: e.target.value})}}
                value={payeeData.RC}
                disabled={isDisabled}
                required
              >
                <option value="" disabled>Select </option>
                <option value="EOD">EOD</option>
                <option value="AFD">AFD</option>
              </select>
            </div>
          </div>
           {user.role === '3' && 
            <div className='w-full'>
              <label>ORS/BURS no.</label>
              <input 
                className="w-full px-4 py-2 rounded-md border-2 focus:outline-none" 
                type="text" 
                value={operatorInput.ors}
                onChange={(e) => setOperatorInput({...operatorInput, ors: e.target.value})}
                required  />
            </div>
           }
        </div>
        <h1 className="font-semibold text-lg mt-5 mb-2">Financial/Payment Details</h1>
        <div className="w-auto h-auto flex flex-col py-2">
          <div className='w-full mb-2'>
            <label>Account Title</label>
            <select  
              className="w-full px-4 py-2 rounded-md border-2 focus:outline-none" 
              onChange={(e) => {
                const [title, code] = e.target.value.split(':');
                setPayeeData({...payeeData, accTitle: title, accCode: code});
              }}
              value={`${payeeData.accTitle}:${payeeData.accCode}`}
              disabled={isDisabled}
              required
            >
              <option value="" disabled>Select Account Title</option>
              {
                accountOptions.account_codes && Object.keys(accountOptions.account_codes).length > 0 ? (
                  Object.entries(accountOptions.account_codes).map(([key, value], index) => {
                    // Split the field value by ':' and take the last part
                    const parts = value.split(':');
                    const lastPart = parts[parts.length - 1];
                    
                    return (
                      <option key={index} value={`${lastPart}:${key}`}>
                        {lastPart}
                      </option>
                    );
                  })
                ) : (
                  <option>Loading...</option>
                )
              }
            </select>
          </div>
          <div className='w-full mb-2'>
            <label>Amount</label>
            <input 
              className="w-full px-4 py-2 rounded-md border-2 focus:outline-none" 
              type="number" 
              disabled={isDisabled}
              onChange={(e) => computeAmount(e.target.value)}
              value={payeeData.amount}
              required  />
          </div>
          {user.role === '3' && 
            <div className='w-full'>
              <label>ASA No.</label>
              <input 
                className="w-full px-4 py-2 rounded-md border-2 focus:outline-none" 
                type="text" 
                value={operatorInput.asa}
                onChange={(e) => setOperatorInput({...operatorInput, asa: e.target.value})}
                required/>
            </div>
          }
          <div className='w-full'>
            <label>Particulars</label>
            <textarea className="w-full h-52 peer px-4 py-2 rounded-md border-2 focus:outline-none"
              onChange={(e) => {setPayeeData({...payeeData, particular: e.target.value})}}
              value={payeeData.particular}
              disabled={isDisabled}
              placeholder='Write details here...'
              required
            />
          </div>
        </div>
        <h1 className="font-semibold text-lg mt-5 mb-2">BIR Information</h1>
        <div className="flex flex-col py-3">
          <label>Responsibility Center</label>
          <select  className="w-full px-4 py-2 rounded-md border-2 focus:outline-none" 
            onChange={(e) => {setBirData({...birData, birRC: e.target.value})}}
            value={birData.birRC}
            disabled={isDisabled}
            required
          >
            <option value="" disabled>Select</option>
            <option value="RO">RO</option>
            <option value="ROO">ROO</option>
          </select>
        </div>
        <div className='w-full'>
          <label>Particulars</label>
          <textarea className="w-full h-52 px-4 py-2 rounded-md border-2 focus:outline-none"
            onChange={(e) => {setBirData({...birData, birParticular: e.target.value})}}
            value={birData.birParticular}
            disabled={isDisabled}
            placeholder='Write details here...'
            required
          />
        </div>
      </div>
      <div className="w-full flex items-center justify-center py-3 gap-4">
        <button 
          type="submit" 
          disabled={()=> {
            if(user.role === '3'){
              return isLoadingForOp
            }
            flag ? isLoadingForUpdate : isLoading
          }}
          className="py-2 px-10 rounded-md bg-customgreen text-white hover:scale-125 transition-all duration-100"
          >{isLoading ? <Loader /> : 'Save'}</button>
        <button 
          onClick={modal}
          className="py-2 px-10 rounded-md border-2 border-customFontColor text-customFontColor hover:scale-125 transition-all duration-100"
          >Back</button>
      </div>
      {(error || errorForUpdate || errorForOp) && (
        <div className="w-full text-center">
          <h4 className="text-sm text-red-500">{error ? error : errorForUpdate}</h4>
        </div>
      )}
    </form>
  )
}
DisbursementVoucher.propTypes = {
  modal: PropTypes.func.isRequired,
  flag: PropTypes.bool.isRequired,
  document: PropTypes.object
}

export default DisbursementVoucher;
