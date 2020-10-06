const express = require('express')
const path = require('path');
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const morgan = require('morgan')
const cors = require('cors')
const errorHandler = require('./middlewares/errorHandler');
const snakecaseResponse = require('./middlewares/snakecaseResponse');
const camelcaseRequest = require('./middlewares/camelcaseRequest');
const exphbs = require('express-handlebars');
const moment = require('moment');
const cookieParser = require('cookie-parser');

require('dotenv').config()
require('./models')

const app = express()
const authRouter = require('./routes/authRoute')
const userRouter = require('./routes/userRoute')
const movieRouter = require('./routes/movieRoute')
const roleRouter = require('./routes/roleRoute')
const ratingRouter = require('./routes/ratingRoute')
const seenMovieRouter = require('./routes/seenMovieRoute')
const homeRouter = require('./routes/web/homeRoute');
const webAuthRouter = require('./routes/web/authRoute');

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressValidator())
app.use(errorHandler)
app.use(camelcaseRequest)
app.use(snakecaseResponse())
app.use(cookieParser());

const api = '/api'
app.use(api, authRouter)
app.use(api, userRouter)
app.use(api, movieRouter)
app.use(api, roleRouter)
app.use(api, ratingRouter)
app.use(api, seenMovieRouter)

app.engine('.hbs', exphbs({
	extname: '.hbs',
	defaultLayout: 'main',
	helpers: {
		formatDateFromNow: function (date, format) {
			return moment(date).fromNow();
		},
		formatDateToYear: function (date, format) {
			return moment(date).year();
		},
		formatDateToDDMMYYYY: function (date, format) {
			return moment(date).format("DD - MMM - yyyy")
		}
	}
}));
app.set('view engine', '.hbs');
app.use('/', homeRouter);
app.use('/', webAuthRouter);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));

const mongoConnection = require('./middlewares/mongodb-connector')
mongoConnection.connect()
const { PORT } = process.env;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})