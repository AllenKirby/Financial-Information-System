const admin  = require('../firebase')

const requireAuth = async (req, res, next) => {
    
    console.log(req.body)
    console.log(`role: ${req.body.role}`)

    const authHeader = req.headers.authorization;
    console.log('Headers: ', req.headers);

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({success: false, message: "Unauthorized: no token provided"})
    }; 
    
    const token = authHeader.split(' ')[1];
    try{
        console.log('Token Received: ', token);
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        console.log('Decoded Token: ', decodedToken)
        return res.status(200).json({success: true, message: 'Access granted to protected route', user: req.user, role: req.body.role});

    }catch(error){
        return res.status(401).json({success: false, message: "Unathorized: Invalid Token"});
    }

}

const setRole = async (req) => {
    const { uid, role } = req.body;
  
    try {
      // Set custom user claims for the user with the provided UID
      const result = await admin.auth().setCustomUserClaims(uid, { role });
      console.log(result)
      
  
    } catch (error) {
      console.error('Error assigning role:', error);
      
    }
  };

module.exports = requireAuth