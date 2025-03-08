const express = require('express');
const HeadRouter = express.Router();
const setRole = require('../middleware/Role');
const { //readHead_records, 
        returnRecordTo, 
        transferDocument, 
        getPermission ,
        addCertified,
        returnBURTo,
        submitToApprover
} = require('../controller/HeadController')

HeadRouter.use(setRole([2]))

//HeadRouter.get('/read_records', readHead_records)
HeadRouter.post('/return_record', returnRecordTo)
HeadRouter.post('/passToAdmin', transferDocument)
HeadRouter.get('/getPermission', getPermission)
HeadRouter.patch('/addCertified/:id', addCertified)
HeadRouter.post('/returnBUR', returnBURTo)
HeadRouter.post('/passBURToAdmin', submitToApprover)


module.exports = HeadRouter;