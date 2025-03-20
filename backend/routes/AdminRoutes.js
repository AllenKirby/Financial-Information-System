const express = require('express');

const adminRouter = express.Router()

const setRole = require('../middleware/Role')

const {getAllLogs, 
       //readAdmin_records, 
       addFundCluster, 
       getFundCluster, 
       deleteFundCluster, 
       addRC, 
       getRC, 
       deleteRC, 
       addNameAndOffice, 
       getNameAndOffice, 
       deleteNameAndOffice,
       addTaxType,
       getTaxType,
       deleteTax,
       approveDV,
       getNumberOfRecords,
       downloadDV,
       downloadGSIS,
       returnRecordTo,
       updateFundCluster,
       updateResCen,
       updateNameAndOffice,
       updateTaxType,
       approveBUR,
       returnBURRecordTo,
       downloadGSIS_Refund,
       downloadBUR
        } = require('../controller/AdminController');

adminRouter.use(setRole([1]))
adminRouter.post('/downloadGSIS', downloadGSIS)
adminRouter.post('/downloadDV', downloadDV)
adminRouter.post('/downloadBUR', downloadBUR)
adminRouter.post('/downloadGSISRefund', downloadGSIS_Refund)
adminRouter.get('/getAllDV', getAllLogs)
//adminRouter.get('/approvedDV', readAdmin_records)
adminRouter.patch('/approveDocu/:id', approveDV)
adminRouter.patch('/approveBUR/:id', approveBUR)
adminRouter.post('/returnRecords', returnRecordTo)
adminRouter.post('/returnBURRecords', returnBURRecordTo)

//FUND CLUSTER
adminRouter.post('/addNewFundCluster', addFundCluster)
adminRouter.get('/getFundCluster', getFundCluster)
adminRouter.delete('/deleteFundCluster/:field_key', deleteFundCluster)
//RESPONSIBILITY CENTER
adminRouter.post('/addRC', addRC)
adminRouter.get('/getRC', getRC)
adminRouter.delete('/deleteRC/:field_key', deleteRC)
//NAME AND OFFICE
adminRouter.post('/addNameAndOffice', addNameAndOffice)
adminRouter.get('/getNameAndOffice', getNameAndOffice)
adminRouter.delete('/deleteNameAndOffice/:field_key', deleteNameAndOffice)
//TAX TYPE
adminRouter.post('/addTaxType', addTaxType)
adminRouter.get('/getTaxType', getTaxType)
adminRouter.delete('/deleteTax/:field_key', deleteTax)
adminRouter.patch('/updateFundCluster/:id', updateFundCluster)
adminRouter.patch('/updateResCen/:id', updateResCen)
adminRouter.patch('/updateNameOffice/:id', updateNameAndOffice)
adminRouter.patch('/updateTaxType/:id', updateTaxType)
//DASHBOARD (NUMBER OF RECORDS)


module.exports = adminRouter;