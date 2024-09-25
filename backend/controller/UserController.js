
const admin  = require('../firebase')

const tokenVerifier = async (req, res) => {
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
    return res.status(200).json({success: true, message: 'Access granted to protected route', user: req.user});


  }catch(error){
    return res.status(401).json({success: false, message: "Unathorized: Invalid Token"});
  }
}

module.exports = {
  tokenVerifier
};
