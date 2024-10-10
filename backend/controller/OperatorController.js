const {admin, db}  = require('../firebase')

const readPassed_records = async (req, res) => {
    try {
        const documents = {};
       
        const recordsSnapshot = await db.collection('records')
            .where('status', '==', 'In Review')
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
        return res.status(200).json({success: true, documents});

        // if (dvRecords.exists) {
        //     const data = dvRecords.data();
        //     console.log('Document data:', data);
        //     const keys = Object.keys(data);
    
        //     for (const key of keys) {
        //         const value = data[key];
        //         const recordDocRef = db.collection('records').doc(key);
        //         const recordsDoc = await recordDocRef.get();
    
        //         if (recordsDoc.exists) {
        //             const recordData = recordsDoc.data();
        //             documents[key] = {
        //                 // key: key,
        //                 // timePassed: value,
        //                 data: recordData
        //             }
    
        //             console.log(`Successfully retrieved data from document ${key}:`);
        //         } else {
        //             console.log(`No such document for key ${key}`);
        //         }
        //     }
    
        //     return res.status(200).json({success: true, documents});
    
        // } else {
        //     console.log('No such document!');
        //     return res.status(404).json({ message: "Document not found" });
        // }
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
        console.log('ors', ors)
        const docref = db.collection('records').doc(id)
        await docref.update(dvData)
        const updatedDoc = await docref.get()
        if(updatedDoc.exists){
            const doc = updatedDoc.data()
            document[doc.DV] = {
                data : doc
            }
        }

        res.status(200).json(document)
    } catch (error) {
        console.error("Error updating document: operator: ", error);
        res.status(500).json({ success: false, error: error.message });
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

    try {
        const updatedDocu = await updateStatus(DV, dateTimePassed)
        const returnData = {
            [DV] : updatedDocu
        }
        const listOfOpAcc = await getListOfHeadAccounts();
        await setNotification(listOfOpAcc, dataCollection, dispName, DV)

        //res.status(200).json({success: true, record: data, update: returnData});
        res.status(200).json({success: true, update: returnData});
    }catch(error){
        console.log('error creating passed records: ', error)
        res.status(500).json({success: false, message: `error creating passed records: ${error}`});
    }
}

const updateStatus = async (DV, dTPassed) => {
    const docref = db.collection('records').doc(DV)
    await docref.update({
        dateTimePassToHead: dTPassed,
        status: 'Under Review'
    })
    const updatedDoc = await docref.get()
    return updatedDoc.data();
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

    console.log('notif sent succesfully')
   }catch(error){
    console.log('error in setNotif:', error)
   }

}

const getListOfHeadAccounts = async () => {
    try{
        const doc = await db.collection('listOfUsers').doc('2').get();
        if(doc.exists){
            const data = doc.data();
            const keys = Object.keys(data)
            console.log('successfully getting the list of op')
            return keys
        }else{
            console.log("No such document for op!");
        }
    }catch(error){
        console.log(`Error in getting list of op : ${error}`)
    }
    return [];
}

module.exports = {readPassed_records, operatorInput, transferDocument}