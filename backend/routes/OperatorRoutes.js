const express = require('express');

const OperatorRouter = express.Router();

const setRole = require('../middleware/Role');

const {readPassed_records} = require('../controller/OperatorController');

OperatorRouter.use(setRole([3]))

OperatorRouter.get('/read_records', readPassed_records);

module.exports = OperatorRouter