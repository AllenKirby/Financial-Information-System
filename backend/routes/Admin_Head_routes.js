const express = require('express');

const admin_Head_Router = express.Router()

const setRole = require('../middleware/Role')

//import from adminHeadCOntroller
const {getForecastedValues} = require('../controller/MultiAccess/AdminHeadController')

admin_Head_Router.use(setRole([1,2]))

//create endpoint
admin_Head_Router.get('/getForecastedValues', getForecastedValues)

module.exports = admin_Head_Router;