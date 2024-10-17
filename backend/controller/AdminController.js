
const {admin, db}  = require('../firebase')
const fs = require('fs');

const getAllLogs = async(req, res) => {
  try{
    const docRef = db.collection('passed_records').doc('History_Logs')
    const data = await docRef.get();

    const arrLogs = []

    if(data.exists){
      const logs = data.data()

      for(const key in logs){
        arrLogs.push(logs[key])
      } 
      console.log(arrLogs)
      res.status(200).json(arrLogs);
    }
    else{
      console.log('No History Logs Founds')
    }  
  }
  catch(error){
    console.error("Error retrieving documents: ", error);
    res.status(500).json({ success: false, error: error.message });
  } 
}

// const uploadJSOn = async () => {
//   try {
//     const data = JSON.parse(fs.readFileSync('C:/Users/Administrator/Downloads/assests1.json', 'utf8'));
//     const docRef = db.collection('account_codes').doc('accountFields_1');
//     const transformedData = {};
//     Object.keys(data).forEach(key => {
//         const concatenatedValue = `${data[key].col.join(':')}:${data[key].account_title}`;

//         transformedData[key] = concatenatedValue;
//     });
//     await docRef.set(transformedData);

//     console.log('Data written successfully as a single document with multiple fields.');
// } catch (error) {
//     console.error(`Failed to write data: ${error}`);
// }
// }

const readAdmin_records = async(req, res) => {
  try {
      const documents = {};
     
      const recordsSnapshot = await db.collection('records')
          .where('status', '==', 'Approved')
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

const addFundCluster = async (req, res) => {
  const newFundCluster = req.body.cluster
  console.log('hit add fund')
  const randomKey = Math.random().toString(36).substring(2, 15);

  const clusterData = {
    [randomKey] : newFundCluster
  }

  try{
    console.log('hit try')
    const docRef = db.collection('formData').doc('fundCluster');
    const doc = await docRef.get()
    if(doc.exists){
      await docRef.update(clusterData)
    }else{
      await docRef.set(clusterData)
    }
    console.log('successfully adding new fundcluster')
    return res.status(200).json({success: true, message: `Successfully added ${newFundCluster}`});

  }catch(error){
    console.log('error adding new fundcluster')
    return res.status(500).json({ 
      success: false, 
      message: 'Error creating user', 
      error: error.message 
    });
  }
}

module.exports = {
  getAllLogs,
  readAdmin_records,
  addFundCluster
};
