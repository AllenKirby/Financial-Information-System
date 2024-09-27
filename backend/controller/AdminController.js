
const admin  = require('../firebase')

const createAccount = async (req, res) => {
  const {email, password, role} = req.body;
  try{
    const user = await admin.auth().createUser({
      email,
      password
    });
     await admin.auth().setCustomUserClaims(user.uid, { role });

     return res.status(200).json({ 
      success: true, 
      message: `User ${email} created successfully with role ${role}` 
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
