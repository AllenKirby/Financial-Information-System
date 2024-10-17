const express = require('express');

const adminRouter = express.Router()

const setRole = require('../middleware/Role')
const {createAccount, getAllLogs, readAdmin_records, getAllAccounts, addFundCluster} = require('../controller/AdminController');

adminRouter.use(setRole([1]))

adminRouter.post('/create', createAccount)
adminRouter.get('/getAllDV', getAllLogs)
adminRouter.get('/approvedDV', readAdmin_records)
adminRouter.get('/getAllAccounts', getAllAccounts)
adminRouter.post('/addNewFundCluster', addFundCluster)
// adminRouter.post('/create', uploadJSOn)

module.exports = adminRouter;