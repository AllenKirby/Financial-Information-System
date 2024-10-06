
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
  const userData = {
    email: decodedToken.email,
    name: req.body.name,
    uid: decodedToken.uid,
    role : req.body.role,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  }

  console.log(`role in createaccount ${userData.role}`)
  console.log('creating acc')

  try{
     await admin.auth().setCustomUserClaims(userData.uid, { role });
      console.log(`account created with role ${role}`)

     await db.collection('users').doc(userData.uid).set(userData); 

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

module.exports = {

  createAccount
};
