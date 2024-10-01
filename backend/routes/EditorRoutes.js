const express = require('express');

const editorRouter = express.Router();

const setRole = require('../middleware/Role');
const {createDV, getAccountCodes} = require('../controller/EditorController');

editorRouter.use(setRole([4]))

editorRouter.post('/createDV', createDV)
editorRouter.get('/getAccountCode', getAccountCodes)

module.exports = editorRouter;