
const admin  = require('../firebase')

const createAccount = async (req, res) => {


  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      
      return res.status(406).json({ success: false, message: 'Unauthorized: no token provided' });
  }
  const token = authHeader.split(' ')[1];

  const decodedToken = await admin.auth().verifyIdToken(token);
  const {role} = req.body
  const uid = decodedToken.uid
  console.log(`role in createaccount ${role}`)
  console.log('creating acc')

  try{
     await admin.auth().setCustomUserClaims(uid, { role });

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

module.exports = {

  createAccount
};
