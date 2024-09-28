const admin  = require('../firebase')

const requireAuth = async (req, res, next) => {
    let token = req.cookies.token
    if(!token){
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            
            return res.status(401).json({ success: false, message: 'Unauthorized: no token provided' });
        }
        token = authHeader.split(' ')[1];
    }
    console.log('auth')
    try{
        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log(decodedToken)
        req.user = {
            name: decodedToken.displayName,
            uid: decodedToken.uid,
            email: decodedToken.email,
            role: decodedToken.role || 0,
            token: token
          };
        console.log('authentication passed')
        console.log(req.user.role)
        // const user = await admin.auth().getUser(req.user.uid)
        next()
    }catch(error){
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid Token' });
    }


}

module.exports = requireAuth;