const express = require('express');
const multer = require('multer');
const SuperAdminRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const setRole = require('../middleware/Role');
const { getAllAccounts, 
        disableAccount, 
        createAccount, 
        deleteAcc, 
        retrieveRoles,
        changeAccess,
        deleteRequest,
        exportDATA,
        importDATA_func } = require('../controller/SuperAdminController')

SuperAdminRouter.use(setRole([0]))

SuperAdminRouter.get('/getAllAccounts', getAllAccounts)
SuperAdminRouter.patch('/disableAcc/:id', disableAccount)
SuperAdminRouter.post('/create', createAccount)
SuperAdminRouter.delete('/deleteAcc/:id', deleteAcc)
SuperAdminRouter.get('/roles', retrieveRoles)
SuperAdminRouter.patch('/changePermission/:id', changeAccess)
SuperAdminRouter.delete('/deleteRequest/:id', deleteRequest)
SuperAdminRouter.get('/export', exportDATA)
SuperAdminRouter.post('/import', upload.single('file'), importDATA_func)

module.exports = SuperAdminRouter;