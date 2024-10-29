import {useState, useEffect} from 'react'
import Loader from './Loader'
import axios from 'axios'
import PropTypes from 'prop-types'
import Swal from "sweetalert2"
import { firestore } from "../config/firebase-config"
import { collection, query, doc, onSnapshot, where } from "firebase/firestore"

import { IoAdd } from "react-icons/io5";
import { MdRemove } from "react-icons/md";

import { useAuthContext } from '../hooks/useAuthContext'
import { usePreparerHook } from '../hooks/usePreparerHook'
import { useFundingHook } from '../hooks/useFundingHook'
import { useInitialStateDV } from '../hooks/useInitialStateDV'

import {useSelector} from 'react-redux'

const DisbursementVoucher = ({modal, document = {}, flag}) => {

  const [payeeData, setPayeeData] = useState({ payee: '', TIN: '', address: '',fund: '', date: '', DV: '', origNumber: '', template: '', RC: '', NF_name: '', NF_office: '', TT_tax:'', TT_formula1:'', TT_formula2: '',TT_cost:'', accTitle: [], accCode: [], optionalAmount:[], amount: 0, particular: ''})
  //states
  const [birData, setBirData] = useState({ birParticular: ''})
  const [operatorInput, setOperatorInput] = useState({ors: '', asa: ''})
  const [optionalAmount, setOptionalAmount] = useState(true)
  const [accountOptions, setAccountOptions] = useState([]);

  //payee
  const [payeeOptions, setPayeeOptions] = useState({});
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [payeeKey, setPayeeKey] = useState('');

  //acount title test
  const [inputAccTitle, setInputAccTitle] = useState('');
  const [filteredAcc, setFilteredAcc] = useState({});
  const [showDropdownAcc, setShowDropdownAcc] = useState(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null)

  const [fundCluster, setFundCluster] = useState([])
  const [rc, setRc] = useState([])
  const [cost, setCost] = useState({})
  const [taxData, setTaxData] = useState({})
  const [gross, setGross] = useState({})
  const [nameOffice, setNameOffice] = useState({})
  
  //hooks
  const {createDisbursement, updateDV, getFormData,savePayeeData,loadPayee, isLoading, error} = usePreparerHook()
  const {inputOperator, isLoading: isLoadingForFunding, error: errorForFunding}= useFundingHook()
  const {getDVno} = useInitialStateDV()
  const { user } = useAuthContext() 
  
  //redux
  const permission = useSelector((state) => state.permission)

  useEffect(() => {
    if (flag && document) {
      setPayeeData({
        payee: document.payee || '',
        TIN: document.TIN || '',
        address: document.address || '',
        fund: document.fund || '',
        NF_name: document.NF_name || '',
        NF_office: document.NF_office || '',
        TT_tax: document.TT_tax || '',
        TT_formula1: document.TT_formula1 || '',
        TT_formula2: document.TT_formula2 || '',
        TT_cost: document.TT_cost || '',
        date: formatDateforUpdate(document.date) || '',
        DV: document.DV || '',
        DVKey: document.DVKey || '',
        RC: document.RC || '',
        accTitle: document.accTitle || '',
        optionalAmount: document.optionalAmount || '',
        accCode: document.accCode || '',
        amount: document.amount || 0,
        particular: document.particular || '',
      });
      setBirData({
        birParticular: document.birParticular || '',
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

  const handleChangePayee = (e) => {
    const target = e.target.value.toUpperCase();
    setPayeeData({...payeeData, payee: target})

    if (target) {
      const filtered = Object.entries(payeeOptions)
        .filter(([key]) => key.toLowerCase().includes(target.toLowerCase()))
        .map(([key]) => key)
      setFilteredOptions(filtered)
      if(filtered.length === 0){
        setShowDropdown(false);
      }else{
        setShowDropdown(true);
      }
      console.log(filtered)
      
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelectPayee = (option) => {
    
    
    const selectedPayee = payeeOptions[option].payee
    const selectedAddress = payeeOptions[option].address
    const selectedCost = payeeOptions[option].cost
    const selectedTax = payeeOptions[option].tax
    const selectedTin = payeeOptions[option].tin
    setShowDropdown(false);
    setPayeeKey(option)
    setPayeeData({...payeeData, payee: selectedPayee, address: selectedAddress, TT_cost: selectedCost, TT_tax: selectedTax, TIN: selectedTin})
  };

  const handleChangeAcc = (e, index) => {
    const value = e.target.value;
    setInputAccTitle(value);
    handleFieldChange(index, 'accTitle', value);  

    if (value) {
      const filteredAccounts = Object.entries(accountOptions.account_codes).filter(([key, value]) => {
        return typeof value === 'string' && value.toLowerCase().includes(inputAccTitle)
      });
      const objAcc = Object.fromEntries(filteredAccounts)
      setFilteredAcc((prevFilteredAcc) => ({
        ...prevFilteredAcc,
        [index]: objAcc,
      }));
      setShowDropdownAcc(Object.keys(objAcc).length > 0);
      setActiveDropdownIndex(index);
    } else {
      setShowDropdownAcc(false);
      setFilteredAcc({})
      setActiveDropdownIndex(null);
    }
  };


  const deepEqual = (obj1, obj2) => {
    if (obj1 === obj2) return true;

    if (typeof obj1 !== "object" || typeof obj2 !== "object" || obj1 === null || obj2 === null) {
      return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }

    return true;
  }

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

    const pData = {
      payee: payeeData.payee,
      tin: payeeData.TIN,
      address: payeeData.address,
      tax: payeeData.TT_tax,
      cost: payeeData.TT_cost
    }

    

    if(data.payee_data.accCode.length === 1){
      if(!deepEqual(pData, payeeOptions[payeeKey])){
        savePayeeData(pData)
        console.log('saving payee data', pData)
      }
      console.log('creating DV')
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
    }else{
      const sum = eval(data.payee_data.optionalAmount.join('+'))
      console.log(sum)
      if(Number(data.payee_data.amount) === sum){
        if(!deepEqual(pData, payeeOptions[payeeKey])){
          savePayeeData(pData)
          console.log('saving payee data', pData)
        }
        console.log('creating DV')
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
      }else{
        console.log(Number(data.payee_data.amount) === sum)
        alert('Make sure the amount you input is equal to the total amount.')
        return;
      }
    }
    

    
  }

  //FORM DATA LISTNER
  useEffect(() => {
    const formDataCollection = collection(firestore,'formData');
    const unsubscribe = onSnapshot(formDataCollection, (snapshot) => {
      const newFormData = snapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data();
        return acc;
      }, {});

      sessionStorage.setItem('FormData', JSON.stringify(newFormData));
    }, (error) => {
      console.error("Error fetching formData: ", error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    
    const fetchAccountCode = async () => {
      const storedFormData = sessionStorage.getItem('FormData');
      let form = storedFormData ? JSON.parse(storedFormData) : await getFormData()
      

      setFundCluster(Object.values(form.fundCluster))
      setRc(Object.values(form.ResponsibilityCenter))

      // instead of array create an object = vat: goods, services then nonvat: goods then GSIS: *5% then meralco
      // const costOnly = Object.values(form.TaxType).map(arr => arr[1]);
      // const uniqueCost = [...new Set(costOnly)]
      const result = {}
      Object.entries(form.TaxType).forEach(([key, value]) => {
        const taxCategpry = value[0];
        const type = value[1];
        if(!result[taxCategpry]){
          result[taxCategpry] = new Set();
        }
        result[taxCategpry].add(type);
      });

      Object.keys(result).forEach(key => {
        result[key] = Array.from(result[key]);
      });

      setCost(result)

      setCost(result)

      setTaxData(form.TaxType)

      setNameOffice(form.NameOffice)

      const loadData = await loadPayee()
      setPayeeOptions(loadData)

      
      const storedAccountOptions = localStorage.getItem('account_fields')
      if(storedAccountOptions){
        console.log(`from local storage`)
        console.log(JSON.parse(storedAccountOptions))
        setAccountOptions(JSON.parse(storedAccountOptions));
      }else{
        try{
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/editor/getAccountCode`, {
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
    console.log(data)
    const res = await updateDV(data, document.DVKey)
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

    const res = await inputOperator(operatorInput, payeeData.DVKey)
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
    console.log(payeeData.TT_tax, payeeData.TT_cost)
    if (payeeData.TT_tax && payeeData.TT_cost){
      const key = payeeData.TT_tax + payeeData.TT_cost
      console.log(key)
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

  useEffect(() => {
    const gettingNumber = async () => {
      const fundNoSpace = payeeData.fund.replace(/ /g, '')
      console.log(`getting dv no for ${fundNoSpace}`)
      if(fundNoSpace !== ''){
        const {template, value, currentVal} = await getDVno(fundNoSpace)
        setPayeeData({...payeeData, DV: `${template}${value}`, origNumber: currentVal, template: template})
      }else{
        console.log('no fund selected yet (disbursement voucher)')
      }
    }
    gettingNumber()
  }, [payeeData.fund])

  const isDisabled = user.role === '3'

  return (
    <form onSubmit={(e) => {
        if(user.role === '3'){
          if (permission.data.permission) {
            handleSubmit(e);
          }else{
            handleOpInput(e)
          }
        }else{
          flag && user.role === '4' ? handleUpdate(e) : handleSubmit(e)
        }
      }} action="" className="bg-white w-3/5 h-5/6 p-7 rounded-xl">
      <div className='w-full h-auto py-2 text-center '>
        <h1 className='text-xl font-bold'>{flag ? 'Update Disbursement Voucher' : 'Create Disbursement Voucher'}</h1>
      </div>
      <div className='w-full h-4/5 p-3 overflow-y-auto'>
        <h1 className="font-semibold text-lg mb-2">Personal/Payee Information</h1>
        <div className="w-full h-auto">
          <div className='w-full py-2 relative'>
            <label>Payee</label>
            <input
              className="w-full px-4 py-2 rounded-md border-2 focus:outline-none" 
              disabled={isDisabled && !permission.data.permission}
              type="text" 
              // value={payeeData.payee}
              value={payeeData.payee}
              onChange={handleChangePayee}
              // onChange={(e) => setPayeeData({...payeeData, payee: e.target.value.toUpperCase()})} 
              required  />
              {showDropdown && (
                <ul className="absolute w-full bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto z-10">
                  {filteredOptions.map((option, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectPayee(option)}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                    >
                      {option.replace(/\|/g, ' ')} {/* Each `option` is a name string now */}
                    </li>
                  ))}
                </ul>
              )}
          </div>

          {/* ADDRESS */}
          <div className='w-full flex gap-2'>
            <div className='w-1/2'>
              <label>Address</label>
              <input 
                className="w-full px-4 py-2 rounded-md border-2 focus:outline-none" 
                disabled={isDisabled && !permission.data.permission}
                type="text" 
                value={payeeData.address}
                onChange={(e) => setPayeeData({...payeeData, address: e.target.value})} 
                required  />
            </div>
            <div className='w-1/2'>
              <label>TIN/Employee No.</label>
              <input 
                className="w-full px-4 py-2 rounded-md border-2 focus:outline-none" 
                disabled={isDisabled && !permission.data.permission}
                type="text" 
                value={payeeData.TIN}
                onChange={(e) => {
                  const value = e.target.value;
                  const filteredValue = value.replace(/[^0-9\-]/g, '');
                  setPayeeData({...payeeData, TIN: filteredValue})
                }} 
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
                disabled={isDisabled && !permission.data.permission}
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
                disabled={isDisabled && !permission.data.permission}
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
                disabled={true}
                value={payeeData.DV}
                required  />
            </div>
            <div className="flex flex-col w-1/2">
              <label>Responsibility Center</label>
              <select  className="w-full px-4 py-2 rounded-md border-2 focus:outline-none" 
                onChange={(e) => {setPayeeData({...payeeData, RC: e.target.value})}}
                value={payeeData.RC}
                disabled={isDisabled && !permission.data.permission}
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
                  disabled={isDisabled && !permission.data.permission}
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
           {(user.role === '3' || permission.data.permission) && 
            <div className='w-full'>
              <label>ORS/BURS no.</label>
              <input 
                className="w-full px-4 py-2 rounded-md border-2 focus:outline-none" 
                type="text" 
                value={operatorInput.ors}
                onChange={(e) => {
                  const value = e.target.value;
                  const filteredValue = value.replace(/[^0-9\-]/g, '');
                  setOperatorInput({...operatorInput, ors: filteredValue})
                }}
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
                    disabled={true}
                    value={payeeData.TT_tax}
                    onChange={(e) => setPayeeData({...payeeData, TT_tax: e.target.value})} 
                    required  >
                      <option value="" disabled>Select Tax Type</option>
                      <option value="VAT">VAT</option>
                      <option value="NONVAT">NON VAT</option>
                  </select>  
                </div>
                <div className='w-1/3'>
                  <label>Cost Categories</label>
                  <select 
                    className="w-full px-4 py-2 rounded-md border-2 focus:outline-none" 
                    disabled={isDisabled && !permission.data.permission}
                    value={`${payeeData.TT_tax}-${payeeData.TT_cost}`}
                    onChange={(e) => {
                      const [taxCategory, type] = e.target.value.split('-');
                      setPayeeData({
                        ...payeeData, 
                        TT_cost: type,   
                        TT_tax: taxCategory
                      });
                    }} 
                    required  >
                      <option value="" disabled>Select Cost Category</option>
                      {
                        Object.keys(cost).length > 0 ? (
                          Object.entries(cost).map(([taxCategory, types]) => (
                            <optgroup label={taxCategory} key={taxCategory}>
                              {
                                types.map(type => (
                                  <option key={`${taxCategory}-${type}`} value={`${taxCategory}-${type}`} category={taxCategory}>
                                    {type}
                                  </option>
                                ))
                              }
                            </optgroup>
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
                    step='0.01'
                    disabled={isDisabled && !permission.data.permission}
                    onChange={(e) => setPayeeData({...payeeData, amount: parseFloat(e.target.value)})}
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
                      <input
                        className="w-full px-4 py-2 rounded-md border-2 focus:outline-none"
                        type="text" 
                        placeholder='search here...'
                        value={field.accTitle}
                        disabled={isDisabled && !permission.data.permission}
                        onChange={(e) => {handleChangeAcc(e, index)}}
                        required  />
                        {showDropdownAcc&& activeDropdownIndex === index && (
                          <ul className="w-full bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto z-10">
                            {Object.entries(filteredAcc[index]).length > 0 ? (
                              Object.entries(filteredAcc[index]).map(([key, value]) => {
                                const parts = value.split(':');
                                const lastPart = parts[parts.length - 1];
                                return (
                                <li
                                  key={key}
                                  onClick={() => {
                                    handleFieldChange(index, 'accTitle', lastPart);
                                    handleFieldChange(index, 'accCode', key);
                                    setShowDropdownAcc(false)
                                    setActiveDropdownIndex(null);
                                  }} 
                                  value={lastPart}
                                  className="p-2 cursor-pointer hover:bg-gray-200"
                                >
                                  {lastPart}
                                </li>
                              )}
                            )
                            ) : (
                              <li className="p-2">No matches found</li> // Show message if no matches
                            )}
                          </ul>
                        )}
                    </div>
                    <div className='w-2/5 flex gap-2'>
                      <div className='w-4/5 mb-2'>
                        <label>Amount (Optional)</label>
                        <input
                          className="w-full px-4 py-2 rounded-md border-2 focus:outline-none"
                          type="number"
                          disabled={(isDisabled && !permission.data.permission) || optionalAmount}
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
            
          
          
          {(user.role === '3' || permission.data.permission) && 
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
              disabled={isDisabled && !permission.data.permission}
              placeholder='Write details here...'
              required
            />
          </div>
        </div>
        <h1 className="font-semibold text-lg mt-5 mb-2">BIR Information</h1>
        <div className='w-full'>
          <label>Particulars</label>
          <textarea className="w-full h-52 px-4 py-2 rounded-md border-2 focus:outline-none"
            onChange={(e) => {setBirData({...birData, birParticular: e.target.value})}}
            value={birData.birParticular}
            disabled={isDisabled && !permission.data.permission}
            placeholder='Write details here...'
            required
          />
        </div>
      </div>
      <div className="w-full flex items-center justify-center py-3 gap-4">
        <button 
          type="submit" 
          disabled={user.role === '3' ? isLoadingForFunding : isLoading} 
          className="py-2 px-10 rounded-md bg-customgreen text-white hover:scale-125 transition-all duration-100"
          >{isLoading ? <Loader /> : 'Save'}</button>
        <button 
          onClick={modal}
          className="py-2 px-10 rounded-md border-2 border-customFontColor text-customFontColor hover:scale-125 transition-all duration-100"
          >Back</button>
      </div>
      {(error ||  errorForFunding) && (
        <div className="w-full text-center">
          <h4 className="text-sm text-red-500">{error}</h4>
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
