const express = require('express');

const adminRouter = express.Router()

const setRole = require('../middleware/Role')
const {createAccount, uploadJSOn} = require('../controller/AdminController');

adminRouter.use(setRole([1]))

adminRouter.post('/create', createAccount)
// adminRouter.post('/create', uploadJSOn)

module.exports = adminRouter;