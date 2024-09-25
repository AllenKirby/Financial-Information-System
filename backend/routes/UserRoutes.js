const express = require('express')

const router = express.Router()

const requireAuth = require('../middleware/requireAuth')

router.use(requireAuth)

module.exports = router