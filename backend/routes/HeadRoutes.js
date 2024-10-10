const express = require('express');
const HeadRouter = express.Router();
const setRole = require('../middleware/Role');
const { readHead_records } = require('../controller/HeadController')

HeadRouter.use(setRole([2]))

HeadRouter.get('/read_records', readHead_records)

module.exports = HeadRouter;