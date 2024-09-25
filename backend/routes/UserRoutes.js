const express = require('express')

const router = express.Router()
const {
    loginUser,
    signupUser,
    tokenVerifier
} = require('../controller/UserController')

router.post('/login', loginUser)
router.post('/signup', signupUser)
router.post('/protected', tokenVerifier)

module.exports = router