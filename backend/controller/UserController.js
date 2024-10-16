const {admin}  = require('../firebase')
const login = (req, res) => {
    try{
        
        const role = req.user.role
        const token = req.user.token;
        const name = req.user.name;
        const uid = req.user.uid;
        if(!role){
            admin.auth().deleteUser(uid)
            .then(() => {
                console.log(`Deleting user with UID: ${uid}. reason: no role`);
                return
            })
            .catch((error) => {
                console.error(`Error deleting user: ${error}`);
            });
        }

        res.cookie('token', token, {
            httpOnly: true,  
            secure: true,  
            sameSite: 'Strict' 
        });
        console.log(`role ${name}`)
        res.status(200).json({ success: true, role: role, name: name, uid: uid});
    }catch(error){
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
};

const refreshToken = (req, res) => {
    try{
        const refreshTime = new Date().toISOString(); //for check time only
        const role = req.user.role
        const token = req.user.token;
        const name = req.user.name;
        const uid = req.user.uid;
        res.cookie('token', token, {
            httpOnly: true,  
            secure: true,  
            sameSite: 'Strict' 
        });
        console.log(`refersh token ${name} at ${refreshTime}`)
        res.status(200).json({ success: true, role: role, name: name, uid: uid});
    }catch(error){
        res.status(500).json({ success: false, message: 'refresh token failed', error: error.message });
    }
}

module.exports = {login, refreshToken};