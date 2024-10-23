const express = require('express');

const editorRouter = express.Router();

const setRole = require('../middleware/Role');

const {
    createDV, 
    retrieveDV ,
    getAccountCodes, 
    deleteDV, 
    passDocument,
    updateDV,
    getFormData,
    getPermission,
    getNumberOfCopies
} = require('../controller/EditorController');


editorRouter.use(setRole([4]))

editorRouter.post('/createDV', createDV)
editorRouter.post('/passRecord', passDocument)
editorRouter.get('/getAccountCode', getAccountCodes)
editorRouter.get('/getDV', retrieveDV)
editorRouter.delete('/deleteDV/:id', deleteDV)
editorRouter.patch('/updateDV/:id', updateDV)
editorRouter.get('/getFormData', getFormData)
editorRouter.get('/getPermission', getPermission)

editorRouter.get('/getNumberOfCopies', getNumberOfCopies)


module.exports = editorRouter;