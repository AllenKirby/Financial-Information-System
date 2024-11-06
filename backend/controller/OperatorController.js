const {admin, db, rtdb}  = require('../firebase')
const { google } = require('googleapis');
const sheets = google.sheets('v4');

const { 
    addComments,
    setNotification,
    setHistoryLogs } = require('./Functions')

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
    const {DV, payee, remarks} = req.body;
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
    const notifMessage1 = "The Disbursement Voucher for"
    const notifMessage2 = "has been returned by"
    const dataCollection = `${dateCollection}|${timeCollection}|${payee}|${dispName}`
    const dateTimePassed = `${dateCollection}|${timeCollection}`;
    const returnedBy = `${dispName}|${dateTimePassed}`
    const comment = {dispName, remarks, dateTimePassed}
    // const logs = `${payee}|${DV}|Returned By ${dispName}|${dateTimePassed}`

    try{
        const updatedDocu = await updateStatus(DV, returnedBy, true)
        const returnData = {
            [DV] : updatedDocu
        }
        const listOfEditorAcc = await getListOfEditorAccounts();
        await setNotification(listOfEditorAcc, dataCollection, notifMessage1, notifMessage2, DV)
        await addComments(DV, comment)
        // await setHistoryLogs(dateTimePassed, logs)

        res.status(200).json({success: true, update: returnData});
    }catch(error){
        console.log('error returning records to editor: ', error)
        res.status(500).json({success: false, message: `error creating passed records: ${error}`});
    }
}

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

    }catch(error){
        console.log(`Error in getting list of editor : ${error}`)
    }
    return [];
}

 const transferDocument = async (req, res) => {
    const {DV, payee, remarks} = req.body;
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
    const notifMessage1 = "The Disbursement Voucher for"
    const notifMessage2 = "has been passed by"
    const dataCollection = `${dateCollection}|${timeCollection}|${payee}|${dispName}`
    const dateTimePassed = `${dateCollection}|${timeCollection}`;
    const updatedBy = `${dispName}|${dateTimePassed}`
    const comment = {dispName, remarks, dateTimePassed}
    // const logs = `${payee}|${DV}|Updated By ${dispName}|${dateTimePassed}`

    try {
        const updatedDocu = await updateStatus(DV, updatedBy, false)
        const returnData = {
            [DV] : updatedDocu
        }
        const listOfHeadAcc = await getListOfHeadAccounts();
        await setNotification(listOfHeadAcc, dataCollection, notifMessage1, notifMessage2, DV)
        await addComments(DV, comment)
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

    }catch(error){
        console.log(`Error in getting list of op : ${error}`)
    }
    return [];
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
    credentials: {
        type: process.env.FIREBASE_TYPE,
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI,
        toker_uri: process.env.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL ,
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
        universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
    },
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
    operatorInput, 
    opReturnDocu, 
    transferDocument,
    getPermission,
    appendDataToSheet
}