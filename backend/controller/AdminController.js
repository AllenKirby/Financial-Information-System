const admin  = require('../firebase')

const createAccount = async (req, res) => {
    const {uid, role} = req.body;
    try{
      await admin.auth().setCustomUserClaims(uid, { role });

      return res.status(200).json({ 
        success: true, 
        message: `User created successfully with role ${role}`});
    }
    catch(error){
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