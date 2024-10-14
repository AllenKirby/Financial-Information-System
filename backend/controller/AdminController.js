
const {admin, db}  = require('../firebase')
const fs = require('fs');

const createAccount = async (req, res) => {


  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      
      return res.status(406).json({ success: false, message: 'Unauthorized: no token provided' });
  }
  const token = authHeader.split(' ')[1];

  const decodedToken = await admin.auth().verifyIdToken(token);
  const role = req.body.role;
  const dispName = req.body.name
  
  const email = decodedToken.email
  const uid = decodedToken.uid


  const userData = {
    [uid] : `${email}|${dispName}`
  }

  console.log(`role in createaccount ${role}`)
  console.log('creating acc')

  try{
     await admin.auth().setCustomUserClaims(uid, { role, dispName });
      console.log(`account created with role ${role}`)

     const docRef = db.collection('listOfUsers').doc(role);
     const doc = await docRef.get();
     if(doc.exists){
      await docRef.update(userData);
     }else{
      await docRef.set(userData);
     }

     return res.status(200).json({ 
      success: true, 
      message: `User created successfully with role ${role}` 
      
    });
  }catch(error){
    console.error('Error creating new user:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error creating user', 
      error: error.message 
    });
  }
}

const retrieveAllDV = async(req, res) => {
  try{
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

module.exports = {
  retrieveAllDV,
  createAccount,
  readAdmin_records
};
