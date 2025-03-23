import {useState, useEffect} from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import Swal from "sweetalert2"
import { firestore } from "../../config/firebase-config"
import { collection, onSnapshot } from "firebase/firestore"

import { IoAdd } from "react-icons/io5";
import { MdRemove } from "react-icons/md";
import LargeLoader from '../Loaders/LargeLoader'

import addressJSON from '../../assets/json/region_4a_provinces_municipalities_array.json'

import { useAuthContext } from '../../hooks/useAuthContext'
import { usePreparerHook } from '../../hooks/usePreparerHook'
import { useInitialStateDV } from '../../hooks/useInitialStateDV'

import {useSelector} from 'react-redux'
import { useFundingHook } from '../../hooks/useFundingHook'
import { useLocation } from 'react-router-dom'

// import {retrieveProjectName} from '../../hooks/useFundingHook'

const DisbursementVoucher = ({modal, document = {}, flag, tab}) => {
   //hooks
   const {createDisbursement, updateDV, getFormData,savePayeeData,loadPayee,add_payroll_records, isLoading, error} = usePreparerHook()
   const { handleBURCreation, handleBURUpdate, isLoading: isLoadingBUR, error: errorBUR } = useFundingHook()
   const {getDVno} = useInitialStateDV()
   const { user } = useAuthContext() 
   const location = useLocation()

  const [payeeData, setPayeeData] = useState({ 
    payee: '', 
    TIN: '', 
    address: '',
    fund: '', date: '', 
    DV: '', 
    MOP: 'Others', 
    specifiedMOP: 'LCCA',  
    origNumber: '', 
    template: '', 
    RC: '', 
    NF_name: '', 
    NF_office: '', 
    TT_tax:'', 
    TT_formula1:'', 
    TT_formula2: '',
    TT_cost:'',
    accCategory: [], 
    accTitle: [], 
    accCode: [], 
    optionalAmount:[],
    additionalLabels: [],
    additionalCode: [], 
    amount: 0, 
    particular: '',
    accountingHead_name: '',
    accountingHead_office: '',
    agencyHead_name: '',
    agencyHead_office: '',
    PR_No: '',
    PO_No: '',
    IAR_No: '',
    // ASA_No_ref: ''
    })

  const [gsis, setGSIS] = useState({stamp: 0, dst: 0, vat12: 0})
  const [meralco, setMeralco] = useState({meralcoVAT: 0, meralcoNONVAT: 0})
  const [formFields, setFormFields] = useState([{accCategory:'', accTitle: '', accCode: '', amount: '', labels: '' }]);
  const [BURAmount, setBURAmount] = useState([{title:'',  amount: ''}]);
  const [BudgetFields, setBudgetFields] = useState([{ASA: '', ASAproject: '', amount: ''}])
  const [BURData, setBURData] = useState({
    payee: '', 
    office: 'NIA Region IV-A',
    No: '',
    GAA: '',
    MFOPAP: '',
    uacsCode: '',
    NFNameB: '',
    NFOfficeB: ''
  })
  //states
  const [birData, setBirData] = useState({ birParticular: ''})
  //const [operatorInput, setOperatorInput] = useState({ors: '', asa: ''})
  const [optionalAmount, setOptionalAmount] = useState(true)
  const [accountOptions, setAccountOptions] = useState([]);
  const [activeTab, setActiveTab] = useState(flag ? document.activeTab : tab)

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
  const [ASANo, setASANo] = useState({})
  
  //redux
  const permission = useSelector((state) => state.permission)

  console.log(tab)

  useEffect(() => {
    if (flag && document) {
      setPayeeData((prevData) => {
        const updatedData = {
          ...prevData,
          payee: document.payee || '',
          TIN: document.TIN || '',
          address: document.address || '',
          fund: document.fund || '',
          NF_name: document.NF_name || '',
          MOP: document.MOP || '',
          specifiedMOP: document.specifiedMOP || '',
          NF_office: document.NF_office || '',
          TT_tax: document.TT_tax || '',
          TT_formula1: document.TT_formula1 || '',
          TT_formula2: document.TT_formula2 || '',
          TT_cost: document.TT_cost || '',
          date: formatDateforUpdate(document.date) || '',
          DV: document.DV || '',
          DVKey: document.DVKey || '',
          RC: document.RC || '',
          amount: document.amount || 0,
          particular: document.particular || '',
          accountingHead_name: document.accountingHead_name || '',
          accountingHead_office: document.accountingHead_office || '',
          agencyHead_name: document.agencyHead_name || '',
          agencyHead_office: document.agencyHead_office || '',
          PR_No: document.PR_No || '',
          PO_No: document.PO_No || '',
          IAR_No: document.IAR_No || '',
          // ASA_No_ref: document.ASA_No_ref || ''
        };
        return updatedData;
      });
      setBirData({
        birParticular: document.birParticular || '',
      });
      // setOperatorInput({
      //   ors: document.ORSBURS || '',
      //   asa: document.ASA || ''
      // })

      if (document.activeTab === 'To Payment'){
        const initialFormFields = (document.accTitle || []).map((title, index) => ({
          accCategory: document.accCategory && document.accCategory[index] ? document.accCategory[index] : '',
          accTitle: title || '',
          accCode: document.accCode && document.accCode[index] ? document.accCode[index] : '',
          amount: document.optionalAmount && document.optionalAmount[index] ? document.optionalAmount[index] : '',
        }));

        setFormFields(initialFormFields);
      }else if(document.activeTab === 'GSIS'){
        setGSIS({stamp: document.stamp, dst: document.dst, vat12: document.vat12})
        setActiveTab('GSIS')
      }else if(document.activeTab === 'Meralco'){
        setMeralco({meralcoVAT: document.meralcoVAT, meralcoNONVAT: document.meralcoNONVAT})
        setActiveTab('Meralco')
      } else if (document.activeTab === 'BUR') {
        setActiveTab(document.activeTab)
        setBURData({
          payee: document.payee,
          office: 'NIA Region IV-A',
          No: document.No,
          GAA: document.GAA,
          MFOPAP: document.MFOPAP,
          uacsCode: document.uacsCode,
          NFNameB: document.NFNameB,
          NFOfficeB: document.NFNameB
        })
        setPayeeData({...payeeData, RC: document.resCenter, NF_name: document.NFNameA, NF_office: document.NFOfficeA, particular: document.particular})
        setBURAmount([...document.amount])
      } else if (document.activeTab === 'Others'){
        setActiveTab('Others')
        const initialFormFields = (document.accTitle || []).map((title, index) => ({
          accCategory: document.accCategory && document.accCategory[index] ? document.accCategory[index] : '',
          accTitle: title || '',
          accCode: document.accCode && document.accCode[index] ? document.accCode[index] : '',
          amount: document.optionalAmount && document.optionalAmount[index] ? document.optionalAmount[index] : '',
        }));

        setFormFields(initialFormFields);
      }
    }
  }, [document, flag]);

  // useEffect(() => {
  //   // fix the cause
  //   // const path = location.pathname.split('/')[1]
  //   // if(user?.role === '4') {
  //   //   if(path === 'editor'){
  //   //     if(Object.keys(document).length > 0){
  //   //       setActiveTab(document.activeTab)
  //   //     }else{
  //   //       setActiveTab('To Payment')
  //   //     }
  //   //   } else {
  //   //     setActiveTab("BUR")
  //   //   }
  //   // } else {
  //   //   if(path === 'operator'){
  //   //     if(Object.keys(document).length > 0){
  //   //       setActiveTab(document.activeTab)
  //   //     }else{
  //   //       setActiveTab('To Release')
  //   //     }
  //   //   } else {
  //   //     setActiveTab("BUR")
  //   //   }
  //   // }
  // }, [user, permission])

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

  useEffect(() => {
    if(!flag){
      const date = new Date()
      const today = date.toISOString().split('T')[0]
      setPayeeData({...payeeData, date: today})
    }
  }, [])

  // useEffect(() => {
  //   if(activeTab === 'To Release'){
      
  //   }
  // }, [activeTab])

  const handleChangePayee = (e) => {
    const target = e.target.value.toUpperCase()
    setPayeeData({...payeeData, payee: target.toUpperCase()})

    if (target && payeeOptions) {
      const filtered = Object.entries(payeeOptions)
        .filter(([key]) => key.toLowerCase().includes(target.toLowerCase()))
        .map(([key]) => key)
      setFilteredOptions(filtered)
      if(filtered.length === 0){
        setShowDropdown(false);
      }else{
        setShowDropdown(true);
      }
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
      const filteredAccounts = Object.entries(accountOptions.account_codes).filter(([, value]) => {
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

  const dataForDV = () => {
    const updatedPayeeData = {
      ...payeeData,
      TT_formula1: gross.value2,
      TT_formula2: gross.value3,
      accCategory: formFields.map(arr => Object.values(arr)[0]),
      accTitle: formFields.map(arr => Object.values(arr)[1]),
      accCode: formFields.map(arr => Object.values(arr)[2]),
      optionalAmount: formFields.map(arr => Object.values(arr)[3]),
      additionalLabels: formFields.map(arr => Object.values(arr)[4]),
      activeTab: activeTab
      
    };
    return updatedPayeeData

  }

  const dataToRelease = () => {

    const updatedPayeeData = {
      ...payeeData,
      payee: BURData.payee,
      address: getAddress(BURData.payee),
      TT_formula1: gross.value2,
      TT_formula2: gross.value3,
      ASA_number: BudgetFields.map(arr => Object.values(arr)[0]),
      ASA_project: BudgetFields.map(arr => Object.values(arr)[1]),
      ASA_amount: BudgetFields.map(arr => Object.values(arr)[2]),
      activeTab: activeTab
      
    };
    return updatedPayeeData
  }

  const dataForGSIS = () => {
    const defaultVal = {
      TT_tax:'', 
      TT_formula1:'*0.05', 
      TT_formula2: '',
      TT_cost:'',
      accCategory: [], 
      accTitle: [], 
      accCode: [], 
      optionalAmount:[]
    }
    const updatedPayeeData = {
      ...payeeData,
      ...gsis,
      ...defaultVal,
      activeTab: activeTab

    };
    return updatedPayeeData
  }

  const dataForMeralco = () => {
    const defaultVal = {
      TT_tax:'', 
      TT_formula1:'*0.05', 
      TT_formula2: '*0.02',
      TT_cost:'',
      accCategory: [], 
      accTitle: [], 
      accCode: [], 
      optionalAmount:[]
    }
    const updatedPayeeData = {
      ...payeeData,
      ...meralco,
      ...defaultVal,
      activeTab: activeTab
    };
    return updatedPayeeData
  }

  const getAddress = (payee) => {
    if(payee === 'Quezon IMO') return 'Lucena City, Quezon'
    if(payee === 'Laguna-Rizal IMO') return 'Pila, Laguna'
    if(payee === 'Cavite-Batangas IMO') return 'Naic, Cavite'
  } 

  const dataBURData = () => {
    const finalData = {
      ...BURData,
      address: getAddress(BURData.payee),
      date: payeeData.date,
      resCenter: payeeData.RC,
      particular: payeeData.particular,
      NFNameA: payeeData.NF_name,
      NFOfficeA: payeeData.NF_office,
      amount: BURAmount.filter(obj => obj.title !== "" && obj.amount !== ""),
      activeTab: activeTab
    }
    return finalData
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(activeTab === "Payroll"){
      await forPayrollCreation()
    }
    if(activeTab === 'BUR') {
      createBUR() 
    }
    else{
      await Create()
    }
  }

  const createBUR = async() => {
    const res = await handleBURCreation(dataBURData())
    if(res){
      Swal.fire({
        title: "Saved",
        text: "BUR Successfully Added!",
        icon: "success",
        confirmButtonColor: "#009933"
      });
      modal()
    } else {
      Swal.fire({
        title: "Error",
        text: {errorBUR},
        icon: "error",
        confirmButtonColor: "#FF0000"
      });
    }
  }

  const [payrollItems, setPayrollItems ] = useState({particular: '', amount: ''})
  const forPayrollCreation = async () => {
    const res = await add_payroll_records(payrollItems)
    if(res){
      Swal.fire({
        title: "Saved",
        text: "Added new payroll record successfully!",
        icon: "success",
        confirmButtonColor: "#009933"
      });
      modal()
    } else {
      Swal.fire({
        title: "Error",
        text: {error},
        icon: "error",
        confirmButtonColor: "#FF0000"
      });
    }
  }

  const Create = async() => {
    let updatedPayeeData
    if(activeTab === 'To Payment' || activeTab === 'Others'){
      updatedPayeeData = dataForDV()
    }else if(activeTab === 'GSIS'){
      updatedPayeeData = dataForGSIS()
    }else if(activeTab === 'Meralco'){
      updatedPayeeData = dataForMeralco()
    }else if(activeTab === 'To Release'){
      updatedPayeeData = dataToRelease()
    }
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
    if(data.payee_data.accCode.length <= 1){
      if(!deepEqual(pData, payeeOptions[payeeKey]) && activeTab !== 'To Release'){
        savePayeeData(pData)
      }
      const res = await createDisbursement(data)
      if(res){
        Swal.fire({
          title: "Saved",
          text: "Dibursement Voucher is successfully created!",
          icon: "success",
          confirmButtonColor: "#009933"
        });
        modal()
      } else {
        Swal.fire({
          title: "Error",
          text: {error},
          icon: "error",
          confirmButtonColor: "#FF0000"
        });
      }
    }else{
      const sum = eval(data.payee_data.optionalAmount.join('+'))
      if(Number(data.payee_data.amount) === sum){
        if(!deepEqual(pData, payeeOptions[payeeKey])){
          savePayeeData(pData)
        }
        const res = await createDisbursement(data)
        if(res){
          Swal.fire({
            title: "Saved",
            text: "Dibursement Voucher is successfully created!",
            icon: "success",
            confirmButtonColor: "#009933"
          });
          modal()
        } else {
          Swal.fire({
            title: "Error",
            text: {error},
            icon: "error",
            confirmButtonColor: "#FF0000"
          });
        }
      }else{
        Swal.fire({
          title: "Error",
          text: "Make sure the amount you input is equal to the total amount.",
          icon: "Error",
          confirmButtonColor: "#009933"
        });
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

      // let form = storedFormData ? JSON.parse(storedFormData) : await getFormData()
      let form = await getFormData()
      console.log(form)

      setFundCluster(Object.values(form.fundCluster))
      setRc(Object.values(form.ResponsibilityCenter))

      // instead of array create an object = vat: goods, services then nonvat: goods then GSIS: *5% then meralco
      // const costOnly = Object.values(form.TaxType).map(arr => arr[1]);
      // const uniqueCost = [...new Set(costOnly)]
      const result = {}
      Object.entries(form.TaxType).forEach(([, value]) => {
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
      setASANo(form.ControlBook)

      setCost(result)

      setCost(result)

      setTaxData(form.TaxType)

      setNameOffice(form.NameOffice)

      const loadData = await loadPayee()
      setPayeeOptions(loadData)

      
      const storedAccountOptions = localStorage.getItem('account_fields')
      if(storedAccountOptions){
        setAccountOptions(JSON.parse(storedAccountOptions));
      }else{
        try{
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/editor/getAccountCode`, {
            withCredentials: true
          })

          if(response.status === 200){
            const options = response.data;
            localStorage.setItem('account_fields', JSON.stringify(options));
            setAccountOptions(options);
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
    if(activeTab === 'To Payment') {
      await handleUpdateDV()
    } else if(activeTab === 'BUR') {
      await updateBUR()
    }
  }

  const updateBUR = async() => {
    const res = await handleBURUpdate(dataBURData(), document.id)
    if(res){
      Swal.fire({
        title: "Saved",
        text: "BUR Successfully Updated!",
        icon: "success",
        confirmButtonColor: "#009933"
      });
      modal()
    } else {
      Swal.fire({
        title: "Error",
        text: {errorBUR},
        icon: "error",
        confirmButtonColor: "#FF0000"
      });
    }
  }

  const handleUpdateDV = async() => {
    console.log('updating')
    const updatedPayeeData = {
      ...payeeData,
      TT_formula1: gross.value2,
      TT_formula2: gross.value3,
      accCategory: formFields.map(arr => Object.values(arr)[0]),
      accTitle: formFields.map(arr => Object.values(arr)[1]),
      accCode: formFields.map(arr => Object.values(arr)[2]),
      optionalAmount: formFields.map(arr => Object.values(arr)[3])
      
    };
    const data = {
      payee_data: updatedPayeeData,
      bir_data: birData
    }
    const res = await updateDV(data, document.DVKey)
    if(res){
      Swal.fire({
        title: "Saved",
        text: "Disbursement Voucher is successfully updated!",
        icon: "success",
        confirmButtonColor: "#009933"
      });
      modal()
    } else {
      Swal.fire({
        title: "Error",
        text: {error},
        icon: "error",
        confirmButtonColor: "#FF0000"
      });
    }
  }

  // const handleOpInput = async(e) => {
  //   e.preventDefault()
  //   const fieldOfficeData = {
  //     date: payeeData.date,
  //     DVNo: payeeData.DV,
  //     BUR: operatorInput.ors,
  //     payee: payeeData.payee,
  //     particulars: payeeData.particular,
  //     amount: payeeData.amount
  //   }

  //   const data = {
  //     fundingData: operatorInput,
  //     fieldOfficeData: fieldOfficeData
  //   }

  //   const res = await inputOperator(data, payeeData.DVKey)
  //   if(res){
  //     Swal.fire({
  //       title: "Saved",
  //       text: "Disbursement Voucher is successfully save!",
  //       icon: "success",
  //       confirmButtonColor: "#009933"
  //     });
  //     modal()
  //   }
  // }


  const addNewBudgetField = () => {
    setBudgetFields([...BudgetFields, {ASA: '', ASAproject: '', amount: ''}])
  }

  const removeBudgetField = (index) => {
    const updatedFields = BudgetFields.filter((_, i) => i !== index);
    setBudgetFields(updatedFields);
  };

  const handleBudgetFieldChange = (index, field, value) => {
    const updatedFields = [...BudgetFields];
    updatedFields[index][field] = value;
    setBudgetFields(updatedFields);
  };

  const handleBudgetButtonClick = (index) => {
    if (index === formFields.length - 1) {
      addNewBudgetField();
    } else {
      removeBudgetField(index);
    }
  };

  const addNewField = () => {
    setFormFields([...formFields, { accCategory:'',accTitle: '', accCode: '', amount: '', labels: '' }]);
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

  const addNewBUR = () => {
    setBURAmount([...BURAmount, { title: '', amount: ''}]);
  };

  const removeBUR = (index) => {
    const updatedFields = BURAmount.filter((_, i) => i !== index);
    setBURAmount(updatedFields);
  };

  const handleFieldChangeBUR = (index, field, value) => {
    const updatedFields = [...BURAmount];
    updatedFields[index][field] = value;
    setBURAmount(updatedFields);
  };

  const handleButtonClickBUR = (index) => {
    if (index === formFields.length - 1) {
      addNewBUR();
    } else {
      removeBUR(index);
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

  useEffect(() => {
    const gettingNumber = async () => {
      const fundNoSpace = payeeData.fund.replace(/ /g, '')
      if(fundNoSpace !== ''){
        const {template, value, currentVal} = await getDVno(fundNoSpace)
        setPayeeData({...payeeData, DV: `${template}${value}`, origNumber: currentVal, template: template})
      }else{
        console.log('no fund selected yet (disbursement voucher)')
      }
    }
    if(!flag){
      gettingNumber()
    }
  }, [payeeData.fund])

  useEffect(() => {
    if (["GSIS", "Meralco"].includes(activeTab)) {
      setPayeeData((prev) => ({ ...prev, payee: activeTab }));
    }else{
      setPayeeData((prev) => ({ ...prev, payee: document.payee }));
    }
  }, [activeTab]);

  
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const handleChangeAddress = (e) => {
    const value = e.target.value
    if(value === 'other'){
      setIsOtherSelected(true);
      setPayeeData({ ...payeeData, address: '' });
    }else{
      setIsOtherSelected(false);
      setPayeeData({ ...payeeData, address: value });
    }
  }

  const formatToPeso = (value) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(value);
  };

  const formatNumberWithCommas = (value) => {
    if (!value) return "";
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleAmountChange = (e) => {
    let value = e.target.value.replace(/,/g, "");

    if (value === "") {
      setPayrollItems({ ...payrollItems, amount: "" });
      return;
    }

    if (!isNaN(value)) {
      setPayrollItems({
        ...payrollItems,
        amount: value, 
      });
    }
  };

  const [numindex, setNumindex] = useState(0)

  return (
    <form onSubmit={(e) => flag ? handleUpdate(e) : handleSubmit(e)} action="" className="bg-white w-full h-full sm:w-4/6 lg:w-3/6 flex flex-col justify-between">
      <div className='w-full h-auto'>
        <div className='w-full h-auto px-3 py-3'>
          <h1 className={`${user.role === '4' ? 'text-preparerPrimary' : 'text-fundingBlueGreen'} text-xl 2xl:text-3xl font-bold`}>{flag ? 'Update Disbursement Voucher' : 'Create Disbursement Voucher'}</h1>
        </div>
        <div className='w-full h-auto py-1'>
          <div className='flex items-start gap-3 px-3'>
            {!(location.pathname === '/operator/records/burrecords' || location.pathname === '/editor/records/burrecords') && (
              <>
                {(permission?.data?.permission && permission?.data?.roleName === 'Funding' || user?.role === '4') && ( 
                  <button type='button' 
                    onClick={() => setActiveTab('To Payment')} 
                    className={`${activeTab === 'To Payment' ? user?.role === '4' ? 'border-b-2 text-preparerPrimary border-preparerPrimary font-semibold' : 'border-b-2 text-fundingBlueGreen border-fundingBlueGreen font-semibold' : ''} text-base 2xl:text-lg w-auto h-auto py-2 text-gray-500`}
                    disabled={flag}>
                    To Payment
                  </button>
                )}
                {( permission?.data?.permission && permission?.data?.roleName === 'Preparer' || user?.role === '3' && location.pathname === '/operator/records/disbursementrecords') && (
                  <button type='button' 
                    onClick={() => setActiveTab('To Release')} 
                    className={`${activeTab === 'To Release' ? user?.role === '4' ? 'border-b-2 text-preparerPrimary border-preparerPrimary font-semibold' : 'border-b-2 text-fundingBlueGreen border-fundingBlueGreen font-semibold' : ''} text-base 2xl:text-lg w-auto h-auto py-2 text-gray-500`}
                    disabled={flag}>
                    To Release
                  </button>
                )}
                {(user?.role === '4' || permission?.data?.permission && permission?.data?.roleName === 'Funding') && (
                  <>
                    <button type='button' 
                      onClick={() => setActiveTab('GSIS')} 
                      className={`${activeTab === 'GSIS' ? user?.role === '4' ? 'border-b-2 text-preparerPrimary border-preparerPrimary font-semibold' : 'border-b-2 text-fundingBlueGreen border-fundingBlueGreen font-semibold' : ''} text-base 2xl:text-lg w-auto h-auto py-2 text-gray-500`}
                      disabled={flag}>
                        GSIS
                    </button>
                    <button type='button' 
                      onClick={() => setActiveTab('Meralco')} 
                      className={`${activeTab === 'Meralco' ? user?.role === '4' ? 'border-b-2 text-preparerPrimary border-preparerPrimary font-semibold' : 'border-b-2 text-fundingBlueGreen border-fundingBlueGreen font-semibold' : ''} text-base 2xl:text-lg w-auto h-auto py-2 text-gray-500`}
                      disabled={flag}>
                        Meralco
                    </button>
                    <button type='button' 
                      onClick={() => setActiveTab('Others')} 
                      className={`${activeTab === 'Others' ? user?.role === '4' ? 'border-b-2 text-preparerPrimary border-preparerPrimary font-semibold' : 'border-b-2 text-fundingBlueGreen border-fundingBlueGreen font-semibold' : ''} text-base 2xl:text-lg w-auto h-auto py-2 text-gray-500`}
                      disabled={flag}>
                        Others
                    </button>
                    {/* <button type='button' 
                      onClick={() => setActiveTab('Payroll')} 
                      className={`${activeTab === 'Payroll' ? user?.role === '4' ? 'border-b-2 text-preparerPrimary border-preparerPrimary font-semibold' : 'border-b-2 text-fundingBlueGreen border-fundingBlueGreen font-semibold' : ''} text-base 2xl:text-lg w-auto h-auto py-2 text-gray-500`}
                      disabled={flag}>
                        Payroll
                    </button> */}
                  </>
                )}
              </>
            )}
            {(user?.role === '3' && location.pathname === '/operator/records/burrecords' || permission?.data?.permission && permission?.data?.roleName === 'Preparer' && location.pathname === '/editor/records/burrecords') && (
              <button type='button' 
                onClick={() => setActiveTab('BUR')} 
                className={`${activeTab === 'BUR' ? 'border-b-2 text-preparerPrimary border-preparerPrimary font-semibold' : ''} text-base 2xl:text-lg w-auto h-auto py-2 text-gray-500`}
                disabled={flag}>
                  BUR
              </button>
            )}
          </div>
          <hr />
        </div>
      </div>
      <div className='w-full flex-1 overflow-y-auto bg-gray-50'>
        {
           activeTab === 'Payroll' && (
            <div className='w-full h-full py-3 px-5'>
              <div className='w-full h-auto'>
                <label className='text-gray-500'>Particulars</label>
                <textarea 
                  className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 resize-none h-40 rounded-md border-2`}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPayrollItems({...payrollItems, particular: value})
                  }}
                  value={payrollItems.particular}
                  placeholder='Write details here...'
                  required
                  maxLength="500"
                />
              </div>
              <div className="w-full">
                  <label className="text-gray-500">Amount</label>
                  <input
                    className={`${
                      user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'
                    } text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                    type="text"
                    placeholder="0"
                    value={formatNumberWithCommas(payrollItems.amount)}
                    onChange={handleAmountChange}
                    required
                  />
                </div>
            </div>
           )
        }
        {
          activeTab !== 'Payroll' && (
          <div className='w-full h-full py-3 px-5'>
          <h1 className="font-semibold text-lg text-gray-500">Personal/Payee Information</h1>
          <div className="w-full h-auto mt-2">
            <div className='w-full relative'>
              <label className='text-gray-500'>Payee</label>
              {(activeTab !== 'BUR' && activeTab !== 'To Release') ? (
                <>
                  <input
                    className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                    disabled={['GSIS', 'Meralco'].includes(activeTab)}
                    type="text"
                    pattern="^[a-zA-Z\s'-]+$"
                    value={['GSIS', 'Meralco'].includes(activeTab) ? activeTab : ['GSIS', 'Meralco'].includes(payeeData.payee) ? '' : payeeData.payee}
                    minLength="2"
                    maxLength="50"
                    onChange={handleChangePayee}
                    required
                  />
                  {showDropdown && (
                    <ul className="absolute text-gray-500 w-full bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto z-10">
                      {filteredOptions.map((option, index) => (
                        <li
                          key={index}
                          onClick={() => handleSelectPayee(option)}
                          className="p-2 cursor-pointer hover:bg-gray-200"
                        >
                          {option.replace(/\|/g, ' ')}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <select
                  value={BURData.payee}
                  onChange={(e) => setBURData({...BURData, payee: e.target.value})}
                  className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                >
                  <option value="" disabled>Select</option>
                  <option value="Laguna-Rizal IMO">Laguna-Rizal IMO</option>
                  <option value="Cavite-Batangas IMO">Cavite-Batangas IMO</option>
                  <option value="Quezon IMO">Quezon IMO</option>
                </select>
              )}
            </div>
            <div className='w-full flex flex-col sm:flex-row  gap-2'>
              {(activeTab === 'BUR' || activeTab === 'To Release') ? (
                <div className='w-full sm:w-1/2 mt-2'>
                  <label>Address</label>
                  <select 
                    disabled
                    className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                    value={BURData.payee === 'Laguna-Rizal IMO' ? 'Pila, Laguna' :
                      BURData.payee === 'Cavite-Batangas IMO' ? 'Naic, Cavite' :
                      BURData.payee === 'Quezon IMO' ? 'Lucena, Quezon' :
                      BURData.address || ''
                    }>
                    <option value="" disabled>Select</option>
                    <option value="Pila, Laguna">Pila, Laguna</option>
                    <option value="Naic, Cavite">Naic, Cavite</option>
                    <option value="Lucena, Quezon">Lucena City, Quezon</option>
                  </select>
                </div>
              ) : 
              (<div className='w-full sm:w-1/2 mt-2'>
                <label className='text-gray-500'>Address</label>
                {isOtherSelected ? (
                  <div className="flex items-center border-2 rounded-md px-2">
                    <input
                      className="flex-grow text-gray-500 px-2 py-2 focus:outline-none"
                      type="text"
                      value={payeeData.address}
                      onChange={(e) => setPayeeData({ ...payeeData, address: e.target.value })}
                      placeholder="Type your address"
                      required
                    />
                    <button
                      type="button"
                      className="ml-2 px-3 py-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
                      onClick={() => setIsOtherSelected(false)}
                    >
                      ↩
                    </button>
                  </div>
                ) : (
                  <select 
                    className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                    ///disabled={isDisabled && !permission.data.permission}
                    type="text" 
                    value={payeeData.address}
                    onChange={handleChangeAddress} 
                    required>
                      <option disabled value={''}>Select Address</option>
                      <option value={'other'}>Other...</option>
                      {Object.entries(addressJSON['4A'].province_list).map(([key, province]) => (
                        <optgroup key={key} label={key}>
                          {province.municipality_list.map((municipal, index) => (
                            <option key={index} value={`${municipal}, ${key}`}>{municipal}</option>
                          ))}
                        </optgroup>
                      ))}
                  </select>
                )}
              </div>)}
              {activeTab !== 'BUR' ? (
                <div className='w-full sm:w-1/2 mt-2'>
                  <label className='text-gray-500'>TIN/Employee No.</label>
                  <input 
                    className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                    //disabled={isDisabled && !permission.data.permission}
                    type="text" 
                    value={payeeData.TIN}
                    placeholder='123-456-789-000'
                    onChange={(e) => {
                      const value = e.target.value;
                      const numericValue = value.replace(/\D/g, "");
                      const limitedValue = numericValue.slice(0, 12);
                      const formattedValue = limitedValue.replace(/(\d{3})(?=\d)/g, "$1-");
                      setPayeeData({...payeeData, TIN: formattedValue})
                    }} 
                    required={activeTab === 'To Payment'? true : false}  />
                </div>
                ) : (
                  <div className='w-full sm:w-1/2 mt-2'>
                    <label className='text-gray-500'>Office</label>
                    <input 
                      value={BURData.office}
                      onChange={(e) => setBURData({...BURData, office: e.target.value})}
                      className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                      type="text" 
                      required  />
                  </div>
              )}
            </div>
          </div>
          <h1 className="font-semibold text-lg mt-2 text-gray-500">Document/Transaction Information</h1>
          <div className="w-full h-auto flex flex-col py-2">
            <div className='w-full flex flex-col sm:flex-row items-center justify-center gap-2'>
              {activeTab !== 'BUR' ? (
                <div className="flex flex-col w-full sm:w-4/6">
                  <label className='text-gray-500'>Fund Cluster</label>
                  <select className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                    onChange={(e) => setPayeeData({...payeeData, fund: e.target.value})}
                    value={payeeData.fund}
                    //disabled={isDisabled && !permission.data.permission}
                    required
                    //value
                  >
                    <option value="" disabled>Select</option>
                    {fundCluster.length > 0 ? (
                        fundCluster.map((fund, index) => (
                            <option key={index} value={fund}>
                                {fund === 'Contract Farming' ? 'Farming Support Service Program' : fund }
                            </option>
                        ))
                    ) : (
                        <option value="" disabled>
                            No options available
                        </option>
                    )}
                  </select>
                </div>
              ) : (
                <div className="flex flex-col w-full sm:w-4/6">
                  <label className='text-gray-500'>No.</label>
                  <select
                    value={BURData.No}
                    onChange={(e) => setBURData({...BURData, No: e.target.value})}
                    className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                    required>
                    <option value="" disabled>Select</option>
                    {(Object.keys(ASANo)).map((item, index) => {
                      const [ASA, fundCluster] = item.split('!')
                      const [finalASA,] = ASA.split('|')
                      const finalFundCluster = fundCluster.replace('501', '-')
          
                      return (
                        <option key={index}>{`${finalASA} ${finalFundCluster}`}</option>
                      )
                    })}
                  </select>
                </div>
              )}
              {/* <div className="flex flex-col w-full sm:w-2/6">
                <label className='text-gray-500'>ASA No.</label>
                <input 
                  className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                  type="text" 
                  value={payeeData.ASA_No_ref}
                  placeholder="ASA No. Reference"
                  onChange={(e) => setPayeeData({...payeeData, ASA_No_ref: e.target.value})}
                  required
                  />
              </div> */}

              <div className="flex flex-col w-full sm:w-2/6">
                <label className='text-gray-500'>Date</label>
                <input 
                  className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                  type="date" 
                  //disabled={isDisabled && !permission.data.permission}
                  value={payeeData.date}
                  placeholder="Date"
                  onChange={(e) => setPayeeData({...payeeData, date: e.target.value})}
                  required
                  min={new Date(new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" }))
                  .toISOString()
                  .slice(0, 7) + "-01"} 
                
                    />
              </div>

            </div>
            <div className='w-full flex flex-col sm:flex-row items-center justify-center gap-2 mt-2'>
              {activeTab !== 'BUR' ? (
                <div className='w-full sm:w-1/2 mt-2'>
                  <label className='text-gray-500'>DV No.</label>
                  <input 
                    className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                    type="text" 
                    // disabled={true}
                    value={payeeData.DV}
                    onChange={(e) => setPayeeData({...payeeData, DV: e.target.value})}
                    required  />
                </div>
              ) : (
                <div className='w-full sm:w-1/2 mt-2'>
                  <label className='text-gray-500'>GAA</label>
                  <input 
                    value={BURData.GAA}
                    onChange={(e) => setBURData({...BURData, GAA: e.target.value})}
                    className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                    type="text" 
                    required  />
                </div>
              )}
              <div className="flex flex-col w-full sm:w-1/2 mt-2">
                <label>Responsibility Center</label>
                <select  className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                  onChange={(e) => setPayeeData({...payeeData, RC: e.target.value})}
                  value={payeeData.RC}
                  //disabled={isDisabled && !permission.data.permission}
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
            {activeTab === 'BUR' && (
              <> 
                <div className='w-full flex flex-col sm:flex-row gap-2 mt-2'>
                  <div className='w-full sm:w-1/2'>
                    <label htmlFor="">MFO/PAP</label>
                    <input 
                      className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                      value={BURData.MFOPAP}
                      onChange={(e) => setBURData({...BURData, MFOPAP: e.target.value})}
                      type="text"
                      />
                  </div>
                  <div className='w-full sm:w-1/2'>
                    <label htmlFor="">UACS Code</label>
                    <input 
                      className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                      value={BURData.uacsCode}
                      onChange={(e) => setBURData({...BURData, uacsCode: e.target.value })}
                      type="text"
                      />
                  </div>
                </div>
                <div className='w-full'>
                  {BURAmount.map((item, index) => (
                    <div key={index} className='w-full flex flex-col sm:flex-row items-end justify-center gap-2'>
                      <div className='w-full sm:w-3/5 flex flex-col'>
                        <label>Project</label>
                        <input 
                          value={item.title} 
                          onChange={(e) => handleFieldChangeBUR(index, 'title', e.target.value)}
                          type="text"
                          className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`} />
                      </div>
                      <div className='w-full sm:w-2/5 flex flex-col'>
                        <label>Amount</label>
                        <input 
                          value={item.amount} 
                          onChange={(e) => handleFieldChangeBUR(index, 'amount', e.target.value)}
                          type="text"
                          className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`} />
                      </div>
                      <button
                        className={`text-${index === formFields.length - 1 ? 'customgreen' : 'red-500'} w-fit h-fit p-2 rounded-full text-xl ${
                          index !== formFields.length - 1 ? 'hover:bg-red-700' : 'hover:bg-customgreen'
                        } hover:text-white`}
                        onClick={() => handleButtonClickBUR(index)}
                        type="button"
                      >
                        {index === formFields.length - 1 ? <IoAdd /> : <MdRemove />}
                      </button>
                    </div>
                  )) }
                </div>
              </>
            )}
            {activeTab !== 'BUR' && (
              <div className='w-full h-auto mt-2'>
                <label className='text-gray-500'>Mode of Payment</label>
                <div className='w-full h-auto flex flex-col sm:flex-row itens-start sm:items-center justify-center  gap-3 p-2'>
                  <div className='w-auto flex gap-2'>
                    <input 
                      type="radio" 
                      name="MOP"
                      value='MDS Check'
                      checked={payeeData.MOP === 'MDS Check'}
                      required
                      onChange={(e) => setPayeeData({...payeeData, MOP: e.target.value})}/>
                    <label className='text-gray-500 text-sm'>MDS Check</label>
                  </div>
                  <div className='flex gap-2'>
                    <input 
                      type="radio" 
                      name="MOP"
                      value='Commercial Check'
                      checked={payeeData.MOP === 'Commercial Check'}
                      required
                      onChange={(e) => setPayeeData({...payeeData, MOP: e.target.value})}/>
                    <label className='text-gray-500 text-sm'>Commercial Check</label>
                  </div>
                  <div className='flex gap-2'>
                    <input 
                      type="radio" 
                      name="MOP"
                      value='ADA'
                      checked={payeeData.MOP === 'ADA'}
                      required
                      onChange={(e) => setPayeeData({...payeeData, MOP: e.target.value})}/>
                    <label className='text-gray-500 text-sm'>ADA</label>
                  </div>
                  <div className='flex items-center justify-start sm:justify-center gap-2'>
                    <div className='flex gap-2'>
                      <input 
                        type="radio" 
                        name="MOP"
                        value='Others'
                        checked={payeeData.MOP === 'Others'}
                        required
                        onChange={(e) => setPayeeData({ ...payeeData, MOP: e.target.value })}/>
                      <label className='text-gray-500 text-sm'>Others</label>
                    </div>
                    <div className='flex items-center justify-center gap-2'>
                      <label className='text-gray-500 text-sm'>(Please Specify)</label>
                      <input 
                        type="text" 
                        disabled={payeeData.MOP === 'Others' ? false : true}
                        value={payeeData.MOP === 'Others' ? payeeData.specifiedMOP  || '': ''}
                        onChange={(e) => setPayeeData({...payeeData, specifiedMOP: e.target.value})}
                        className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-16 text-sm p-1 rounded-md border-2`}/>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className='w-full h-auto'>
              <div className='w-full flex flex-col gap-2'>
                <div className="w-full flex flex-row gap-2">
                  <div className='w-1/2 flex flex-col'>
                    <label  className="font-semibold text-lg mt-3 mb-2 text-gray-500">A. Certified by</label>
                    <label className="text-gray-500">Name</label>
                    <select className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                      onChange={(e) => {
                        const selectedOption = e.target.options[e.target.selectedIndex];
                        setPayeeData({...payeeData, NF_name: e.target.value, NF_office: selectedOption.getAttribute('office')})
                      }}
                      value={payeeData.NF_name}
                      //disabled={isDisabled && !permission.data.permission}
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
                  <div className='w-1/2 flex items-end'>
                    <div className='w-full flex flex-col items-start justify-center'>
                      <label className='font-medium text-gray-500'>Position</label>
                      <label className='w-full px-4 py-2 text-gray-500'>{payeeData.NF_office ? payeeData.NF_office : 'None'}</label>
                    </div>
                  </div>
                </div>

                {/* Head, Accounting Unit */}
               {activeTab !== 'BUR' && ( 
                  <>
                      <div className="w-full flex flex-row gap-2">
                        <div className='w-1/2 flex flex-col'>
                          <label  className="font-semibold text-lg mt-3 mb-2 text-gray-500">Head, Accounting Unit</label>
                          <label className="text-gray-500">Name</label>
                          <select className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                            onChange={(e) => {
                              const selectedOption = e.target.options[e.target.selectedIndex];
                              setPayeeData({...payeeData, accountingHead_name: e.target.value, accountingHead_office: selectedOption.getAttribute('office')})
                            }}
                            value={payeeData.accountingHead_name}
                            //disabled={isDisabled && !permission.data.permission}
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
                        <div className='w-1/2 flex items-end'>
                          <div className='w-full flex flex-col items-start justify-center'>
                            <label className='font-medium text-gray-500'>Position</label>
                            <label className='w-full px-4 py-2 text-gray-500'>{payeeData.accountingHead_office ? payeeData.accountingHead_office : 'None'}</label>
                          </div>
                        </div>
                      </div>
                      <div className="w-full flex flex-row gap-2">
                        <div className='w-1/2 flex flex-col'>
                          <label  className="font-semibold text-lg mt-3 mb-2 text-gray-500">Agency Head</label>
                          <label className="text-gray-500">Name</label>
                          <select className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                            onChange={(e) => {
                              const selectedOption = e.target.options[e.target.selectedIndex];
                              setPayeeData({...payeeData, agencyHead_name: e.target.value, agencyHead_office: selectedOption.getAttribute('office')})
                            }}
                            value={payeeData.agencyHead_name}
                            //disabled={isDisabled && !permission.data.permission}
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
                        <div className='w-1/2 flex items-end'>
                          <div className='w-full flex flex-col items-start justify-center'>
                            <label className='font-medium text-gray-500'>Position</label>
                            <label className='w-full px-4 py-2 text-gray-500'>{payeeData.agencyHead_office ? payeeData.agencyHead_office : 'None'}</label>
                          </div>
                        </div>
                      </div>
                  </>
                )}
                {(activeTab !== 'BUR' && activeTab !== 'Meralco' && activeTab !== 'GSIS' && activeTab !== 'Others') && (
                  <div className='w-full flex items-center justify-start sm:justify-center gap-2'>
                    <div className='w-full sm:w-1/3 mt-2'>
                      <label className='text-gray-500'>PR No.</label>
                      <input 
                        className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                        type="text" 
                        // disabled={true}
                        value={payeeData.PR_No}
                        onChange={(e) => setPayeeData({...payeeData, PR_No: e.target.value})}
                        // required  
                        />
                    </div>

                    <div className='w-full sm:w-1/3 mt-2'>
                      <label className='text-gray-500'>PO No.</label>
                      <input 
                        className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                        type="text" 
                        // disabled={true}
                        value={payeeData.PO_No}
                        onChange={(e) => setPayeeData({...payeeData, PO_No: e.target.value})}
                        // required  
                        />
                    </div>

                    <div className='w-full sm:w-1/3 mt-2'>
                      <label className='text-gray-500'>IAR No.</label>
                      <input 
                        className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                        type="text" 
                        // disabled={true}
                        value={payeeData.IAR_No}
                        onChange={(e) => setPayeeData({...payeeData, IAR_No: e.target.value})}
                        // required  
                        />
                    </div>
                  </div>
                )}

                {activeTab === 'BUR' && (
                  <div className="flex flex-row w-full gap-2">
                    <div className='w-1/2 flex flex-col'>
                      <label  className="font-semibold text-lg mt-3 mb-2 text-gray-500">B. Certified by</label>
                      <label className="text-gray-500">Name</label>
                      <select 
                        value={BURData.NFNameB}
                        onChange={(e) => {
                          const selectedOption = e.target.options[e.target.selectedIndex];
                          setBURData({...payeeData, NFNameB: e.target.value, NFOfficeB: selectedOption.getAttribute('office')})
                        }}
                        className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
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
                    <div className='w-1/2 flex items-end'>
                      <div className='w-full flex flex-col items-start justify-center'>
                        <label className='font-medium text-gray-500'>Position</label>
                        <label className='w-full px-4 py-2 text-gray-500'>{BURData.NFOfficeB ? BURData.NFOfficeB : 'None'}</label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {activeTab === 'To Release' && (
            <div className='w-full h-auto'>
              <h1 className="font-semibold text-lg mt-2 text-gray-500">Financial Details</h1>
              {BudgetFields.map((field, index) => (
                <div key={index} className="w-full h-auto flex flex-col mt-2">
                  <div className="w-full flex flex-col sm:flex-row items-end justify-center gap-2">
                    <div className="w-full sm:w-1/2">
                      <label className="text-gray-500">ASA no.</label>
                      <select
                        value={field.ASA}
                        onChange={(e) => {
                          console.log(e.target.value)
                          handleBudgetFieldChange(index, 'ASA', e.target.value)}}
                        className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}>
                        <option value="" disabled>Select</option>
                        {Object.entries(ASANo).length > 0 ? (
                            Object.entries(ASANo).map(([key, value]) => (
                                <option key={key} value={key}>
                                    {key.split('!')[0].replace('|', ' ')}
                                </option>
                            ))
                        ) : (
                          <option value="" disabled>
                              No options available
                          </option>
                        )}
                      </select>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label className="text-gray-500">Project Name</label>
                      <select
                        value={field.ASAproject}
                        onChange={(e) => handleBudgetFieldChange(index, 'ASAproject', e.target.value)} 
                        className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}>
                      <option value="" disabled>Select</option>
                      {ASANo[field.ASA]?.length > 0 ? (
                        ASANo[field.ASA].map((item, index) => (
                          <option key={index} value={item.projectID}>
                              {item.projectName}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                            No options available
                        </option>
                      )}
                      </select>
                    </div>

                    
                    <div className="w-full sm:w-1/2">
                      <label className="text-gray-500">Amount</label>
                      <input
                        value={field.amount}
                        onChange={(e) => handleBudgetFieldChange(index, 'amount', e.target.value)} 
                        className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`} />
                    </div>
                    {numindex === index && (
                      <button onClick={() => {
                        addNewBudgetField()
                        setNumindex((prev) => prev + 1)
                        }} 
                        className="px-4 bg-blue-500 text-white rounded-md h-fit p-2 my-0.5">
                        +
                      </button>
                    )}
                    {numindex > index && (
                      <button onClick={() => {
                        removeBudgetField(index)
                        setNumindex((prev) => prev - 1)
                        }} className="px-4 bg-blue-500 text-white rounded-md h-fit p-2 my-0.5">
                        -
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}


          {(activeTab === 'To Payment' || activeTab === 'Others') && (
            <div className='w-full h-auto'>
              <h1 className="font-semibold text-lg mt-2 text-gray-500">Financial/Payment Details</h1>
              <div className="w-full h-auto flex flex-col mt-2">
                {/* Cost Categories and Amount Section */}
                <div className="w-full flex flex-col sm:flex-row gap-2">
                  {/* Cost Categories */}
                  {activeTab !== 'Others' && (
                    <>
                      <div className="w-full sm:w-1/2">
                        <label className="text-gray-500">Cost Categories</label>
                        <select
                          className={`${
                            user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'
                          } text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                          //disabled={isDisabled && !permission.data.permission}
                          value={payeeData.TT_tax && payeeData.TT_cost ? `${payeeData.TT_tax}-${payeeData.TT_cost}` : ''}
                          onChange={(e) => {
                            const [taxCategory, type] = e.target.value.split('-');
                            setPayeeData({
                              ...payeeData,
                              TT_cost: type,
                              TT_tax: taxCategory,
                            });
                          }}
                          required
                        >
                          <option value="" disabled>
                            Select Cost Category
                          </option>
                          {Object.keys(cost).length > 0 ? (
                            Object.entries(cost).map(([taxCategory, types]) => (
                              <optgroup label={taxCategory} key={taxCategory}>
                                {types.map((type) => (
                                  <option key={`${taxCategory}-${type}`} value={`${taxCategory}-${type}`}>
                                    {type}
                                  </option>
                                ))}
                              </optgroup>
                            ))
                          ) : (
                            <option value="" disabled>
                              No options available
                            </option>
                          )}
                        </select>
                      </div>
                    </>
                  )}
                  {/* Amount */}
                  <div className={`${activeTab === 'Others' ? 'w-full' : 'w-full sm:w-1/2'} flex flex-col sm:flex-row items-center justify-center gap-2`}>
                    <div className="w-full sm:w-1/2">
                      <label className="text-gray-500">Amount</label>
                      <input
                        className={`${
                          user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'
                        } text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                        type="number"
                        step="0.01"
                        //disabled={isDisabled && !permission.data.permission}
                        placeholder="0"
                        value={payeeData.amount === 0 ? '' : payeeData.amount}
                        onChange={(e) =>
                          setPayeeData({
                            ...payeeData,
                            amount: parseFloat(e.target.value),
                          })
                        }
                        required
                      />
                    </div>
                    <div className='w-full sm:w-1/2 flex flex-col'>
                      <label className="text-gray-500">Account Entry</label>
                      <select 
                        className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                        >
                        <option value="Debit">Debit</option>
                        <option value="Credit">Credit</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Gross Values Section */}
                <div className="w-full flex mt-2">
                  <div className="w-full flex justify-center items-center">
                    <div className="w-1/2 flex justify-center">
                      <label className="text-gray-500">{gross.value2 ? `Gross ${gross.value2}` : ''}</label>
                    </div>
                    <div className="w-1/2 flex justify-center">
                      <label className="text-gray-500">{gross.value3 ? `Gross ${gross.value3}` : ''}</label>
                    </div>
                  </div>
                </div>

                {/* Dynamic Form Fields for Account Titles */}
                <div className="w-full h-auto flex flex-col mt-2">
                  {formFields.map((field, index) => (
                    <div key={index} className="w-full flex flex-col gap-2">
                      {/* Account Title */}
                      <div className='w-full h-auto mt-2 flex flex-col sm:flex-row items-center justify-center gap-2'>
                        <div className="w-full sm:w-2/3">
                          <label className="text-gray-500">Account Title</label>
                          <input
                            className={`${
                              user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'
                            } text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                            type="text"
                            placeholder="Search here..."
                            value={field.accTitle}
                            //disabled={isDisabled && !permission.data.permission}
                            onChange={(e) => handleChangeAcc(e, index)}
                            required
                          />
                          {showDropdownAcc && activeDropdownIndex === index && (
                            <ul className="w-full bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto z-10">
                              {Object.entries(filteredAcc[index]).length > 0 ? (
                                Object.entries(filteredAcc[index]).map(([key, value]) => {
                                  const parts = value.split(':');
                                  const categories = `${parts[0]}|${parts[1]}`;
                                  const lastPart = parts[parts.length - 1];
                                  return (
                                    <li
                                      key={key}
                                      onClick={() => {
                                        handleFieldChange(index, 'accCategory', categories);
                                        handleFieldChange(index, 'accTitle', lastPart);
                                        handleFieldChange(index, 'accCode', key);
                                        setShowDropdownAcc(false);
                                        setActiveDropdownIndex(null);
                                      }}
                                      className="p-2 cursor-pointer hover:bg-gray-200"
                                    >
                                      {lastPart}
                                    </li>
                                  );
                                })
                              ) : (
                                <li className="p-2">No matches found</li>
                              )}
                            </ul>
                          )}
                        </div>
                        <div className='w-full sm:w-1/3'>
                          <label className="text-gray-500">Additional Label(Optional)</label>
                          <input
                            value={formFields[index].labels} 
                            type="text"
                            onChange={(e) => {
                              handleFieldChange(index, 'labels', e.target.value)
                            }} 
                            className={`${
                              user?.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'
                            } text-gray-500 w-full px-4 py-2 rounded-md border-2`}/>
                        </div>
                      </div>
                      <div className='w-full h-auto mt-2 flex flex-col sm:flex-row items-center justify-center gap-2'>
                        <div className='w-full sm:w-1/2'>
                          <label>Account Code</label>
                          <input
                            disabled
                            className={`${
                              user?.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'
                            } text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                            type="text"
                            value={formFields[index].accCode}
                          />
                        </div>
                        {/* Amount (Optional) */}
                        <div className="w-full lg:w-1/2">
                          <div className="w-full">
                            <label className="text-gray-500">Amount (Optional)</label>
                            <div className='flex items-center justify-center'>
                              <input
                                className={`${
                                  user?.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'
                                } text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                                type="number"
                                //disabled={(isDisabled && !permission.data.permission) || optionalAmount}
                                placeholder="0"
                                value={field.amount === 0 ? '' : field.amount}
                                onChange={(e) => handleFieldChange(index, 'amount', e.target.value)}
                              />
                              <button
                                className={`text-${index === formFields.length - 1 ? 'customgreen' : 'red-500'} rounded-full text-3xl ${
                                  index !== formFields.length - 1 ? 'hover:bg-red-700' : 'hover:bg-customgreen'
                                } hover:text-white`}
                                onClick={() => handleButtonClick(index)}
                                type="button"
                              >
                                {index === formFields.length - 1 ? <IoAdd /> : <MdRemove />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'GSIS' && (
            <div className='w-full h-auto'>
              <h1 className="font-semibold text-lg mt-2 text-gray-500">Financial/Payment Details</h1>
              <div className="w-auto h-auto flex flex-col mt-2">
                <div className='w-full flex flex-col sm:flex-row items-center justify-center gap-2'>
                  <div className='w-full sm:w-1/2 mt-2'>
                    <label className='text-gray-500'>PREMIUM</label>
                    <input 
                      className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                      type="number" 
                      step='0.01'
                      //disabled={isDisabled && !permission.data.permission}
                      onChange={(e) => setPayeeData({...payeeData, amount: parseFloat(e.target.value)})}
                      placeholder='0'
                      value={payeeData.amount === 0 ? '' : payeeData.amount}
                      required  />
                  </div>
                  <div className='w-full sm:w-1/2 flex flex-col'>
                    <label className="text-gray-500">Account Entry</label>
                    <select 
                      className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                      >
                      <option value="Debit">Debit</option>
                      <option value="Credit">Credit</option>
                    </select>
                  </div>
                </div>
                <div className='w-full flex flex-col lg:flex-row gap-2 mt-2'>
                  <div className='w-full lg:w-1/3'>
                    <label className='text-gray-500 text-sm'>DOC. STAMP - DST Premium</label>
                    <input 
                      className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                      type="number" 
                      //disabled={isDisabled && !permission.data.permission}
                      value={gsis.stamp === 0 ? '' : gsis.stamp}
                      onChange={(e) => setGSIS({...gsis, stamp: parseFloat(e.target.value)})}
                      placeholder='0'
                      required  />
                  </div>
                  <div className='w-full lg:w-1/3'>
                    <label className='text-gray-500'>DST (COC)</label>
                    <input 
                      className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                      type="number" 
                      //disabled={isDisabled && !permission.data.permission}
                      value={gsis.dst === 0 ? '' : gsis.dst}
                      onChange={(e) => setGSIS({...gsis, dst: parseFloat(e.target.value)})}
                      placeholder='0'
                      required  />
                  </div>
                  <div className='w-full lg:w-1/3'>
                    <label className='text-gray-500'>VAT 12%</label>
                    <input 
                      className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                      type="number" 
                      //disabled={isDisabled && !permission.data.permission}
                      value={gsis.vat12 === 0 ? '' : gsis.vat12}
                      onChange={(e) => setGSIS({...gsis, vat12: parseFloat(e.target.value)})}
                      placeholder='0'
                      required  />
                  </div>
                </div>
              </div>
            </div>
          )} 
          {activeTab === 'Meralco' && (
            <div className='w-full h-auto'>
              <h1 className="font-semibold text-lg mt-2 text-gray-500">Financial/Payment Details</h1>
              <div className="w-auto h-auto flex flex-col mt-2">
                    {/* TIN AND VAT */}
                    <div className='w-full flex gap-2 mt-2'>
                      <div className='w-1/2'>
                        <label className='text-gray-500'>Tax Base</label>
                        <input 
                          className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                          type="number" 
                          //disabled={isDisabled && !permission.data.permission}
                          value={meralco.meralcoVAT === 0 ? '' : meralco.meralcoVAT}
                          onChange={(e) => setMeralco({...meralco, meralcoVAT: parseFloat(e.target.value)})}
                          placeholder='0'
                          required  />
                      </div>
                      <div className='w-full sm:w-1/2 flex flex-col'>
                        <label className="text-gray-500">Account Entry</label>
                        <select 
                          className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                          >
                          <option value="Debit">Debit</option>
                          <option value="Credit">Credit</option>
                        </select>
                      </div>
                    </div>
                    <div className='w-full flex gap-2 mt-2'>
                      <div className='w-1/2'>
                        <label className='text-gray-500'>VAT</label>
                        <input 
                          className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                          type="number" 
                          step='0.01'
                          //disabled={isDisabled && !permission.data.permission}
                          onChange={(e) => setPayeeData({...payeeData, amount: parseFloat(e.target.value)})}
                          placeholder='0'
                          value={payeeData.amount === 0 ? '' : payeeData.amount}
                          required  />
                      </div>
                      <div className='w-1/2'>
                        <label className='text-gray-500'>NON VAT</label>
                        <input 
                          className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 rounded-md border-2`}
                          type="number" 
                          //disabled={isDisabled && !permission.data.permission}
                          value={meralco.meralcoNONVAT === 0 ? '' : meralco.meralcoNONVAT}
                          onChange={(e) => setMeralco({...meralco, meralcoNONVAT: parseFloat(e.target.value)})}
                          placeholder='0'
                          required  />
                      </div>
                    </div>
                </div>
            </div>
          )}
          <div className='w-full h-auto py-3'>
            <div className='w-full h-auto'>
              <label className='text-gray-500'>Particulars</label>
              <textarea 
                className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 resize-none h-40 rounded-md border-2`}
                onChange={(e) => {setPayeeData({...payeeData, particular: e.target.value.trimStart()})}}
                value={payeeData.particular}
                //disabled={isDisabled && !permission.data.permission}
                placeholder='Write details here...'
                required
                maxLength="500"
              />
            </div>
            {(activeTab !== 'BUR' && activeTab !== 'Others' && activeTab !== 'To Release') && (
              <>
                <h1 className="font-semibold text-lg mt-2 text-gray-500">BIR Information</h1>
                <div className='w-full h-auto mt-2'>
                  <label className='text-gray-500'>Particulars</label>
                  <textarea 
                    className={`${user.role === '4' ? 'focus:outline-preparerPrimary' : 'focus:outline-fundingBlueGreen'} text-gray-500 w-full px-4 py-2 resize-none h-40 rounded-md border-2`}
                    onChange={(e) => {setBirData({...birData, birParticular: e.target.value.trimStart()})}}
                    value={birData.birParticular}
                    //disabled={isDisabled && !permission.data.permission}
                    placeholder='Write details here...'
                    required
                    maxLength="500"
                  />
                </div>
              </>
            )}
          </div>          
        </div>
        )}
      </div>
      <div className="w-full h-auto flex items-center justify-end gap-2 px-3 py-5 border-t-2">
        <div className='w-1/3 flex items-center justify-end px-3 gap-2'> 
          <button 
            onClick={modal}
            className="text-base 2xltext-base 2xl:text-lg :text-lg py-2 px-5 rounded-lg text-gray-500 border-2 hover:bg-gray-200 font-semibold transition-all duration-100"
            >Back</button>
          <button 
            type="submit" 
            disabled={isLoading} 
            className={`text-base 2xltext-base 2xl:text-lg :text-lg py-2 px-5 rounded-lg border-2 ${user.role === '4' ? 'bg-preparerPrimary text-white hover:bg-white hover:text-preparerPrimary border-preparerPrimary' : 'bg-fundingBlueGreen text-white hover:bg-white hover:text-fundingBlueGreen border-fundingBlueGreen'} transition-all duration-150`}
            >Save</button>
        </div>
      </div>
      {(isLoading || isLoadingBUR) && (
        <LargeLoader/>
      )}
    </form>
  )
}
DisbursementVoucher.propTypes = {
  modal: PropTypes.func.isRequired,
  flag: PropTypes.bool.isRequired,
  document: PropTypes.object,
  tab: PropTypes.string.isRequired
}

export default DisbursementVoucher;
