import {useState, useEffect} from 'react'
import  {useCreateDisbursement}  from '../hooks/useCreateDisbursement'
import {useUpdateDisbursement} from '../hooks/useUpdateDisbursement'
import { useDV } from '../hooks/useDV'
import Loader from './Loader'
import axios from 'axios'
import PropTypes from 'prop-types'
import Swal from "sweetalert2"
import { useAuthContext } from '../hooks/useAuthContext'
import { useInputOperator } from '../hooks/useInputOperator'
import { IoAdd } from "react-icons/io5";
import { MdRemove } from "react-icons/md";

const DisbursementVoucher = ({modal, document = {}, flag}) => {
  const [payeeData, setPayeeData] = useState({ payee: '', TIN: '', address: '',fund: '', date: '', DV: '', RC: '', NF_name: '', NF_office: '', TT_tax:'', TT_formula1:'', TT_formula2: '',TT_cost:'', accTitle: [], accCode: [], optionalAmount:[], amount: 0, particular: '', bir2percent: 0, bir3percent: 0, subAmount: 0, amountDue: 0})
  const [birData, setBirData] = useState({ birRC: '', birParticular: '', birSubAmount: 0})
  const [operatorInput, setOperatorInput] = useState({ors: '', asa: ''})

  const [optionalAmount, setOptionalAmount] = useState(true)

  const [accountOptions, setAccountOptions] = useState([]);
  const {createDisbursement, isLoading, error} = useCreateDisbursement()
  const {updateDV, isLoadingForUpdate, errorForUpdate} = useUpdateDisbursement()
  const {inputOperator, isLoadingForOp, errorForOp} = useInputOperator()
  const{getFormData} = useDV()
  const { user } = useAuthContext()

  const [fundCluster, setFundCluster] = useState([])
  const [rc, setRc] = useState([])
  const [cost, setCost] = useState([])
  const [taxData, setTaxData] = useState({})
  const [gross, setGross] = useState({})
  const [nameOffice, setNameOffice] = useState({})

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
    const updatedPayeeData = {
      ...payeeData,
      TT_formula1: gross.value2,
      TT_formula2: gross.value3,
      accTitle: formFields.map(arr => Object.values(arr)[0]),
      accCode: formFields.map(arr => Object.values(arr)[1]),
      optionalAmount: formFields.map(arr => Object.values(arr)[2])

    };
    const data = {
      payee_data: updatedPayeeData,
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
      const form = await getFormData()
      setFundCluster(Object.values(form.fundCluster))
      setRc(Object.values(form.ResponsibilityCenter))

      const costOnly = Object.values(form.TaxType).map(arr => arr[1]);
      const uniqueCost = [...new Set(costOnly)]
      setCost(uniqueCost)

      setTaxData(form.TaxType)

      setNameOffice(form.NameOffice)


      
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

  const [formFields, setFormFields] = useState([{ accTitle: '', accCode: '', amount: '' }]);

  const addNewField = () => {
    setFormFields([...formFields, { accTitle: '', accCode: '', amount: '' }]);
  };

  const removeField = (index) => {
    const updatedFields = formFields.filter((_, i) => i !== index);
    setFormFields(updatedFields);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...formFields];
    updatedFields[index][field] = value;
    setFormFields(updatedFields);
  };

  const handleButtonClick = (index) => {
    if (index === formFields.length - 1) {
      addNewField();
      setOptionalAmount(formFields.length +1 === 1)
    } else {
      setOptionalAmount(formFields.length -1 === 1)
      removeField(index);
      
    }
  };


  useEffect(() => {
    if (payeeData.TT_tax && payeeData.TT_cost){
      const key = payeeData.TT_tax + payeeData.TT_cost
      if (taxData[key] && taxData[key].length >= 3) {
        setGross({
          value2: taxData[key][2],
          value3: taxData[key][3]
        });
      } else {
        setGross({ value2: '', value3: '' });
      }
    }else{
      setGross({ value2: '', value3: '' });
    }

  }, [payeeData.TT_tax, payeeData.TT_cost])

  const isDisabled = user.role === '3'

  return (
    <form onSubmit={(e) => {
        if(user.role === '3'){
          handleOpInput(e)
        }else{
          flag && user.role === '4' ? handleUpdate(e) : handleSubmit(e)
        }
      }} action="" className="bg-white w-3/5 h-5/6 p-7 rounded-xl">
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

          {/* ADDRESS */}
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
                {fundCluster.length > 0 ? (
                    fundCluster.map((fund, index) => (
                        <option key={index} value={fund}>
                            {fund}
                        </option>
                    ))
                ) : (
                    <option value="" disabled>
                        No options available
                    </option>
                )}
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
                {
                  rc.length > 0 ? (
                    rc.map((res_center, index) => (
                      <option key={index} value={res_center}>
                        {res_center}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No options available</option>
                  )
                }
              </select>
            </div>
          </div>
          <div className='w-full'>
            <div className='w-full flex gap-2'>
              <div className="flex flex-col w-3/5">
                <label>Name and office</label>
                <select className="w-full px-4 py-2 rounded-md border-2 focus:outline-none"
                  onChange={(e) => {
                    const selectedOption = e.target.options[e.target.selectedIndex];
                    setPayeeData({...payeeData, NF_name: e.target.value, NF_office: selectedOption.getAttribute('office')})
                  }}
                  value={payeeData.NF_name}
                  disabled={isDisabled}
                  required
                >
                  <option value="" disabled>Select</option>
                  {Object.entries(nameOffice).length > 0 ? (
                      Object.entries(nameOffice).map(([key, value]) => (
                          <option key={key} value={value[0]} office={value[1]}>
                              {value[0]}
                          </option>
                      ))
                  ) : (
                      <option value="" disabled>
                          No options available
                      </option>
                  )}
                </select>
              </div>
              <div className='w-2/5 flex items-end justify-center'>
                <label>{payeeData.NF_office}</label>
              </div>
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
           {/* TIN AND VAT */}
           <div className='w-full flex gap-2'>
                <div className='w-1/3'>
                  <label>Tax Types</label>
                  <select 
                    className="w-full px-4 py-2 rounded-md border-2 focus:outline-none" 
                    disabled={isDisabled}
                    value={payeeData.TT_tax}
                    onChange={(e) => setPayeeData({...payeeData, TT_tax: e.target.value})} 
                    required  >
                      <option value="" disabled>Select Tax Type</option>
                      <option value="VAT">VAT</option>
                      <option value="NON-VAT">NONVAT</option>
                  </select>  
                </div>
                <div className='w-1/3'>
                  <label>Cost Categories</label>
                  <select 
                    className="w-full px-4 py-2 rounded-md border-2 focus:outline-none" 
                    disabled={isDisabled}
                    value={payeeData.TT_cost}
                    onChange={(e) => setPayeeData({...payeeData, TT_cost: e.target.value})} 
                    required  >
                      <option value="" disabled>Select Cost Category</option>
                      {
                        cost.length > 0 ? (
                          cost.map((uniquecost, index) => (
                            <option key={index} value={uniquecost}>
                              {uniquecost}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>No options available</option>
                        )
                      }
                  </select>
                </div>
                <div className='w-1/3'>
                  <label>Amount</label>
                  <input 
                    className="w-full flex px-4 py-2 rounded-md border-2 focus:outline-none" 
                    type="number" 
                    disabled={isDisabled}
                    onChange={(e) => computeAmount(e.target.value)}
                    placeholder='0'
                    value={payeeData.amount === 0 ? '' : payeeData.amount}
                    required  />
                </div>
            </div>
          
          <div className='w-full mb-2 flex'>
              <div className='w-2/3 flex justify-center items-center'>
                <div className='w-1/2 flex justify-center'>
                  <label>gross{gross.value2}</label>
                </div>
                <div className='w-1/2 flex justify-center'>
                  <label>gross{gross.value3}</label>
                </div>
              </div>

          </div>
          {/* ACCOUNT TITLE */}
          <div className='w-auto h-auto flex flex-col py-2'>
              {
                formFields.map((field, index) => (
                  <div key={index} className='w-full flex gap-2 mb-4'>
                    <div className='w-3/5 mb-2'>
                      <label>Account Title</label>
                      <select
                        className="w-full px-4 py-2 rounded-md border-2 focus:outline-none"
                        onChange={(e) => {
                          // const selectedOption = e.target.options[e.target.selectedIndex];
                          // const newTitle = e.target.value;
                          // const newCode = selectedOption.getAttribute('accCode');
                          // setPayeeData(prevData => ({
                          //   ...prevData,
                          //   accTitle: [...prevData.accTitle, newTitle],
                          //   accCode: [...prevData.accCode, newCode]
                          // }))

                          const [title, code] = e.target.value.split(':');
                          handleFieldChange(index, 'accTitle', title);
                          handleFieldChange(index, 'accCode', code);
                        }}
                        // value={payeeData.accTitle[payeeData.accTitle.length-1]}
                        value={`${field.accTitle}:${field.accCode}`}
                        disabled={isDisabled}
                        required
                      >
                        <option value="" disabled>Select Account Title</option>
                        {
                          accountOptions.account_codes && Object.keys(accountOptions.account_codes).length > 0 ? (
                            Object.entries(accountOptions.account_codes).map(([key, value]) => {
                              const parts = value.split(':');
                              const lastPart = parts[parts.length - 1];
                              return (
                                // <option key={key} value={lastPart} accCode={key}>
                                //   {lastPart}
                                // </option>
                                <option key={key} value={`${lastPart}:${key}`}>
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
                    <div className='w-2/5 flex gap-2'>
                      <div className='w-4/5 mb-2'>
                        <label>Amount (Optional)</label>
                        <input
                          className="w-full px-4 py-2 rounded-md border-2 focus:outline-none"
                          type="number"
                          disabled={isDisabled || optionalAmount}
                          onChange={(e) => handleFieldChange(index, 'amount', e.target.value)}
                          value={field.amount === 0 ? '' : field.amount}
                          placeholder="0"
                        />
                      </div>
                      <div className='flex justify-center items-center gap-2'>
                        <div className='pt-4'>
                        <button
                          className={`text-${index === formFields.length - 1 ? 'customgreen' : 'red-500'} rounded-full text-3xl ${index !== formFields.length - 1 ? 'hover:bg-red-700' : 'hover:bg-customgreen'} hover:text-white`}
                          onClick={() => handleButtonClick(index)}
                          type = "button">
                          
                          {index === formFields.length - 1 ? <IoAdd /> : <MdRemove />}
                        </button>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                ))
              }
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
