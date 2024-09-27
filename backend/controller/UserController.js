const login = (req, res) => {
    console.log('hit login')
    const role = req.user.role;
    res.status(200).json({ success: true, role: role });
};

module.exports = login;