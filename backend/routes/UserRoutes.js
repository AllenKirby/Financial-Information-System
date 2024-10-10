const express = require('express');

const router = express.Router()

const requireAuth = require('../middleware/requireAuth')
const {login, refreshToken} = require('../controller/UserController');

router.post('/login',requireAuth, login)
router.post('/refreshToken', requireAuth, refreshToken)
//login
//return fname, lname, role
//httponly(token)

module.exports = router