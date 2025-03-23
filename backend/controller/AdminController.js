
const {admin, db}  = require('../config/firebase')
require('dotenv').config();
const fs = require('fs');
const FieldValue = admin.firestore.FieldValue;
const path = require('path')
const XlsxPopulate = require('xlsx-populate');
const {toWords} = require('number-to-words')

const {
    setHistoryLogs,
    getDateTime,
    getUsers,
    setNotification,
    addComments,
    updateStatusBUR
  } = require('./MultiAccess/Functions');
const { merge } = require('../routes/AdminRoutes');
const { Console } = require('console');

const getAllLogs = async(req, res) => {
  try{
    const docRef = db.collection('passed_records').doc('History_Logs')
    const data = await docRef.get();

    const arrLogs = []

    if(data.exists){
      const logs = data.data()

      for(const key in logs){
        arrLogs.push(logs[key])
      }
      res.status(200).json(arrLogs);
    }
    else{
      console.log('No History Logs Founds')
    }  
  }
  catch(error){
    console.error("Error retrieving documents: ", error);
    res.status(500).json({ success: false, error: error.message });
  } 
}

// const uploadJSOn = async () => {
//   try {
//     const data = JSON.parse(fs.readFileSync('C:/Users/Administrator/Downloads/assests1.json', 'utf8'));
//     const docRef = db.collection('account_codes').doc('accountFields_1');
//     const transformedData = {};
//     Object.keys(data).forEach(key => {
//         const concatenatedValue = `${data[key].col.join(':')}:${data[key].account_title}`;

//         transformedData[key] = concatenatedValue;
//     });
//     await docRef.set(transformedData);

//     console.log('Data written successfully as a single document with multiple fields.');
// } catch (error) {
//     console.error(`Failed to write data: ${error}`);
// }
// }

// const readAdmin_records = async(req, res) => {
//   try {
//       const documents = {};
     
//       const recordsSnapshot = await db.collection('records')
//           .where('status', '==', 'For Approval')
//           .get();
      
//       recordsSnapshot.forEach((recordDoc) => {
//           if(recordDoc.exists){
//               const recordData = recordDoc.data();
//               documents[recordDoc.id] = {
//                   data: recordData,
//               }
              
//           }else{
//               console.log(`No such document for keys`);
//           }
//       })
//       res.status(200).json(documents);
//   } catch (error) {
//       console.log(`Error retrieving passed records: ${error}`);
//       res.status(404).json({ message: "Not Found" });
//   }
  
// }


// FUND CLUSTER
const addFundCluster = async (req, res) => {
  const newFundCluster = req.body.cluster
  const randomKey = req.body.key

  const clusterData = {
    [randomKey] : newFundCluster
  }

  try{
    const docRef = db.collection('formData').doc('fundCluster');
    const doc = await docRef.get()
    if(doc.exists){
      await docRef.update(clusterData)
    }else{
      await docRef.set(clusterData)
    }
    return res.status(200).json({success: true, message: `Successfully added ${newFundCluster}`});

  }catch(error){
    console.log('error adding new fundcluster')
    return res.status(500).json({ 
      success: false, 
      message: 'Error adding cluster', 
      error: error.message 
    });
  }
}

const getFundCluster = async (req, res) => {
  try{
    const docRef = db.collection('formData').doc('fundCluster');
    const data = await docRef.get();

    if(data.exists){
      const cluster = data.data()

      res.status(200).json({formData: cluster});
    }
    else{
      console.log('No Fund cluster found')
    } 

  }catch(error){
    console.error("Error retrieving fund cluster: ", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

const deleteFundCluster = async (req, res) => {
  try{
    const field_key = req.params.field_key;

    const docRef = db.collection('formData').doc('fundCluster');

    await docRef.update({
      [field_key]: FieldValue.delete()
    });

    res.status(200).json({ success: true, message: `Deleted key: ${field_key}` });

  }catch(error){
    console.log(`Error in deleting fund ${error}`)
    res.status(500).json({ success: false, error: error.message });
  }
}

// RESPONSIBILITY CENTER
const addRC = async (req, res) => {
  const newRC = req.body.RC
  const randomKey = req.body.key

  const rcData = {
    [randomKey] : newRC
  }

  try{
    const docRef = db.collection('formData').doc('ResponsibilityCenter');
    const doc = await docRef.get()
    if(doc.exists){
      await docRef.update(rcData)
    }else{
      await docRef.set(rcData)
    }
    return res.status(200).json({success: true, message: `Successfully added ${newRC}`});

  }catch(error){
    console.log('error adding new RC')
    return res.status(500).json({ 
      success: false, 
      message: 'Error creating RC', 
      error: error.message 
    });
  }
}

const getRC = async (req, res) => {
  try{
    const docRef = db.collection('formData').doc('ResponsibilityCenter');
    const data = await docRef.get();

    if(data.exists){
      const RC = data.data()

      res.status(200).json({formData: RC});
    }
    else{
      console.log('No RC found')
    } 

  }catch(error){
    console.error("Error retrieving RC ", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

const deleteRC = async (req, res) => {
  try{
    const field_key = req.params.field_key;

    const docRef = db.collection('formData').doc('ResponsibilityCenter');

    await docRef.update({
      [field_key]: FieldValue.delete()
    });

    res.status(200).json({ success: true, message: `Deleted key: ${field_key}` });

  }catch(error){
    console.log(`Error in deleting fund ${error}`)
    res.status(500).json({ success: false, error: error.message });
  }
}

//NAME AND OFFICE
const addNameAndOffice = async (req, res) => {
  try{
    const {name, office, key} = req.body
    const data = {
      [key] : [name, office]
    }
    const docRef = db.collection('formData').doc('NameOffice');
    const doc = await docRef.get()
    console.log(data)
    if(doc.exists){
      await docRef.update(data)
    }else{
      await docRef.set(data)
    }
    return res.status(200).json({success: true, message: `Successfully added ${data}`});
    
  }catch(error){
    console.log(`Error in adding new name and office ${error}`)
    res.status(500).json({ success: false, error: error.message });
  }
}

const getNameAndOffice = async (req, res) => {
  try{
    const docRef = db.collection('formData').doc('NameOffice');
    const data = await docRef.get();

    if(data.exists){
      const RC = data.data()

      res.status(200).json({formData: RC});
    }
    else{
      console.log('No name and office found')
    } 
  }catch(error){
    console.error("Error retrieving name and office ", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

const deleteNameAndOffice = async (req, res) => {
  try{
    const field_key = req.params.field_key;

    const docRef = db.collection('formData').doc('NameOffice');

    await docRef.update({
      [field_key]: FieldValue.delete()
    });

    res.status(200).json({ success: true, message: `Deleted key: ${field_key}` });

  }catch(error){
    console.log(`Error in deleting fund ${error}`)
    res.status(500).json({ success: false, error: error.message });
  }
}

//TAX TYPE
const addTaxType = async(req, res) => {
  try{
    const {tax, title, formula1, formula2, key} = req.body
    const data = {
      [key] : [tax, title, formula1, formula2]
    }
    const docRef = db.collection('formData').doc('TaxType');
    const doc = await docRef.get()
    if(doc.exists){
      await docRef.update(data)
    }else{
      await docRef.set(data)
    }
    return res.status(200).json({success: true, message: `Successfully added tax ${data}`});
    
  }catch(error){
    console.log(`Error in adding new tax ${error}`)
    res.status(500).json({ success: false, error: error.message });
  }
}

const getTaxType = async (req, res) => {
  try{
    const docRef = db.collection('formData').doc('TaxType');
    const data = await docRef.get();

    if(data.exists){
      const tax = data.data()

      res.status(200).json({formData: tax});
    }
    else{
      console.log('No tax type found')
    } 
  }catch(error){
    console.error("Error retrieving name and office ", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

const deleteTax = async (req, res) => {
  try{
    const field_key = req.params.field_key;

    const docRef = db.collection('formData').doc('TaxType');

    await docRef.update({
      [field_key]: FieldValue.delete()
    });

    res.status(200).json({ success: true, message: `Deleted key: ${field_key}` });

  }catch(error){
    console.log(`Error in deleting fund ${error}`)
    res.status(500).json({ success: false, error: error.message });
  }
}

const approveDV = async(req, res) => {
  const DV = req.params.id
  const dispName = req.user.name;
  const {payee, amount, fund, date, optionalAmount, accCategory}= req.body.data

  const dateTimeCollection = getDateTime();
  const logs = `${payee}!${DV}!Approved By ${dispName}!${dateTimeCollection}!Approved`

  console.log(req.body.data)

  try{
    const docRef = db.collection('records').doc(DV);
    
    const docSnapshot = await docRef.get();
    if (!docSnapshot.exists) {
      return res.status(404).json({ message: 'Document not found' });
    }

    await docRef.update({
      approvedBy: `${dispName}|${dateTimeCollection}`,
      status: 'Approved',
    });
    await setHistoryLogs(dateTimeCollection, logs)
    await addOnClusterAmount(amount, fund, date)
    await addOnCategoryPerMonth(amount, optionalAmount, accCategory, date)
    await CategoryOnMonth(amount, optionalAmount, accCategory)
    await addYearlyAmount(date, fund, amount)
    
    res.status(200).json({message: 'Document Approved Successfully'})
  }catch(error){
    console.log('Error Approving Document',error)
    res.status(500).json({ success: false, error: error.message });
  }
}

const addYearlyAmount = async(dateString, fund, amount) => {

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const field = `${year}-${month}`;
  const day =  String(date.getDate()).padStart(2, '0');
  const complete_date = `${field}-${day}`

  const clusterMapping = {
    "501 COB": "COB",
    "501 LFP": "LFP",
    "501 CARP": "CARP",
    "Contract Farming": "CF"
  };

  const cluster_mapped = clusterMapping[fund]
  const cluster_mapped_date = `${cluster_mapped}_dates`


  const ref = db.collection("YearlyRecords").doc(field)
  const doc = await ref.get()

  const data = doc.exists ? doc.data() : {};
  const curr_value = data[cluster_mapped] || 0;
  const newValue = parseFloat(curr_value) + parseFloat(amount);

  const curr_value_date = data[cluster_mapped_date]?.[complete_date] || 0
  const newValue_date = parseFloat(curr_value_date) + parseFloat(amount)

  try{
    await ref.set(
      {
        [cluster_mapped]: newValue
      },
      {merge: true}
    )

    await ref.set({
      [cluster_mapped_date]: {
        [complete_date]: newValue_date
      }
    }, {merge: true})
    console.log(`Successfully updated ${field}`);
  }catch(err){
    console.log(err, 'error on adding yearlt amount')
  }
}

const addOnClusterAmount = async (amount, cluster, dateString, operation='add') => {
  try{
      const float_amount = parseFloat(amount)

      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');

      const clusterMapping = {
          "501 COB": "COB",
          "501 LFP": "LFP",
          "501 CARP": "CARP",
          "Contract Farming": "CF"
      };

      const cluster_mapped = clusterMapping[cluster]
      const docRef = db.collection('AmountRecord').doc(`${year}-${month}`)
      const docSnapshot = await docRef.get()
      const existing_amount = docSnapshot.exists ? parseFloat(docSnapshot.data()[cluster_mapped]) || 0 : 0

      const newAmount = operation === 'subtract' ? existing_amount - float_amount : existing_amount + float_amount
      const data = { [cluster_mapped]: newAmount < 0 ? 0 : newAmount };

      await docRef.set(data, {merge: true})

  }catch(error){
      console.log(`Error on addOnClusterAmount (editor controller) ${error}`)
  }
}

const CategoryOnMonth = async (amount, optionalAmount, accCategory) => {
  console.log(accCategory)
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const docRef = db.collection('MonthCategory2').doc(`${year}-${month}`);

  // Fetch document data once to reduce reads
  const docSnapshot = await docRef.get();
  const existingData = docSnapshot.exists ? docSnapshot.data() : {};

  const updates = {};

  if (optionalAmount.length === 1 && optionalAmount[0] === '') {
    // Case when there is only one amount
    const [category, subcategory] = accCategory[0].split('|');
    const fieldKey = `${category}|${subcategory}`;
    const float_amount = parseFloat(amount) || 0;

    const existingAmount = parseFloat(existingData[fieldKey] || 0);
    const newAmount = Math.max(existingAmount + float_amount, 0);

    updates[fieldKey] = newAmount;
  } else {
    // Case when multiple amounts are provided
    accCategory.forEach((cat, i) => {
      const [category, subcategory] = cat.split('|');
      const fieldKey = `${category}|${subcategory}`;
      const subAmount = parseFloat(optionalAmount[i]) || 0;

      const existingAmount = parseFloat(existingData[fieldKey] || 0);
      const newAmount = Math.max(existingAmount + subAmount, 0);

      updates[fieldKey] = newAmount;
    });
  }

  await docRef.set(updates, { merge: true });
};


const addOnCategoryPerMonth = async (amount, optionalAmount, accCategory, dateString, operation = 'add') => {
  try{
      console.log(amount, optionalAmount, accCategory, dateString, operation)
      const today = new Date(dateString);
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');

      const docRef = db.collection('MonthCategory').doc(`${year}-${month}`);

      if (optionalAmount.length === 1 && optionalAmount[0] === ''){
          const [category, subcategory] = accCategory[0].split('|');
          const fieldKey = `${category}|${subcategory}`;
          const float_amount = parseFloat(amount)

          const docSnapshot = await docRef.get();
          const existingData = docSnapshot.exists ? docSnapshot.data() : {};
          const existingAmount = parseFloat(existingData[fieldKey] || 0);

          const newAmount = operation === 'subtract' ? existingAmount - float_amount : existingAmount + float_amount
          await docRef.set({ [fieldKey]: newAmount < 0 ? 0 : newAmount }, { merge: true });
          
      }else{
          const updates = {};
          for (let i = 0; i< accCategory.length; i++){
              const [category, subcategory] = accCategory[i].split('|')
              const fieldKey = `${category}|${subcategory}`;
              const subAmount = parseFloat(optionalAmount[i]);

              const docSnapshot = await docRef.get()
              const existingData = docSnapshot.exists ? docSnapshot.data() : {}
              const existingAmount = parseFloat(existingData[fieldKey] || 0);

              const newAmount = operation === 'subract' ? existingAmount - subAmount : existingAmount + subAmount
              updates[fieldKey] = newAmount < 0 ? 0 : newAmount;
          }
          await docRef.set(updates, { merge: true });
      }
  }catch(error){
      console.log(`Error on addOnCategoryPerMonth(editor controller) ${error}`)
  }
}

const getNumberOfRecords = async (req, res) => {
  try{
    const year = new Intl.DateTimeFormat('en-PH', {year: 'numeric'}).format(new Date())
    const docRef = db.collection('NumberOfRecords').doc(year.toString())
    const data = await docRef.get()
    if(data.exists){
      const totalRecords = data.data()
      res.status(200).json({records: totalRecords})
    }else{
      console.log(`year ${year} is not found`)
    } 
  }catch(error){
    console.log('error on getting number of records', error)
    res.status(500).json({ success: false, error: error.message });
  }
}

const getUniqueList = (data) => {
  const seen = new Set();

  const uniqueNames = Object.keys(data.ASA)
    .map(key => key.split('!')[0])       
    .filter(name => {
      if (seen.has(name)) return false;  
      seen.add(name);
      return true;
    });

  return uniqueNames.join("\r\n").replace(/\|/g, ' ');
}

const getDecimal = (num) => {
  const decimalPart = num % 1;
  const numerator = Math.round(decimalPart * 100);
  // const result = `${numerator}/100`;
  return numerator
}

const downloadGSIS_Refund = async(req, res) => {
  const { data } = req.body
  try{
    const templatePath = path.join(__dirname, '..', 'templates', data.ORSBURS ? 'GSISRefund.xlsx' : 'GSISRefund.xlsx'); 
    const workbook = await XlsxPopulate.fromFileAsync(templatePath);

    const amount = parseFloat(data.amount)
    const amount_decimal = getDecimal(amount)

    const checkBoxData = {cell: ''}
    switch(data.MOP.toLowerCase()){
      case 'others':
        checkBoxData.cell = 'N9'
        checkBoxData.specified = `Others (Please specify) - ${data.specifiedMOP}`
        break;
      case 'ada':
        checkBoxData.cell = 'K9'
        break
      case 'commercial check':
        checkBoxData.cell = 'G9'
        break
      case 'mds check':
        checkBoxData.cell = 'D9'
        break
      default:
        checkBoxData.cell = 'N9'
        break

    }
    console.log(data.specifiedMOP, data.MOP)


    workbook.sheet('Sheet1').cell(checkBoxData.cell).value('✓')
    workbook.sheet('Sheet1').cell("O9").value(checkBoxData.specified ? checkBoxData.specified : 'Others (Please specify)')
    workbook.sheet('Sheet1').cell("P2").value(data.fund)
    workbook.sheet('Sheet1').cell("P4").value(convertDate(data.date))
    workbook.sheet('Sheet1').cell("P6").value(data.DV)
    workbook.sheet('Sheet1').cell("C11").value(data.payee)
    workbook.sheet('Sheet1').cell("K12").value(`${data.TIN ? `${data.TT_tax} ${data.TIN}` : 'N/A'}`)
    workbook.sheet('Sheet1').cell("P12").value(data.ORSBURS)
    workbook.sheet('Sheet1').cell("C13").value(data.address)
    workbook.sheet('Sheet1').cell("A16").value(data.particular)
    workbook.sheet('Sheet1').cell("K17").value(data.RC)
    workbook.sheet('Sheet1').cell("Q17").value(parseFloat(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell("Q30").value(parseFloat(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell("A36").value(data.NF_name)
    workbook.sheet('Sheet1').cell("A37").value(data.NF_office)
    workbook.sheet('Sheet1').cell("M41").value(parseFloat(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell("Q42").value(parseFloat(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell("K44").value(`${toWords(amount).charAt(0).toUpperCase() + toWords(amount).slice(1)} Pesos${amount_decimal > 0 ? ` and ${amount_decimal}/100` : ''}`)
    workbook.sheet('Sheet1').cell("C50").value(data.accountingHead_name)
    workbook.sheet('Sheet1').cell("C52").value(data.accountingHead_office)
    workbook.sheet('Sheet1').cell("M50").value(data.agencyHead_name)
    workbook.sheet('Sheet1').cell("M52").value(data.agencyHead_office)
    workbook.sheet('Sheet1').cell("K58").value('LBP 0242-1107-57')


    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=protected-template.xlsx');
    await workbook.outputAsync({ type: "nodebuffer" }).then(buffer => res.send(buffer));
  }catch(err){
    console.log('error on downloading gsis refund/remittance', err.message)
    res.status(500).json({ success: false, error: err.message });
  }
}

const downloadDV = async(req, res) => {
  const { data } = req.body

  try {
    console.log('downloading...')
    console.log(data)
    const templatePath = path.join(__dirname, '..', 'templates', data.ORSBURS ? 'DVwithBUR.xlsx' : 'DV.xlsx'); 
    const workbook = await XlsxPopulate.fromFileAsync(templatePath);

    //Computation
    const val1 = eval(data.amount + data.TT_formula1).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    const val2 = eval(data.amount + data.TT_formula2).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    const tval = parseFloat(val1.replace(/,/g, '')) + parseFloat(val2.replace(/,/g, ''))
    const total_val = tval.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    const floatTotal_val = parseFloat(total_val.replace(/,/g, ''))
    const floatTotal_val_decimal = getDecimal(floatTotal_val)
    
    const adue = data.amount - tval
    const amount_due = adue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    const floatAmountDue = parseFloat(amount_due.replace(/,/g, ''))
    const floatAmountDue_decimal = getDecimal(floatAmountDue)

    const combinedAccTitle = data.accTitle.join("\n");
    const combinedAccCode = data.accCode.join("\n");
  

    // const ASA = Object.keys(data.ASA).map(key => key.split('!')[0]).join("\r\n").replace(/\|/g, ' ').replace(/\//g, ' ').replace(/\,/g, ' ');
    const ASA = getUniqueList(data)
    const ASANO = `ASA No. ${ASA}`
    console.log(ASA)

    //payee
    workbook.sheet('Sheet1').cell("P2").value(data.fund)
    workbook.sheet('Sheet1').cell("P4").value(convertDate(data.date))
    workbook.sheet('Sheet1').cell("P6").value(data.DV)
    workbook.sheet('Sheet1').cell("C11").value(data.payee)
    workbook.sheet('Sheet1').cell("K12").value(`${data.TT_tax} ${data.TIN}`)
    workbook.sheet('Sheet1').cell("P12").value(data.ORSBURS)
    workbook.sheet('Sheet1').cell("C13").value(data.address)
    workbook.sheet('Sheet1').cell("A16").value(data.particular)
    workbook.sheet('Sheet1').cell("K17").value(data.RC)
    workbook.sheet('Sheet1').cell("Q17").value(parseFloat(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell("C28").value(ASANO).style("wrapText", true)
    workbook.sheet('Sheet1').cell("C25").value(parseFloat(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell("C26").value(parseFloat(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell("E25").value(data.TT_formula1.replace(/\*/g, ' x ').replace(/\//g, ' / ').replace(/\+/g, ' + ').replace(/\-/g, ' - '))
    workbook.sheet('Sheet1').cell("E26").value(data.TT_formula2.replace(/\*/g, ' x ').replace(/\//g, ' / ').replace(/\+/g, ' + ').replace(/\-/g, ' - '))
    workbook.sheet('Sheet1').cell("G25").value(eval(data.amount + data.TT_formula1).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell("G26").value(eval(data.amount + data.TT_formula2).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell("Q25").value(total_val)
    workbook.sheet('Sheet1').cell("Q30").value(amount_due)
    workbook.sheet('Sheet1').cell("A36").value(data.NF_name)
    workbook.sheet('Sheet1').cell("A37").value(data.NF_office)
    workbook.sheet('Sheet1').cell("Q43").value(amount_due)
    workbook.sheet('Sheet1').cell("N40").value(parseFloat(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell("Q41").value(eval(data.amount + data.TT_formula1).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell("Q42").value(eval(data.amount + data.TT_formula2).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell("K45").value(`${toWords(floatAmountDue).charAt(0).toUpperCase() + toWords(floatAmountDue).slice(1)} Pesos${floatAmountDue_decimal > 0 ? ` and ${floatAmountDue_decimal}/100` : ''}`)
    workbook.sheet('Sheet1').cell("B40").value(combinedAccTitle).style({
      wrapText: true, 
      verticalAlignment: "top",
    });
    workbook.sheet('Sheet1').cell("K40").value(combinedAccCode).style({
      wrapText: true, 
      verticalAlignment: "top",
    });
    workbook.sheet('Sheet1').cell("B41").value(`Due to BIR (${cutFormula(data.TT_formula1)})`)
    workbook.sheet('Sheet1').cell("B42").value(`Due to BIR (${cutFormula(data.TT_formula2)})`)
    workbook.sheet('Sheet1').cell("B45").value(data.cashAvailable ? '✓' : '')
    workbook.sheet('Sheet1').cell("B46").value(data.debitAccount ? '✓' : '')
    workbook.sheet('Sheet1').cell("B47").value(data.supportingDocuments ? '✓' : '')
    workbook.sheet('Sheet1').cell("C51").value(data.accountingHead_name)
    workbook.sheet('Sheet1').cell("C53").value(data.accountingHead_office)
    workbook.sheet('Sheet1').cell("M51").value(data.agencyHead_name)
    workbook.sheet('Sheet1').cell("M53").value(data.agencyHead_office)
    workbook.sheet('Sheet1').cell("K59").value('LBP 0242-1107-57')

    //BIR
    workbook.sheet('Sheet1').cell("P81").value(data.fund)
    workbook.sheet('Sheet1').cell("P85").value(data.DVBIR)
    workbook.sheet('Sheet1').cell("P83").value(convertDate(data.date))
    workbook.sheet('Sheet1').cell("P91").value(data.ORSBURS)   
    workbook.sheet('Sheet1').cell("A95").value(data.birParticular)   
    workbook.sheet('Sheet1').cell("Q96").value(total_val)   
    workbook.sheet('Sheet1').cell("Q109").value(total_val)  
    workbook.sheet('Sheet1').cell("N119").value(eval(data.amount + data.TT_formula1).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell("N120").value(eval(data.amount + data.TT_formula2).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell("Q121").value(total_val)
    workbook.sheet('Sheet1').cell("B119").value(`Due to BIR (${cutFormula(data.TT_formula1)})`)
    workbook.sheet('Sheet1').cell("B120").value(`Due to BIR (${cutFormula(data.TT_formula2)})`)  
    workbook.sheet('Sheet1').cell("A115").value(data.NF_name)
    workbook.sheet('Sheet1').cell("A116").value(data.NF_office)
    workbook.sheet('Sheet1').cell("K123").value(`${toWords(floatTotal_val).charAt(0).toUpperCase() + toWords(floatTotal_val).slice(1)} Pesos${floatTotal_val_decimal > 0 ? ` and ${floatTotal_val_decimal}/100` : ''}`)
    workbook.sheet('Sheet1').cell("B123").value(data.cashAvailable ? '✓' : '')
    workbook.sheet('Sheet1').cell("B124").value(data.debitAccount ? '✓' : '')
    workbook.sheet('Sheet1').cell("B125").value(data.supportingDocuments ? '✓' : '')
    workbook.sheet('Sheet1').cell("C129").value(data.accountingHead_name)
    workbook.sheet('Sheet1').cell("C131").value(data.accountingHead_office)
    workbook.sheet('Sheet1').cell("M129").value(data.agencyHead_name)
    workbook.sheet('Sheet1').cell("M131").value(data.agencyHead_office)
    workbook.sheet('Sheet1').cell("K137").value('LBP 0242-1107-57')
    workbook.sheet('Sheet1').cell("C103").value(parseFloat(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell("C104").value(parseFloat(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell("E103").value(data.TT_formula1.replace(/\*/g, ' x ').replace(/\//g, ' / ').replace(/\+/g, ' + ').replace(/\-/g, ' - '))
    workbook.sheet('Sheet1').cell("E104").value(data.TT_formula2.replace(/\*/g, ' x ').replace(/\//g, ' / ').replace(/\+/g, ' + ').replace(/\-/g, ' - '))
    workbook.sheet('Sheet1').cell("G103").value(eval(data.amount + data.TT_formula1).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell("G104").value(eval(data.amount + data.TT_formula2).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))

    //BUR
    if(data.ORSBURS) {
      workbook.sheet('Sheet1').cell("D164").value(data.payee)
      workbook.sheet('Sheet1').cell("D168").value(data.address)
      workbook.sheet('Sheet1').cell("P160").value(`Serial No.: ${data.ORSBURS}`)
      workbook.sheet('Sheet1').cell("P162").value(`Fund Cluster: ${data.fund}`)
      workbook.sheet('Sheet1').cell("P161").value(`Date: ${convertDate(data.date)}`)
      workbook.sheet('Sheet1').cell("P173").value(parseFloat(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
      workbook.sheet('Sheet1').cell("P187").value(parseFloat(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
      // workbook.sheet('Sheet1').cell("P187").value(amount_due)
      workbook.sheet('Sheet1').cell("D173").value(data.particular)
      workbook.sheet('Sheet1').cell("A173").value(data.RC)
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=protected-template.xlsx');
    await workbook.outputAsync({ type: "nodebuffer" }).then(buffer => res.send(buffer));
  } catch (error) {
    console.log('error downloading DV', error)
    res.status(500).json({ success: false, error: error.message });
  }
}

const downloadGSIS = async(req, res) => {
  const { data } = req.body
  console.log(data)
  try {
    const templatePath = path.join(__dirname, '..', 'templates', 'GSIS.xlsx'); 
    const workbook = await XlsxPopulate.fromFileAsync(templatePath);

    //GSIS computation
    const val1 = eval(data.amount + data.TT_formula1).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    const gross_gsis = (parseFloat(data.amount) || 0) + (parseFloat(data.stamp) || 0) + (parseFloat(data.dst) || 0) + (parseFloat(data.vat12) || 0)
    const amountDue_gsis = gross_gsis - (parseFloat(val1) || 0)

    const amountDue_gsis_decimal = getDecimal(amountDue_gsis)
    const val1_decimal = getDecimal(parseFloat(val1))

    const checkBoxData = {cell: ''}
    switch(data.MOP.toLowerCase()){
      case 'others':
        checkBoxData.cell = 'N9'
        checkBoxData.specified = `Others (Please specify) - ${data.specifiedMOP}`
        break;
      case 'ada':
        checkBoxData.cell = 'K9'
        break
      case 'commercial check':
        checkBoxData.cell = 'G9'
        break
      case 'mds check':
        checkBoxData.cell = 'D9'
        break
      default:
        checkBoxData.cell = 'N9'
        break

    }

    const ASA = getUniqueList(data)
    //payee
    workbook.sheet('Sheet1').cell(checkBoxData.cell).value('✓')
    workbook.sheet('Sheet1').cell("O9").value(checkBoxData.specified ? checkBoxData.specified : 'Others (Please specify)')
    workbook.sheet('Sheet1').cell("P2").value(data.fund)
    workbook.sheet('Sheet1').cell("P4").value(convertDate(data.date))
    workbook.sheet('Sheet1').cell("P6").value(data.DV)
    workbook.sheet('Sheet1').cell("C11").value(data.payee)
    workbook.sheet('Sheet1').cell("K12").value(`${data.TIN ? `${data.TT_tax} ${data.TIN}` : 'N/A'}`)
    workbook.sheet('Sheet1').cell("P12").value(data.ORSBURS)
    workbook.sheet('Sheet1').cell("C13").value(data.address)
    workbook.sheet('Sheet1').cell("B17").value(data.particular)
    workbook.sheet('Sheet1').cell("K17").value(data.RC)
    workbook.sheet('Sheet1').cell("Q17").value(gross_gsis.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    // workbook.sheet('Sheet1').cell("D37").value(data.ASA.replace('|', ' ').replace('/', ' ').replace(',', ' '))
    workbook.sheet('Sheet1').cell("G23").value(parseFloat(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell("G24").value(parseFloat(data.stamp).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell("G25").value(parseFloat(data.dst).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell("G26").value(parseFloat(data.vat12).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell("G27").value(gross_gsis)
    workbook.sheet('Sheet1').cell("G30").value(val1.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell("Q30").value(val1.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell("Q39").value(amountDue_gsis)
    workbook.sheet('Sheet1').cell("C30").value(parseFloat(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell("A45").value(data.NF_name)
    workbook.sheet('Sheet1').cell("A46").value(data.NF_office)
    workbook.sheet('Sheet1').cell("N49").value(val1.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell("Q51").value(amountDue_gsis)
    workbook.sheet('Sheet1').cell("K53").value(`${toWords(amountDue_gsis).charAt(0).toUpperCase() + toWords(amountDue_gsis).slice(1)} pesos${amountDue_gsis_decimal > 0 ? ` and ${amountDue_gsis_decimal}/100` : ''}`)
    workbook.sheet('Sheet1').cell("B53").value(data.cashAvailable ? '✓' : '')
    workbook.sheet('Sheet1').cell("B54").value(data.debitAccount ? '✓' : '')
    workbook.sheet('Sheet1').cell("B55").value(data.supportingDocuments ? '✓' : '')
    workbook.sheet('Sheet1').cell("C59").value(data.accountingHead_name)
    workbook.sheet('Sheet1').cell("C61").value(data.accountingHead_office)
    workbook.sheet('Sheet1').cell("M59").value(data.agencyHead_name)
    workbook.sheet('Sheet1').cell("M61").value(data.agencyHead_office)
    workbook.sheet('Sheet1').cell("D35").value(data.PR_No)
    workbook.sheet('Sheet1').cell("D36").value(data.PO_No)
    workbook.sheet('Sheet1').cell("D37").value(ASA)
    // workbook.sheet('Sheet1').cell("B41").value(`Due to BIR (${cutFormula(data.TT_formula1)})`)
    // workbook.sheet('Sheet1').cell("B42").value(`Due to BIR (${cutFormula(data.TT_formula2)})`)

    //BIR
    workbook.sheet('Sheet1').cell("P92").value(data.fund)
    workbook.sheet('Sheet1').cell("P94").value(convertDate(data.date))
    workbook.sheet('Sheet1').cell("P96").value(data.DV)   
    workbook.sheet('Sheet1').cell("P102").value(data.ORSBURS)
    workbook.sheet('Sheet1').cell("A106").value(data.birParticular)   
    workbook.sheet('Sheet1').cell("Q107").value(val1.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))   
    workbook.sheet('Sheet1').cell("Q120").value(val1.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))  
    workbook.sheet('Sheet1').cell("N130").value(eval(data.amount + data.TT_formula1).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell("Q132").value(val1.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell("B130").value(`Due to BIR (${cutFormula(data.TT_formula1)})`)
    workbook.sheet('Sheet1').cell("A126").value(data.NF_name)
    workbook.sheet('Sheet1').cell("A127").value(data.NF_office)
    workbook.sheet('Sheet1').cell("C140").value(data.accountingHead_name)
    workbook.sheet('Sheet1').cell("C141").value(data.accountingHead_office)
    workbook.sheet('Sheet1').cell("M140").value(data.NF_name)
    workbook.sheet('Sheet1').cell("M141").value(data.NF_office)
    workbook.sheet('Sheet1').cell("K134").value(`${toWords(parseFloat(val1)).charAt(0).toUpperCase() + toWords(parseFloat(val1)).slice(1)} pesos${val1_decimal > 0 ? ` and ${val1_decimal}/100` : ''}`)

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=protected-template.xlsx');
    await workbook.outputAsync({ type: "nodebuffer" }).then(buffer => res.send(buffer));
  } catch (error) {
    console.log('error downloading DV', error)
    res.status(500).json({ success: false, error: error.message });
  }
}

const downloadMeralco = async(req, res) => {
  const { data } = req.body
  // console.log(data)

  try {
    console.log(data)

    const templatePath = path.join(__dirname, '..', 'templates', 'Meralco.xlsx'); 
    const workbook = await XlsxPopulate.fromFileAsync(templatePath);

    const checkBoxData = {cell: ''}
    switch(data.MOP.toLowerCase()){
      case 'others':
        checkBoxData.cell = 'N9'
        checkBoxData.specified = `Others (Please specify) - ${data.specifiedMOP}`
        break;
      case 'ada':
        checkBoxData.cell = 'K9'
        break
      case 'commercial check':
        checkBoxData.cell = 'G9'
        break
      case 'mds check':
        checkBoxData.cell = 'D9'
        break
      default:
        checkBoxData.cell = 'N9'
        break

    }

    const taxAmount = (parseFloat(data.meralcoVAT) * 0.05) + ((parseFloat(data.meralcoNONVAT) + parseFloat(data.meralcoVAT)) * 0.02)
    const newAmount = parseFloat(data.amount) - taxAmount
    console.log(newAmount, data.amount, taxAmount)
    const newAmount_decimal = getDecimal(newAmount)
    const taxAmount_decimal = getDecimal(taxAmount)

    const ASA = getUniqueList(data)
    const ASANO = `ASA No. ${ASA}`
    console.log(ASA)

    //payee
    workbook.sheet('meralcobir').cell(checkBoxData.cell).value('✓')
    workbook.sheet('meralcobir').cell("O9").value(checkBoxData.specified ? checkBoxData.specified : 'Others (Please specify)')
    workbook.sheet('meralcobir').cell("P2").value(data.fund)
    workbook.sheet('meralcobir').cell("P4").value(convertDate(data.date))
    workbook.sheet('meralcobir').cell("P6").value(data.DV)
    workbook.sheet('meralcobir').cell("C11").value(data.payee)
    workbook.sheet('meralcobir').cell("K12").value(`${data.TT_tax} ${data.TIN}`)
    workbook.sheet('meralcobir').cell("P12").value(data.ORSBURS)
    workbook.sheet('meralcobir').cell("C13").value(data.address)
    workbook.sheet('meralcobir').cell("B17").value(data.particular)
    workbook.sheet('meralcobir').cell("K17").value(data.RC)
    workbook.sheet('meralcobir').cell("Q17").value(parseFloat(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('meralcobir').cell("D36").value(ASA).style("wrapText", true)
    workbook.sheet('meralcobir').cell("C29").value(parseFloat(data.meralcoVAT).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('meralcobir').cell("C30").value(parseFloat(data.meralcoVAT).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('meralcobir').cell("E30").value(parseFloat(data.meralcoNONVAT).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('meralcobir').cell("C58").value(data.accountingHead_name)
    workbook.sheet('meralcobir').cell("C60").value(data.accountingHead_office)
    workbook.sheet('meralcobir').cell("M58").value(data.agencyHead_name)
    workbook.sheet('meralcobir').cell("M60").value(data.agencyHead_office)
    workbook.sheet('meralcobir').cell("K145").value('LBP 0242-1107-57')
    workbook.sheet('meralcobir').cell("K66").value('LBP 0242-1107-57')
    workbook.sheet('meralcobir').cell("K52").value(`${toWords(parseFloat(newAmount)).charAt(0).toUpperCase() + toWords(parseFloat(newAmount)).slice(1)} pesos${newAmount_decimal > 0 ? ` and ${newAmount_decimal}/100` : ''}`)
    workbook.sheet('meralcobir').cell("B52").value(data.cashAvailable ? '✓' : '')
    workbook.sheet('meralcobir').cell("B53").value(data.debitAccount ? '✓' : '')
    workbook.sheet('meralcobir').cell("B54").value(data.supportingDocuments ? '✓' : '')
    workbook.sheet('meralcobir').cell("A44").value(data.NF_name)
    workbook.sheet('meralcobir').cell("A45").value(data.NF_office)

    //BIR
    workbook.sheet('meralcobir').cell("P89").value(data.fund)
    workbook.sheet('meralcobir').cell("P91").value(convertDate(data.date))
    workbook.sheet('meralcobir').cell("P93").value(data.DV)   
    workbook.sheet('meralcobir').cell("P99").value(data.ORSBURS)
    workbook.sheet('meralcobir').cell("A103").value(data.birParticular)   
    workbook.sheet('meralcobir').cell("Q104").value(taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))   
    workbook.sheet('meralcobir').cell("Q117").value(taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))  
    // workbook.sheet('meralcobir').cell("N130").value(eval(data.amount + data.TT_formula1).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('meralcobir').cell("Q129").value(taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('meralcobir').cell("B127").value(`Due to BIR (${cutFormula(data.TT_formula1)})`)
    workbook.sheet('meralcobir').cell("B128").value(`Due to BIR (${cutFormula(data.TT_formula2)})`)
    workbook.sheet('meralcobir').cell("N127").value((parseFloat(data.meralcoVAT) * 0.05).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('meralcobir').cell("N128").value(parseFloat((data.meralcoNONVAT) * 0.02).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('meralcobir').cell("A123").value(data.NF_name)
    workbook.sheet('meralcobir').cell("A124").value(data.NF_office)
    workbook.sheet('meralcobir').cell("C137").value(data.accountingHead_name)
    workbook.sheet('meralcobir').cell("C138").value(data.accountingHead_office)
    workbook.sheet('meralcobir').cell("M137").value(data.agencyHead_name)
    workbook.sheet('meralcobir').cell("M138").value(data.agencyHead_office)
    workbook.sheet('meralcobir').cell("K131").value(`${toWords(parseFloat(taxAmount)).charAt(0).toUpperCase() + toWords(parseFloat(taxAmount)).slice(1)} pesos${taxAmount_decimal > 0 ? ` and ${taxAmount_decimal}/100` : ''}`)
    workbook.sheet('meralcobir').cell("B131").value(data.cashAvailable ? '✓' : '')
    workbook.sheet('meralcobir').cell("B132").value(data.debitAccount ? '✓' : '')
    workbook.sheet('meralcobir').cell("B133").value(data.supportingDocuments ? '✓' : '')

    // //BUR
    if(data.ORSBURS) {
      workbook.sheet('meralcobir').cell("D169").value(data.payee)
      workbook.sheet('meralcobir').cell("D173").value(data.address)
      workbook.sheet('meralcobir').cell("P165").value(`Serial No.: ${data.ORSBURS}`)
      workbook.sheet('meralcobir').cell("P166").value(`Fund Cluster: ${data.fund}`)
      workbook.sheet('meralcobir').cell("P167").value(`Date: ${convertDate(data.date)}`)
      workbook.sheet('meralcobir').cell("P178").value(parseFloat(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
      workbook.sheet('meralcobir').cell("P192").value(parseFloat(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
      // workbook.sheet('Sheet1').cell("P187").value(amount_due)
      workbook.sheet('meralcobir').cell("D178").value(data.particular)
      workbook.sheet('meralcobir').cell("A178").value(data.RC)
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=protected-template.xlsx');
    await workbook.outputAsync({ type: "nodebuffer" }).then(buffer => res.send(buffer));
  } catch (error) {
    console.log('error downloading DV', error)
    res.status(500).json({ success: false, error: error.message });
  }
}

const downloadBUR = async(req, res) => {
  const { data } = req.body
  try {
    const templatePath = path.join(__dirname, '..', 'templates', 'BUR.xlsx'); 
    const workbook = await XlsxPopulate.fromFileAsync(templatePath);

    workbook.sheet('Sheet1').cell("D6").value(data.payee)
    workbook.sheet('Sheet1').cell("D8").value(data.office)
    workbook.sheet('Sheet1').cell("D10").value(data.address)
    workbook.sheet('Sheet1').cell("P2").value(`No.: ${data.No}`)
    workbook.sheet('Sheet1').cell("P3").value(`GAA: ${data.GAA}`)
    workbook.sheet('Sheet1').cell("P4").value(`Date: ${convertDate(data.date)}`)
    workbook.sheet('Sheet1').cell("P29").value(parseFloat(data.amount.map(amount => amount.amount).reduce((acc, num) => acc + num, 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    workbook.sheet('Sheet1').cell('P24').value(data.amount.map(amount => amount.amount).join('\n'))
    workbook.sheet('Sheet1').cell('F24').value(data.amount.map(title => title.title).join('\n'))
    workbook.sheet('Sheet1').cell("D15").value(data.particular)
    workbook.sheet('Sheet1').cell("A15").value(data.resCenter)
    workbook.sheet('Sheet1').cell("L15").value(data.MFOPAP)
    workbook.sheet('Sheet1').cell("N15").value(data.uacsCode)
    workbook.sheet('Sheet1').cell("E38").value(data.NFNameA)
    workbook.sheet('Sheet1').cell("E39").value(data.NFOfficeA)
    workbook.sheet('Sheet1').cell("O38").value(data.NFNameB)
    workbook.sheet('Sheet1').cell("O39").value(data.NFOfficeB)

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=protected-template.xlsx');
    await workbook.outputAsync({ type: "nodebuffer" }).then(buffer => res.send(buffer));
  } catch (error) {
    console.log('error downloading BUR', error)
    res.status(500).json({ success: false, error: error.message });
  }
}

const convertDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

const cutFormula = (formula) => {
  let remainingString = "";

  for (let i = 0; i < formula.length; i++) {
    if (formula[i] === "*") {
      remainingString = formula.slice(i + 1); 
      break; 
    }
  }
  return parseFloat(remainingString) * 100 + '%'
}

const returnRecordTo = async(req, res) => {
  const {DV, payee, returnTo, remarks} = req.body;
  const dispName = req.user.name;

  console.log(req.body)
  
  const dateTimeCollection = getDateTime();
  const notifMessage1 = "The Disbursement Voucher for"
  const notifMessage2 = "has been returned by"
  const dataCollection = `${dateTimeCollection}|${payee}|${dispName}`
  const returnedBy = `${dispName}|${dateTimeCollection}`
  const comment = {dispName, remarks, dateTimeCollection}
  const logs = `${payee}!${DV}!Returned By ${dispName}!${dateTimeCollection}!Returned`
  
  try{
      await updateStatus(DV, returnedBy, returnTo)
      const listOfAcc = await getUsers(returnTo);
      await setNotification(listOfAcc, dataCollection, notifMessage1, notifMessage2, DV)
      if(remarks) {
          await addComments(DV, comment)
      }
      await setHistoryLogs(dateTimeCollection, logs)

      res.status(200).json({message: 'Disbursement Voucher has been returned'});

  }catch(error){
      console.log(`Error retrieving passed records: ${error}`);
      res.status(500).json({ message: "Internal Error" });
  }
}

const updateStatus = async (DV, dTPassed, returnToRole) => {
  try{
      const returnType = `Returned|${returnToRole}`
      const docref = db.collection('records').doc(DV)
      switch(returnToRole) {
        case '4':
          await docref.update({
            returnedToPreparer: dTPassed,
            status: returnType
          })
          break
        case '3':
          await docref.update({
            returnedToFunding: dTPassed,
            status: returnType
          }) 
          break
        case '2':
          await docref.update({
            returnedToBO: dTPassed,
            status: returnType
          })
          break
        default:
          break
      }
      const updatedDoc = await docref.get()
      return updatedDoc.data();
  }catch(error){
      console.log("error in updating", error)
  }
}

const updateFundCluster = async(req, res) => {
  const {updatedFundCluster} = req.body
  const { id } = req.params

  console.log(id, updatedFundCluster)

  try {
    const docref = db.collection('formData').doc('fundCluster')

    await docref.update({
      [id]: updatedFundCluster
    })

    res.status(200).json({message: 'Fund Cluster has been updated'})
  } catch (error) {
    console.log(`Error updating fund cluster: ${error}`);
      res.status(500).json({ message: "Internal Error" });
  }
}

const updateResCen = async(req, res) => {
  const { updatedResCen } = req.body
  const { id } = req.params

  try {
    const docref = db.collection('formData').doc('ResponsibilityCenter')

    await docref.update({
      [id]: updatedResCen
    })

    res.status(200).json({message: 'Responsibility center has been updated'})
  } catch (error) {
    console.log(`Error updating Responsibility center: ${error}`);
      res.status(500).json({ message: "Internal Error" });
  }
}

const updateNameAndOffice = async(req, res) => {
  const { updatedName, updatedOffice } = req.body
  const { id } = req.params

  try {
    const docref = db.collection('formData').doc('NameOffice')

    await docref.update({
      [id]: [updatedName, updatedOffice]
    })

    res.status(200).json({message: 'Name and Office has been updated'})
  } catch (error) {
    console.log(`Error updating Name and Office: ${error}`);
      res.status(500).json({ message: "Internal Error" });
  }
}

const updateTaxType = async(req, res) => {
  const { updatedTax, updatedCost, updatedValue1, updatedValue2 } = req.body
  const { id } = req.params

  try {
    const docref = db.collection('formData').doc('TaxType')

    await docref.update({
      [id]: [updatedTax, updatedCost, updatedValue1, updatedValue2]
    })

    res.status(200).json({message: 'Tax Type has been updated'})
  } catch (error) {
    console.log(`Error updating Tax Type: ${error}`);
      res.status(500).json({ message: "Internal Error" });
  }
}

const approveBUR = async(req, res) => {
  const BUR = req.params.id
  const dispName = req.user.name;
  const {payee}= req.body.data

  const dateTimeCollection = getDateTime();
  const logs = `${payee}!${BUR}!Approved By ${dispName}!${dateTimeCollection}!Approved`

  try{
    const docRef = db.collection('BURRecords').doc(BUR);
    
    const docSnapshot = await docRef.get();
    if (!docSnapshot.exists) {
      return res.status(404).json({ message: 'BUR not found' });
    }

    await docRef.update({
      approvedBy: `${dispName}|${dateTimeCollection}`,
      status: 'Approved',
    });
    await setHistoryLogs(dateTimeCollection, logs)
    res.status(200).json({message: 'BUR Approved Successfully'})
  }catch(error){
    console.log('Error Approving BUR',error)
    res.status(500).json({ success: false, error: error.message });
  }
}

const returnBURRecordTo = async(req, res) => {
  const {BUR, payee, returnTo, remarks} = req.body;
  const dispName = req.user.name;

  const dateTimeCollection = getDateTime();
  const notifMessage1 = "The Budget Utilization Request for"
  const notifMessage2 = "has been returned by"
  const dataCollection = `${dateTimeCollection}|${payee}|${dispName}`
  const returnedBy = `${dispName}|${dateTimeCollection}`
  const comment = {dispName, remarks, dateTimeCollection}
  const logs = `${payee}!${BUR}!Returned By ${dispName}!${dateTimeCollection}!Returned`
  
  try{
    await updateStatusBUR(BUR, `Returned|${returnTo}`, 'returnedBy', returnedBy)
      const listOfAcc = await getUsers(returnTo);
      await setNotification(listOfAcc, dataCollection, notifMessage1, notifMessage2, BUR)
      if(remarks) {
          await addComments(BUR, comment)
      }
      await setHistoryLogs(dateTimeCollection, logs)

      res.status(200).json({message: 'BUR has been returned'});

  }catch(error){
      console.log(`Error retrieving passed records: ${error}`);
      res.status(500).json({ message: "Internal Error" });
  }
}

module.exports = {
  getAllLogs,
  //readAdmin_records,
  addFundCluster,
  getFundCluster,
  deleteFundCluster,
  addRC,
  getRC,
  deleteRC,
  addNameAndOffice,
  getNameAndOffice,
  deleteNameAndOffice,
  addTaxType,
  getTaxType,
  deleteTax,
  approveDV,
  getNumberOfRecords,
  downloadDV,
  downloadGSIS,
  returnRecordTo,
  updateFundCluster,
  updateResCen,
  updateNameAndOffice,
  updateTaxType,
  approveBUR,
  returnBURRecordTo,
  downloadGSIS_Refund,
  downloadBUR,
  downloadMeralco
};
