const login = (req, res) => {
    try{
        
        const role = req.user.role
        const token = req.user.token;
        const name = req.user.name
        res.cookie('token', token, {
            httpOnly: true,  
            secure: true,  
            sameSite: 'Strict' 
        });
        console.log(`role ${role}`)
        res.status(200).json({ success: true, role: role});
    }catch(error){
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
};

module.exports = login;