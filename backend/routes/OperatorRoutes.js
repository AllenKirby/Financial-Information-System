const express = require('express');

const OperatorRouter = express.Router();

const setRole = require('../middleware/Role');

const {
    opReturnDocu, 
    transferDocument,
    getPermission,
    appendDataToSheet,
    addControlBook,
    addNewFieldOffice,
    updateControlBook,
    deleteControlBook,
    updateFieldOffice,
    deleteFieldOffice,
    updateASA_ORS,
    getBUR,
    updateASAORS,
    addTab,
    handleCash,
    changeStatus,
    add_imo_balance,
    addNewUtility
} = require('../controller/OperatorController');

OperatorRouter.use(setRole([3]))
OperatorRouter.post('/return_record', opReturnDocu)
OperatorRouter.post('/transferDocu', transferDocument)
OperatorRouter.get('/getPermission', getPermission)
OperatorRouter.post('/appendDataToSheet', appendDataToSheet)
OperatorRouter.post('/addControlBook', addControlBook)
OperatorRouter.post('/addFieldOffice/:id', addNewFieldOffice)
OperatorRouter.patch('/updateControlBook/:id', updateControlBook)
OperatorRouter.delete('/deleteControlBook/:id', deleteControlBook)
OperatorRouter.patch('/updateFieldOffice/:id', updateFieldOffice)
OperatorRouter.delete('/deleteFieldOffice/:id', deleteFieldOffice)
// OperatorRouter.patch('/updateASA_ORS/:id', updateASA_ORS)
OperatorRouter.patch('/updateASA_ORS/:id', updateASAORS)
OperatorRouter.patch('/handleCash/:id', handleCash)
OperatorRouter.get('/getBUR', getBUR)
OperatorRouter.post('/addTab/:id', addTab)
OperatorRouter.patch('/change-status/:id', changeStatus)
OperatorRouter.patch('/add-imo/:id', add_imo_balance)
OperatorRouter.post('/addNewUtility/:id', addNewUtility)

module.exports = OperatorRouter