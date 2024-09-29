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

    try{
        await db.collection('records').doc(dvData.status).collection(dvData.date).doc(dvData.DV).set(dvData);
        
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

module.exports = createDV;