const express = require('express');

const adminRouter = express.Router()

const setRole = require('../middleware/Role')
const {createAccount, retrieveAllDV, readAdmin_records} = require('../controller/AdminController');

adminRouter.use(setRole([1]))

adminRouter.post('/create', createAccount)
adminRouter.get('/getAllDV', retrieveAllDV)
adminRouter.get('/approvedDV', readAdmin_records)
// adminRouter.post('/create', uploadJSOn)

module.exports = adminRouter;