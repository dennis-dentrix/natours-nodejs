const express = require('express');
const morgan = require('morgan');

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController")
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// get the static files i
app.use(express.static(`${__dirname}/public`));

// MIDDELWARES
// console.log(process.env.NODE_ENV)

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(typeof req.headers )
  next();
});

// ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

app.all("*", (req, res, next) => {

  next(new AppError(`Can't find the requested url ${req.originalUrl}`, 404))
})

app.use(globalErrorHandler)

module.exports = app;
