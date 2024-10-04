const {admin, db}  = require('../firebase')

const readPassed_records = async (req, res) => {
    try {
        const docRef = db.collection('passed_records').doc('editor');
        const dvRecords = await docRef.get();
    
        const documents = [];
    
        if (dvRecords.exists) {
            const data = dvRecords.data();
            console.log('Document data:', data);
            const keys = Object.keys(data);
    
            for (const key of keys) {
                const value = data[key];
                const recordDocRef = db.collection('records').doc(key);
                const recordsDoc = await recordDocRef.get();
    
                if (recordsDoc.exists) {
                    const recordData = recordsDoc.data();
                    documents.push({
                        key: key,
                        timePassed: value,
                        data: recordData
                    })
    
                    console.log(`Successfully retrieved data from document ${key}:`);
                } else {
                    console.log(`No such document for key ${key}`);
                }
            }
    
            return res.status(200).json({success: true, documents});
    
        } else {
            console.log('No such document!');
            return res.status(404).json({ message: "Document not found" });
        }
    } catch (error) {
        console.log(`Error retrieving passed records: ${error}`);
        return res.status(404).json({ message: "Not Found" });
    }
    
}

module.exports = {readPassed_records}