const {admin, db, rtdb}  = require('../firebase')

const readHead_records = async(req, res) => {
    try {
        const documents = {};
       
        const recordsSnapshot = await db.collection('records')
            .where('status', '==', 'Under Review')
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
        res.status(200).json(documents);
    } catch (error) {
        console.log(`Error retrieving passed records: ${error}`);
        res.status(404).json({ message: "Not Found" });
    }
    
}

module.exports = { readHead_records}