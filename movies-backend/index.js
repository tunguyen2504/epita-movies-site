const express = require('express')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const morgan = require('morgan')
const cors = require('cors')
const errorHandler = require('./middlewares/errorHandler');
const snakecaseResponse = require('./middlewares/snakecaseResponse');
const camelcaseRequest = require('./middlewares/camelcaseRequest');

require('dotenv').config()
require('./models')

const app = express()
const authRouter = require('./routes/authRoute')
const userRouter = require('./routes/userRoute')
const movieRouter = require('./routes/movieRoute')
const roleRouter = require('./routes/roleRoute')
const ratingRouter = require('./routes/ratingRoute')

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressValidator())
app.use(errorHandler)
app.use(camelcaseRequest)
app.use(snakecaseResponse())

const api = '/api'
app.use(api, authRouter)
app.use(api, userRouter)
app.use(api, movieRouter)
app.use(api, roleRouter)
app.use(api, ratingRouter)

const mongoConnection = require('./middlewares/mongodb-connector')
mongoConnection.connect()
// const sqlConnection = require('./middlewares/mysql-connector')
const { PORT } = process.env;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})