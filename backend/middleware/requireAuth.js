const admin  = require('../firebase')

const requireAuth = async (req, res, next) => {
    
    console.log(req.body)

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized: no token provided' });
    }
    const token = authHeader.split(' ')[1];
    try{
        
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            role: decodedToken.role || 0
          };
        console.log(req.user)
        next()
    }catch(error){
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid Token' });
    }


}

module.exports = requireAuth;