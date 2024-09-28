const login = (req, res) => {

    try{
        console.log('hit login')
        const role = req.user.role
        const token = req.user.token;
        res.cookie('token', token, {
            httpOnly: true,  
            secure: true,  
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'Strict' 
        });
        console.log(`role ${role}`)
        res.status(200).json({ success: true, role: role});
    }catch(error){
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
};

module.exports = login;