const {admin, db, rtdb}  = require('../firebase')
const { google } = require('googleapis');
const sheets = google.sheets('v4');

const readPassed_records = async (req, res) => {
    const {flag} = req.body
    let status = []

    if(flag){
        status = ['Drafting', 'In Review', 'Returned|4', 'Returned|3']
    }
    else {
        status = ['In Review', 'Returned|3']
    }
    
    try {
        const documents = {};
       
        const recordsSnapshot = await db.collection('records')
            .where('status', 'in', status)
            .get();
        
        recordsSnapshot.forEach((recordDoc) => {
            if(recordDoc.exists){
                const recordData = recordDoc.data();
                documents[recordDoc.id] = {
                    data: recordData,
                }
                
            }else{
                console.log(`No such document for keys`);
            }
        
        })
        console.log(documents)
        return res.status(200).json({success: true, documents});
    } catch (error) {
        console.log(`Error retrieving passed records: ${error}`);
        return res.status(404).json({ message: "Not Found" });
    }
    
}

const operatorInput = async(req, res) => {
    const { ors, asa } = req.body
    const { id } = req.params

    dvData = {
        ORSBURS: ors,
        ASA: asa
    }
    document = {} 

    try {
        const docref = db.collection('records').doc(id)
        await docref.update(dvData)
        const updatedDoc = await docref.get()
        if(updatedDoc.exists){
            const doc = updatedDoc.data()
            document[doc.DVKey] = {
                data : doc
            }
        }

        res.status(200).json(document)
    } catch (error) {
        console.error("Error updating document: operator: ", error);
        res.status(500).json({ success: false, error: error.message });
    }
}

const opReturnDocu = async (req, res) => {
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
    const returnedBy = `${dispName}|${dateTimePassed}`
    // const logs = `${payee}|${DV}|Returned By ${dispName}|${dateTimePassed}`

    try{
        const updatedDocu = await updateStatus(DV, returnedBy, true)
        const returnData = {
            [DV] : updatedDocu
        }
        const listOfEditorAcc = await getListOfEditorAccounts();
        await setNotification(listOfEditorAcc, dataCollection, dispName, DV)
        // await setHistoryLogs(dateTimePassed, logs)

        res.status(200).json({success: true, update: returnData});
    }catch(error){
        console.log('error returning records to editor: ', error)
        res.status(500).json({success: false, message: `error creating passed records: ${error}`});
    }
}

// const updateStatus = async (DV, dTPassed, flag) => {
//     const docref = db.collection('records').doc(DV)
//     await docref.update({
//         dateTimePassed: dTPassed,
//         status: flag ? 'Returned' : 'Under Review'
//     })
//     const updatedDoc = await docref.get()
//     return updatedDoc.data();
// }

const updateStatus = async (DV, dTPassed, flag) => {
    const docref = db.collection('records').doc(DV);

    const updateData = flag ? 
        { returnedBy: dTPassed, status: 'Returned|4' } : 
        { updatedBy: dTPassed, status: 'Under Review' };

    await docref.update(updateData);

    const updatedDoc = await docref.get();
    return updatedDoc.data();
};


const getListOfEditorAccounts = async () => {
    try{

        const docref = await db.collection('listOfUsers').get()

        const uids = []

        docref.forEach(doc => {
            const data = doc.data()

            if(data.role === '4' && data.uid){
                uids.push(data.uid)
            }
        })
        return uids;

        // const doc = await db.collection('listOfUsers').doc('4').get();
        // if(doc.exists){
        //     const data = doc.data();
        //     const keys = Object.keys(data)
        //     console.log('successfully getting the list of editor', keys)
        //     return keys
        // }else{
        //     console.log("No such document for editor!");
        // }
    }catch(error){
        console.log(`Error in getting list of editor : ${error}`)
    }
    return [];
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

 const transferDocument = async (req, res) => {
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
    const updatedBy = `${dispName}|${dateTimePassed}`
    // const logs = `${payee}|${DV}|Updated By ${dispName}|${dateTimePassed}`

    try {
        const updatedDocu = await updateStatus(DV, updatedBy, false)
        const returnData = {
            [DV] : updatedDocu
        }
        const listOfOpAcc = await getListOfHeadAccounts();
        await setNotification(listOfOpAcc, dataCollection, dispName, DV)
        // await setHistoryLogs(dateTimePassed, logs)

        //res.status(200).json({success: true, record: data, update: returnData});
        res.status(200).json({success: true, update: returnData});
    }catch(error){
        console.log('error creating passed records: ', error)
        res.status(500).json({success: false, message: `error creating passed records: ${error}`});
    }
}

const getListOfHeadAccounts = async () => {
    try{

        const docref = await db.collection('listOfUsers').get()

        const uids = []

        docref.forEach(doc => {
            const data = doc.data()

            if(data.role === '2' && data.uid){
                uids.push(data.uid)
            }
        })
        return uids;

        // const doc = await db.collection('listOfUsers').doc('2').get();
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


const getPermission = async(req, res) => {
    try {
        const docref = await db.collection('Roles').doc('Funding').get()
        if(docref.exists){
            const data = docref.data()
            res.status(200).json({data: data})
        }
    }catch(error){
        console.log(`Error retrieving Preparer Permision ${error}`)
        res.status(500).json({ success: false, error: error.message });
    }
}

const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  
const appendDataToSheet = async (req, res) => {
    const  values  = req.body
    const spreadsheetId = process.env.SPREADSHEETID
    const client = await auth.getClient();

    console.log(values)
    console.log(spreadsheetId)
    
    // Append values to the next available row
    const request = {
      spreadsheetId, // Google Sheets ID
      range: 'A1:Z', // The sheet/tab name where data will be appended
      valueInputOption: 'RAW', // You can also use 'USER_ENTERED' to auto-format data
      insertDataOption: 'INSERT_ROWS', // Automatically finds the next available row
      resource: {
        values, // This is a 2D array representing rows and columns (e.g. [[row1data], [row2data]])
      },
      auth: client,
    };
  
    try {
        console.log('hit')
        const response = await sheets.spreadsheets.values.append(request);
        res.status(200).send({message: 'Data appended successfully', data: response.data.updates});
    } catch (err) {
        console.error('Error appending data:', err);
    }
  };

module.exports = {
    readPassed_records, 
    operatorInput, 
    opReturnDocu, 
    transferDocument,
    getPermission,
    appendDataToSheet
}