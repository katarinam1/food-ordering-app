const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mealRouter = require('./routes/mealRoutes');
const restaurantRouter = require('./routes/restaurantRoutes');
const cartRouter = require('./routes/cartRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const orderRouter = require('./routes/orderRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(
  express.json({
    // stripe needs the raw body, we compute it but only when hitting the Stripe callback URL.
    verify: function (req, res, buf) {
      const url = req.originalUrl;
      if (url.includes('webhook')) {
        req.rawBody = buf.toString();
      }
    },
  })
);

app.use(cookieParser());

//serve static files
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/meals', mealRouter);
app.use('/api/v1/restaurants', restaurantRouter);
app.use('/api/v1/carts', cartRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
