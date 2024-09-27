const express = require('express');

const adminRouter = express.Router()

const setRole = require('../middleware/Role')
const {createAccount} = require('../controller/AdminController');

adminRouter.use(setRole([1]))

adminRouter.post('/create', createAccount)

module.exports = adminRouter;