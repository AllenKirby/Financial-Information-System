const {admin, db, rtdb}  = require('../firebase')

const formatDate = (rawDate) => {
    const dateObject = new Date(rawDate);
    
    if (isNaN(dateObject.getTime())) {
      return "Invalid date";
    }

    const formattedDate = dateObject.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });

    return formattedDate;
  };
const createDV = async (req, res) => {
    const {payee, TIN, address, fund, date, DV, origNumber, template, RC, NF_name, NF_office,TT_tax, TT_formula1, TT_formula2, TT_cost, accTitle, accCode,optionalAmount, amount, particular} = req.body.payee_data;
    const {birParticular} = req.body.bir_data
    const createdBy = req.user.name
    
    const DVnoKey = `DVno${fund.replace(/\s/g, '')}`
    const finalizeDVNo = await getOrigNumberOfCopies(DVnoKey, origNumber, DV, template)
    const DVKey = `${finalizeDVNo}|${fund.replace(/\s/g, '')}`

    const today = new Date()
    const dateCollection = today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit"
      });

    const timeCollection = today.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
    });

    const dateTimeCollection = `${dateCollection} ${timeCollection}`;
    const createdByDetails = `${createdBy} at ${dateTimeCollection}`

    dvData = {
        //payee data
        payee: payee, 
        TIN: TIN, 
        address: address,
        fund: fund,
        date: formatDate(date), 
        DV: finalizeDVNo,
        DVKey: DVKey, 
        RC: RC,
        NF_name: NF_name,
        NF_office: NF_office,
        TT_tax: TT_tax,
        TT_formula1: TT_formula1,
        TT_formula2: TT_formula2,
        TT_cost: TT_cost, 
        accTitle: accTitle,
        accCode: accCode,
        optionalAmount: optionalAmount, 
        amount: amount, 
        particular: particular,
        //BIR data
        birParticular: birParticular,
        //other data
        createdAt: dateTimeCollection,
        createdBy: createdByDetails,
        status: 'Drafting',
        //open for necessary data needed
    }
    try{
        await db.collection('records').doc(dvData.DVKey).set(dvData);
        document = {
            [DVKey]: dvData
        }
        return res.status(200).json(document);

    }catch(error){
        console.log(`Error in saving data of payee and BIR: ${error}`)
        return res.status(500).json({ 
            success: false, 
            message: 'Error in saving data of payee and BIR', 
            error: error.message 
        });
    }

}

const updateStatus = async (DV, dTPassed) => {
    const docref = db.collection('records').doc(DV)
    await docref.update({
        submittedBy: dTPassed,
        status: 'In Review'
    })
    const updatedDoc = await docref.get()
    return updatedDoc.data();
}

const passDocument = async (req, res) => {
    const {DV, payee} = req.body;
    const dispName = req.user.name;
    const uid = req.user.uid;
    const today = new Date()
    const dateCollection = today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit"
      });
    const timeCollection = today.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
    });
    const dataCollection = `${dateCollection}|${timeCollection}|${payee}`
    const dateTimePassed = `${dateCollection}|${timeCollection}`;
    const submittedBy = `${dispName}|${dateTimePassed }`
    const logs = `${payee}|${DV}|Submitted By ${dispName}|${dateTimePassed}`

    try {
        // const docRef = db.collection('passed_records').doc('editor');
        // const doc = await docRef.get();
        // if(doc.exists){
        //     await docRef.update(data);
        // }else{
        //     await docRef.set(data);
        // }

        const updatedDocu = await updateStatus(DV, submittedBy)
        const returnData = {
            [DV] : updatedDocu
        }
        const listOfOpAcc = await getListOfOperatorAccounts();
        await setNotification(listOfOpAcc, dataCollection, dispName, DV)
        // await setHistoryLogs(dateTimePassed, logs)

        //res.status(200).json({success: true, record: data, update: returnData});
        res.status(200).json({success: true, update: returnData});
    }catch(error){
        console.log('error creating passed records: ', error)
        res.status(500).json({success: false, message: `error creating passed records: ${error}`});
    }
}

const setNotification = async (destination_uids, dataCollection, dispName, DV) => {
    
   try{
    for (const destination_uid of destination_uids){
        const notificationRef = rtdb.ref(`users/${destination_uid}/notifications`);
        await notificationRef.push({
            input: `${dataCollection}|${dispName}|${DV}`,
            read: false,
        });
    }
   }catch(error){
    console.log('error in setNotif:', error)
   }

}

const getListOfOperatorAccounts = async () => {
    try{

        const docref = await db.collection('listOfUsers').get()

        const uids = []

        docref.forEach(doc => {
            const data = doc.data()

            if(data.role === '3' && data.uid){
                uids.push(data.uid)
            }
        })
        return uids;

        // const doc = await db.collection('listOfUsers').doc('3').get();
        // if(doc.exists){
        //     const data = doc.data();
        //     const keys = Object.keys(data)
        //     console.log('successfully getting the list of op')
        //     return keys
        // }else{
        //     console.log("No such document for op!");
        // }
    }catch(error){
        console.log(`Error in getting list of op : ${error}`)
    }
    return [];
}

const getAccountCodes = async (req, res) => {
    const documentIds = ['accountFields', 'accountFields_1', 'accountFields_2'];
    const combinedData = {};
    try{
        const accountCodesSnapshot = await db.collection('account_codes').get();
        for (const docId of documentIds){
            const docRef = db.collection('account_codes').doc(docId);
            const docSnapshot = await docRef.get();

            if (docSnapshot.exists){
                const docData = docSnapshot.data();
                Object.keys(docData).forEach(fieldKey => {
                    combinedData[fieldKey] = docData[fieldKey]
                });
            }else{
                console.log(`Document ${docId} does not exist.`);
            }
        }
        console.log('successfully retrieved');
        res.status(200).json({account_codes: combinedData})
        
    }catch(error){
        console.log('Error retrieving account fields:', error)
    }
}

// const retrieveDV = async(req, res) => {
//     try{
//         console.log('retrieveDv hit')
//         const docRef = db.collection('records')
//         const dv = await docRef.get();
    
//         const documents = {}
    
//         dv.forEach(doc => {
//             const data = doc.data();
//             documents[data.DV] = data;
//           });
//         res.status(200).json(documents);
//     }
//     catch(error){
//         console.error("Error retrieving documents: ", error);
//         res.status(500).json({ success: false, error: error.message });
//     } 
// }

const retrieveDV = async(req, res) => {
    try{
        const documents = {}

        const recordsSnapshot = await db.collection('records')
        .where('status', 'in', ['Drafting', 'Returned|4'])
        .get()
        recordsSnapshot.forEach((recordDoc) => {
            if(recordDoc.exists){
                const recordData = recordDoc.data();
                documents[recordDoc.id] = recordData
                
            }else{
                console.log('No such document for keys');
            }
        })
        res.status(200).json(documents);
    }
    catch(error){
        console.error("Error retrieving documents: ", error);
        res.status(500).json({ success: false, error: error.message });
    }
    
}

const deleteDV = async(req, res) => {
    const { id } = req.params

    try{
        await db.collection('records').doc(id).delete();
        res.status(200).json({ message: 'Document successfully deleted' })
    }
    catch(error){
        console.error("Error deleting documents: ", error);
        res.status(500).json({ success: false, error: error.message });
    }
}

const updateDV = async(req, res) => {
    const { id } = req.params
    // const {payee, TIN, address, fund, date, DV, DVKey, RC, NF_name, NF_office, TT_cost, TT_formula1, TT_formula2, TT_tax, optionalAmount,accTitle, accCode, amount, particular} = req.body.payee_data;
    const {birParticular} = req.body.bir_data
    const payeeData = req.body.payee_data

    const today = new Date()
    const dateCollection = today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit"
      });

    const timeCollection = today.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
    });

    const dateTimeCollection = `${dateCollection} ${timeCollection}`;
    const dvData = {
        ...payeeData,
        birParticular,
        updatedAt: dateTimeCollection
    }

    console.log(dvData)
    // dvData = {
    //     //payee data
    //     payee: payee, 
    //     TIN: TIN, 
    //     address: address,
    //     fund: fund,
    //     date: formatDate(date), 
    //     DV: DV,
    //     DVKey: DVKey,
    //     NF_name: NF_name,
    //     NF_office: NF_office,
    //     TT_cost: TT_cost,
    //     TT_formula1: TT_formula1,
    //     TT_formula2: TT_formula2,
    //     TT_tax: TT_tax,
    //     optionalAmount: optionalAmount,
    //     RC: RC, 
    //     accTitle: accTitle,
    //     accCode: accCode, 
    //     amount: amount, 
    //     particular: particular,
    //     //BIR data
    //     birParticular: birParticular,
    //     //other data
    //     updatedAt: dateTimeCollection
    // }
    try {
        const docref = db.collection('records').doc(id)
        await docref.update(dvData)
        const updatedDoc = await docref.get()
        if(updatedDoc.exists){
            const doc = updatedDoc.data()
            document = {
                [doc.DVKey] : doc
            }
        }

        res.status(200).json(document)
    } catch (error) {
        console.error("Error updating document: ", error);
        res.status(500).json({ success: false, error: error.message });
    }
}

const setHistoryLogs = async(DT, logs) => {
    try {
        const docref = db.collection('passed_records').doc('History_Logs')
        docref.set({
            [DT]: logs
        }, {merge: true})

        const historyLogs = await docref.get()
        return historyLogs.data();

    }catch(error){
        console.error("Error History Logs: ", error);
        res.status(500).json({ success: false, error: error.message });
    }
}

const getFormData = async (req, res) => {
    try{
        const docRef = db.collection('formData')
        const snapshot = await docRef.get()

        if (snapshot.empty) {
            res.status(404).json({ success: false, message: 'No form data found.' });
            return;
        }

        const formData = {};
            snapshot.forEach(doc => {
            formData[doc.id] = doc.data();
        });

        res.status(200).json({ success: true, form: formData });
    }catch(error){
        console.log(`Error fetching form data ${error}`)
        res.status(500).json({ success: false, error: error.message });
    }
}

const getPermission = async(req, res) => {
    try {
        const docref = await db.collection('Roles').doc('Preparer').get()
        if(docref.exists){
            const data = docref.data()
            res.status(200).json({data: data})
        }
    }catch(error){
        console.log(`Error retrieving Preparer Permision ${error}`)
        res.status(500).json({ success: false, error: error.message });
    }
}

const getNumberOfCopies = async (req, res) => {

    try{
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const docRef = db.collection('NumberOfRecords').doc(year.toString());
        if (month === 1 && day === 1) {
            const data = {
                DVno501CARP: '0000',
                DVno501COB: '0000',
                DVno501LFP: '0000',
                DVnoContractFarming: '0000',
            }
            await docRef.set(data);
            return res.status(200).json({data: data})
        }else{
            const doc = await docRef.get()
            if(doc.exists){
                const data = doc.data()
                res.status(200).json({data: data})
            }
        }
        
    }catch(error){
        console.log(`Error on getNumberOfCopies(editor controller) ${error}`)
        res.status(500).json({ success: false, error: error.message });
    }
}

const getOrigNumberOfCopies = async(dvno, givenNo, DV, template) => {
    try{
        const today = new Date();
        const year = today.getFullYear();
        const docRef = db.collection('NumberOfRecords').doc(year.toString());
        return await db.runTransaction(async(transaction) => {
            const doc = await transaction.get(docRef);
            if (!doc.exists) {
                throw new Error('Document does not exist!');
            }

            const data = doc.data();
            const currentNoOfCopies = data[dvno] || givenNo

            let incrementedByOne;
            if (currentNoOfCopies === givenNo) {
                incrementedByOne = (parseInt(givenNo, 10) + 1).toString().padStart(4, '0');
            } else {
                incrementedByOne = (parseInt(currentNoOfCopies, 10) + 1).toString().padStart(4, '0');
            }

            transaction.update(docRef, {
                [dvno]: incrementedByOne
            });

            return `${template}${incrementedByOne}`;
        })
        
    }catch(error){
        console.log(`Error on get_ORIG_NumberOfCopies(editor controller) ${error}`)
        return 0
    }
}

module.exports = {
    createDV,
    retrieveDV,
    getAccountCodes,
    deleteDV, 
    passDocument,
    updateDV,
    getFormData,
    getPermission,
    getNumberOfCopies
};
