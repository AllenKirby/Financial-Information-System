const {admin, db}  = require('../firebase')

const getAllAccounts = async (req, res) => {
    try{
      const users = await listAllUsers(); // Call the function to get users
      res.status(200).json(users);
    }catch(error){
      res.status(500).json({ error: 'Failed to list users' });
    }
  }
  
  const listAllUsers = async(nextPageToken) => {
    let allUsers = []; 
  
    const fetchUsers = async (nextPageToken) => {
      try {
        const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
  
        allUsers = allUsers.concat(listUsersResult.users.map(userRecord => userRecord.toJSON()));
  
        if (listUsersResult.pageToken) {
          return fetchUsers(listUsersResult.pageToken); 
        } else {
          return allUsers; 
        }
      } catch (error) {
        console.error('Error listing users:', error);
        throw error; 
      }
    };
  
    return await fetchUsers(nextPageToken);
  }

  const disableAccount = async(req, res) => {
    const uid = req.params.id
    const {flag} = req.body

    try {
      console.log(uid, flag)
      console.log("hit disable account1")
      const user = await admin.auth().updateUser(uid, {
        disabled: flag
      })
      console.log("hit disable account2")
      res.status(200).json({message: flag ? "User successfully disabled" : "User succesfully enabled", user: user.toJSON()})
      
    } catch (error) {
      res.status(500).json({ error: 'Failed to disable Account' });
    }
  }

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

  const deleteAcc = async(req, res) => {
    const uidRole = req.params.id
    const uid = uidRole.split('|').slice()[0]
    const role = uidRole.split('|').slice()[1]
    try {
      await admin.auth().deleteUser(uid)
      await db.collection('listOfUsers').doc(role).update({
        [uid]: admin.firestore.FieldValue.delete()
      })
      res.status(200).json({message: 'Account Successfully Deleted'})
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error deleting user', 
        error: error.message 
      });
    }
  }

  module.exports = {
    getAllAccounts,
    disableAccount,
    createAccount,
    deleteAcc
  };