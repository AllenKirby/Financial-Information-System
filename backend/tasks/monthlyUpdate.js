const {db} = require('../config/firebase')
const cron = require('node-cron')

const updateControlBook = () => {
    cron.schedule('0 0 1 * *', async () => {
        try{
            const colRef = await db.collection('ControlBook').get();
            if(colRef.empty){
                return;
            }

            for(const doc of colRef.docs) {
                const data = doc.data();
                const prevMonthFO_value = data.prevMonthFO || 0
                const prevMonthRO_value = data.prevMonthRO || 0
                const thisMonthFO_value = data.thisMonthFO || 0
                const thisMonthRO_value = data.thisMonthRO || 0

                try {
                    await doc.ref.update({
                        prevMonthFO: prevMonthFO_value + thisMonthFO_value,
                        prevMonthRO: prevMonthRO_value + thisMonthRO_value,
                        thisMonthFO: 0,
                        thisMonthRO: 0
                    })
                    console.log("succesfully updated ", doc.id)
                }catch (error){
                    console.log('Error on ', doc.id, error)
                }

            }
        }catch(err){
            console.log('error getting control book', err)
        }
    })
    
}


module.exports = {updateControlBook}