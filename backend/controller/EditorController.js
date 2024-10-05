const {admin, db}  = require('../firebase')


const createDV = async (req, res) => {
    const {payee, TIN, address, fund, date, DV, RC, accTitle, accCode, amount, particular, bir2percent, bir3percent, subAmount, amountDue } = req.body.payee_data;
    const {birRC, birParticular, birSubAmount} = req.body.bir_data
    
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

    dvData = {
        //payee data
        payee: payee, 
        TIN: TIN, 
        address: address,
        fund: fund,
        date: date, 
        DV: DV, 
        RC: RC, 
        accTitle: accTitle,
        accCode: accCode, 
        amount: amount, 
        particular: particular,
        bir2percent: bir2percent, 
        bir3percent: bir3percent, 
        subAmount: subAmount,
        amountDue: amountDue,
        //BIR data
        birRC: birRC, 
        birParticular: birParticular,
        birSubAmount: birSubAmount,
        //other data
        createdAt: dateTimeCollection,
        status: 'drafting',
        //open for necessary data needed
    }
    try{
        await db.collection('records').doc(dvData.DV).set(dvData);
        document = {
            [DV]: dvData
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

const updateStatus = async (DV) => {
    const docref = db.collection('records').doc(DV)
    await docref.update({
        status: 'In Review'
    })
    const updatedDoc = docref.get()
    return updatedDoc;
}

const passDocument = async (req, res) => {
    const {DV, payee} = req.body;
    console.log('passing docu', DV)
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

    const dataCollection = `${dateCollection}|${timeCollection}|${payee}`;

    const data = {
         [DV] : dataCollection,
    }
    try {
        const docRef = db.collection('passed_records').doc('editor');
        const doc = await docRef.get();
        if(doc.exists){
            await docRef.update(data);
        }else{
            await docRef.set(data);
        }

        const updatedDocu = updateStatus(DV)
        console.log(`updated docu: ${updatedDocu}`)

        res.status(200).json({success: true, record: data, update: updatedDocu});
    }catch(error){
        console.log('error creating passed records: ', error)
        res.status(500).json({success: false, message: `error creating passed records: ${error}`});
    }
}


// const getAccountCodes = async (req, res) => {
//     try{
//         console.log('getAccountCOdes hit')
//         const collectionRef = db.collection('accountCode')
//         const snapshot = await collectionRef.get();
//         if (snapshot.empty) {
//             return res.status(200).json({accountTitle: []})
//         }

//         const documents = snapshot.docs.map(doc => ({
//             id: doc.id,     
//             ...doc.data()   
//         }));
//         console.log('success in fetching')
//         res.status(200).json({accountTitle: documents})
//     }catch(error){
//         console.log('fail to fetch')
//         res.status(500).json({ error: error.message });
//     }
// }

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

const retrieveDV = async(req, res) => {
    try{
        console.log('retrieveDv hit')
        const docRef = db.collection('records')
        const dv = await docRef.get();
    
        const documents = {}
    
        dv.forEach(doc => {
            const data = doc.data();
            documents[data.DV] = data;
          });
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

module.exports = {
    createDV,
    retrieveDV,
    getAccountCodes,
    deleteDV, 
    passDocument,
};
