const admin  = require('../firebase')

const requireAuth = async (req, res, next) => {
    
    console.log(req.body)

    // const authHeader = req.headers.authorization;
    // if(!authHeader || !authHeader.startsWith('Bearer ')){
    //     return res.status(401).json({success: false, message: "Unauthorized: no token provided"})
    // }; 
    
    // const token = authHeader.split(' ')[1];
    // try{
    //     const decodedToken = await admin.auth().verifyIdToken(token);
    //     console.log(decodedToken)
    //     return res.status(200).json({success: true, message: 'Access granted to protected route', user: req.user, role: decodedToken.role});

    // }catch(error){
    //     return res.status(401).json({success: false, message: "Unathorized: Invalid Token"});
    // }
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
        res.status(200).json({success: true, role: req.user.role})
        next()
    }catch(error){
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid Token' });
    }


}

module.exports = requireAuth;