const {admin, db}  = require('../firebase')

const createDV = async (req, res) => {
    const {payee, TIN, date, DV, RC, accTitle, amount, particular, bir2percent, bir3percent, subAmount, amountDue } = req.body.payee_data;
    const {birRC, birParticular, birSubAmount, birAmountDue} = req.body.bir_data
    
    dvData = {
        //payee data
        payee: payee, 
        TIN: TIN, 
        date: date, 
        DV: DV, 
        RC: RC, 
        accTitle: accTitle, 
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
        birAmountDue: birAmountDue,
        //other data
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: 'ongoing',
        //open for necessary data needed
    }
    const today = new Date()
    const dateCollection = today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit"
      });

    try{
        await db.collection('records').doc(dvData.status).collection(dateCollection).doc(dvData.DV).set(dvData);
       
        return res.status(200).json({ 
            success: true, 
            message: `The DV:${dvData.DV} is successfully created.` 
          });
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

module.exports = {createDV, getAccountCodes};