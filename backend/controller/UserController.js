const {admin, db}  = require('../config/firebase')
const login = async(req, res) => {
    try{
        
        const role = req.user.role
        const token = req.user.token;
        const name = req.user.name;
        const uid = req.user.uid;
        const email = req.user.email
        if(!role){
            return res.status(403).json({success: false, message: "Unauthorized: No role assigned."})
        }

        const docref = db.collection('listOfUsers').doc(uid)
        const user = await docref.get()

        res.cookie('token', token, {
            httpOnly: true,  
            secure: true,  
            sameSite: 'None' 
        });
        res.status(200).json({ success: true, role: role, name: name, uid: uid, uemail: email, firstTimeLogin: user.data().firstTimeLogin});
    }catch(error){
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
};

const refreshToken = async(req, res) => {
    try{
        const refreshTime = new Date().toISOString(); //for check time only
        const role = req.user.role
        const token = req.user.token;
        const name = req.user.name;
        const uid = req.user.uid;
        const email = req.user.email

        const docref = db.collection('listOfUsers').doc(uid)
        const user = await docref.get()

        res.cookie('token', token, {
            httpOnly: true,  
            secure: true,  
            sameSite: 'None' 
        });
        res.status(200).json({ success: true, role: role, name: name, uid: uid, uemail: email, firstTimeLogin: user.data().firstTimeLogin});
    }catch(error){
        res.status(500).json({ success: false, message: 'refresh token failed', error: error.message });
    }
}

const changePass = async(req, res) => {
    try{
        const role = req.user.role
        const name = req.user.name;
        const uid = req.user.uid;
        const email = req.user.email
        if(!role){
            return res.status(403).json({success: false, message: "Unauthorized: No role assigned."})
        }

        const docref = db.collection('listOfUsers').doc(uid)
        await docref.update({
            firstTimeLogin: false
        })

        const updatedUser = await docref.get() 

        res.status(200).json({ success: true, role: role, name: name, uid: uid, uemail: email, firstTimeLogin: updatedUser.data().firstTimeLogin});
    }catch(error){
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
}

module.exports = {
    login, 
    refreshToken,
    changePass
};