const express = require('express');

const OperatorRouter = express.Router();

const setRole = require('../middleware/Role');

const {
    //readPassed_records,
    operatorInput, 
    opReturnDocu, 
    transferDocument,
    getPermission,
    appendDataToSheet,
    addControlBook,
    addNewFieldOffice
} = require('../controller/OperatorController');

OperatorRouter.use(setRole([3]))

//OperatorRouter.get('/read_records', readPassed_records);
OperatorRouter.patch('/update_records/:id', operatorInput)
OperatorRouter.post('/return_record', opReturnDocu)
OperatorRouter.post('/transferDocu', transferDocument)
OperatorRouter.get('/getPermission', getPermission)
OperatorRouter.post('/appendDataToSheet', appendDataToSheet)
OperatorRouter.post('/addControlBook', addControlBook)
OperatorRouter.post('/addFieldOffice/:id', addNewFieldOffice)

module.exports = OperatorRouter