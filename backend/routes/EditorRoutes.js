const express = require('express');

const editorRouter = express.Router();

const setRole = require('../middleware/Role');
const createDV = require('../controller/EditorController');

editorRouter.use(setRole([4]))

editorRouter.post('/createDV', createDV)

module.exports = editorRouter;