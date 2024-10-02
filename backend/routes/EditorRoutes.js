const express = require('express');

const editorRouter = express.Router();

const setRole = require('../middleware/Role');

const {createDV, retrieveDV ,getAccountCodes, deleteDV } = require('../controller/EditorController');


editorRouter.use(setRole([4]))

editorRouter.post('/createDV', createDV)
editorRouter.get('/getAccountCode', getAccountCodes)
editorRouter.get('/getDV', retrieveDV)
editorRouter.delete('/deleteDV/:id', deleteDV)


module.exports = editorRouter;