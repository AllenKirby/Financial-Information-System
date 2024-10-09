const express = require('express');

const OperatorRouter = express.Router();

const setRole = require('../middleware/Role');

const {readPassed_records, operatorInput, opReturnDocu} = require('../controller/OperatorController');

OperatorRouter.use(setRole([3]))

OperatorRouter.get('/read_records', readPassed_records);
OperatorRouter.patch('/update_records/:id', operatorInput)
OperatorRouter.post('/return_record', opReturnDocu)

module.exports = OperatorRouter