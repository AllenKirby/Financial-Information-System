const {admin, db}  = require('../../config/firebase')
require('dotenv').config();
const axios = require('axios');

const getForecastedValues = async(req, res) => {
    try{
      const awsAPI_URL = process.env.AWS_API_URL
      const data = {
        steps: 12
      }
      const response = await axios.post(`${awsAPI_URL}/forecast`, data);
      res.status(200).json(response.data)
    }catch(error){
      console.log('error getting forecasted values', error)
      res.status(500)
    }
  }

module.exports = {
    getForecastedValues
}