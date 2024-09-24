require('dotenv').config()

const express = require('express')
const cors = require('cors')
const UserRoutes = require('./routes/UserRoutes')

const app = express()

app.use(cors())

app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
   next() 
})

app.use('/api/user', UserRoutes)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
