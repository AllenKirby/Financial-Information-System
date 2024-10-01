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
        createdAt: dateCollection,
        status: 'ongoing',

        //open for necessary data needed
    }
    try{
        await db.collection('records').doc(dvData.DV).set(dvData);
       
        return res.status(200).json(dvData);
    }catch(error){
        console.log(`Error in saving data of payee and BIR: ${error}`)
        return res.status(500).json({ 
            success: false, 
            message: 'Error in saving data of payee and BIR', 
            error: error.message 
        });
    }

}


const getAccountCodes = async (req, res) => {
    try{
        const collectionRef = db.collection('accountCode')
        const snapshot = await collectionRef.get();
        if (snapshot.empty) {
            return res.status(200).json({accountTitle: []})
        }

        const documents = snapshot.docs.map(doc => ({
            id: doc.id,     
            ...doc.data()   
        }));
        console.log('success in fetching')
        res.status(200).json({accountTitle: documents})
    }catch(error){
        console.log('fail to fetch')
        res.status(500).json({ error: error.message });
    }
}

const retrieveDV = async(req, res) => {
    try{
        const docRef = db.collection('records')
        const dv = await docRef.get();
    
        const documents = []
    
        dv.forEach(doc => {
            documents.push({ id: doc.id, data: doc.data() });
          });
        res.status(200).json({ success: true, documents });
    }
    catch(error){
        console.error("Error retrieving documents: ", error);
        res.status(500).json({ success: false, error: error.message });
    }
    
}

module.exports = {
    createDV,
    retrieveDV,
    getAccountCodes
};
