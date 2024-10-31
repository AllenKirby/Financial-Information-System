const {admin, db, rtdb}  = require('../firebase')

// const readHead_records = async(req, res) => {
//     const {flag} = req.body
//     let status = []

//     console.log('flag', flag)

//     if(flag){
//         status = ['Approved', 'Under Review']
//     }
//     else {
//         status = ['Under Review']
//     }

//     try {
//         const documents = {};
       
//         const recordsSnapshot = await db.collection('records')
//             .where('status', 'in', status)
//             .get();
        
//         recordsSnapshot.forEach((recordDoc) => {
//             if(recordDoc.exists){
//                 const recordData = recordDoc.data();
//                 documents[recordDoc.id] = {
//                     data: recordData,
//                 }
                
//             }else{
//                 console.log(`No such document for keys`);
//             }
        
//         })
//         res.status(200).json(documents);
//     } catch (error) {
//         console.log(`Error retrieving passed records: ${error}`);
//         res.status(404).json({ message: "Not Found" });
//     }
    
// }

const returnRecordTo = async(req, res) => {
    const {DV, payee, returnTo} = req.body;
    const dispName = req.user.name;
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
        const updatedDocu = await updateStatus(DV, returnedBy, returnTo)
        const returnData = {
            [DV] : updatedDocu
        }
        const listOfEditorAcc = await getListOfAccount(returnTo);
        await setNotification(listOfEditorAcc, dataCollection, dispName, DV)
        // await setHistoryLogs(dateTimePassed, logs)

        res.status(200).json({success: true, update: returnData});

    }catch(error){
        console.log(`Error retrieving passed records: ${error}`);
        res.status(500).json({ message: "Internal Error" });
    }
}

const updateStatus = async (DV, dTPassed, returnToRole) => {
    try{
        const returnType = `Returned|${returnToRole}`
        const docref = db.collection('records').doc(DV)
        await docref.update({
            returnedBy: dTPassed,
            status: returnType
        })
        const updatedDoc = await docref.get()
        return updatedDoc.data();
    }catch(error){
        console.log("error in updating", error)
    }
}

const updateStatusToApproved = async(DV, DTpass) => {
    try {
        const docref = db.collection('records').doc(DV)
        await docref.update({
            reviewedBy: DTpass,
            status: 'For Approval'
        })
        const updatedDoc = await docref.get()
        return updatedDoc.data();
    } catch (error) {
        console.log("error in updating", error)
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

const getListOfAccount = async (listNumber) => {
    try{

        const docref = await db.collection('listOfUsers').get()

        const uids = []

        docref.forEach(doc => {
            const data = doc.data()

            if(data.role === listNumber && data.uid){
                uids.push(data.uid)
            }
        })
        return uids;

        // const doc = await db.collection('listOfUsers').doc(listNumber).get();
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
    const reviewedBy = `${dispName}|${dateTimePassed}`
    // const logs = `${payee}|${DV}|Reviewed By ${dispName}|${dateTimePassed}`

    try {
        const updatedDocu = await updateStatusToApproved(DV, reviewedBy)
        const returnData = {
            [DV] : updatedDocu
        }
        const listOfOpAcc = await getListOfAccount('1');
        await setNotification(listOfOpAcc, dataCollection, dispName, DV)
        // await setHistoryLogs(dateTimePassed, logs)

        //res.status(200).json({success: true, record: data, update: returnData});
        res.status(200).json({success: true, update: returnData});
    }catch(error){
        console.log('error creating passed records: ', error)
        res.status(500).json({success: false, message: `error creating passed records: ${error}`});
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

const getPermission = async(req, res) => {
    try {
        const docref = await db.collection('Roles').doc('Budget Officer').get()
        if(docref.exists){
            const data = docref.data()
            res.status(200).json({data: data})
        }
    }catch(error){
        console.log(`Error retrieving Preparer Permision ${error}`)
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = { 
    //readHead_records, 
    returnRecordTo, 
    transferDocument,
    getPermission
}