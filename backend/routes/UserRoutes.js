const express = require('express');

const {createAccount} = require('../controller/UserController');

const router = express.Router()

const {requireAuth, setRole} = require('../middleware/requireAuth')


router.use(requireAuth)

router.get('/admin', setRole([1]))
router.post('/create', createAccount)

module.exports = router