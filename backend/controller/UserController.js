const login = (req, res) => {

    try{
        const role = req.user.role;
        const token = req.headers.authorization.split(' ')[1];
        console.log(`before ${token}`)
        res.cookie('token', token, {
            httpOnly: true,  
            secure: true,  
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'Strict' 
        });
        console.log('done')
        res.status(200).json({ success: true, role: role, token: token });
    }catch(error){
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
};

module.exports = login;