const path = require("path")
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"))
// MIDDELWARES
app.use(helmet());

const rateLimiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Try again after an hour.',
});

app.use('/api', rateLimiter);

// BODY PARSER readng data from the body into req.body
app.use(express.json({ limit: '10kb' }));

// DATA SANITIZATION AGAINST NOSQL INJECTION
app.use(mongoSanitize());

// DATA SANITIZATION AGAINST XSS
app.use(xss());

// PREVENT PARAMETER POLUTION
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// serving static files
app.use(express.static(path.join(__dirname, `public`)));

// Development debugging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(typeof req.headers )
  next();
});

// ROUTES
app.get('/', (req, res) => {
  res.status(200).render("base");
})

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find the requested url ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
