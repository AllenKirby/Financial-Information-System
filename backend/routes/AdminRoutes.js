const express = require('express');

const adminRouter = express.Router()

const setRole = require('../middleware/Role')

const {getAllLogs, readAdmin_records, addFundCluster} = require('../controller/AdminController');

adminRouter.use(setRole([1]))

adminRouter.get('/getAllDV', getAllLogs)
adminRouter.get('/approvedDV', readAdmin_records)
adminRouter.post('/addNewFundCluster', addFundCluster)

module.exports = adminRouter;