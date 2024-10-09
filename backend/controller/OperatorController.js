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

module.exports = {readPassed_records, operatorInput}