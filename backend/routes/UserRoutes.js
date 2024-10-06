const express = require('express');

const router = express.Router()

const requireAuth = require('../middleware/requireAuth')
const login = require('../controller/UserController');

router.post('/login',requireAuth, login)
//login
//return fname, lname, role
//httponly(token)

module.exports = router