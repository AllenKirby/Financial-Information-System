const express = require('express');

const router = express.Router()

const requireAuth = require('../middleware/requireAuth')
const refreshAuth = require('../middleware/refreshAuth')
const {login, refreshToken} = require('../controller/UserController');

router.post('/login',requireAuth, login)
router.post('/refreshToken', refreshAuth, refreshToken)

module.exports = router