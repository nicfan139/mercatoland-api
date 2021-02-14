const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
mongoose.connect(`mongodb+srv://${process.env.MONGODB_ATLAS_USERNAME}:${process.env.MONGODB_ATLAS_PW}@cluster0.x1ofl.mongodb.net/mercatoland-api?retryWrites=true&w=majority`,  { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
});

/**
 * Middlewares
*/
// Log incoming http requests
app.use(morgan('dev'));
// Read incoming url encoded data
app.use(bodyParser.urlencoded({ extended: false }));
// Extract JSON from request body
app.use(bodyParser.json());

/**
 * Enable CORS
*/
app.use((req, res, next) => {
  const origin = app.get('env') === 'development' ? '*' : process.env.MERCATOLAND_PROD_URL;
  res.header('Access-Control-Allow-Origin', origin);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization' 
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'PATCH', 'DELETE');
    return res.status(200).json({});
  };
  next();
});

/**
 * Routes
*/
const userRoutes = require('./api/routes/users');
const productRoutes = require('./api/routes/products');
const cartRoutes = require('./api/routes/carts');
const receiptRoutes = require('./api/routes/receipts');

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/carts', cartRoutes);
app.use('/receipts', receiptRoutes);

/**
 * Handle 404 errors
*/
app.use((req, res, next) => {
  const error = new Error('Endpoint not found');
  error.status = 404;
  next(error);
});

/**
 * Handle 500 errors
*/
app.use((error, req, res, next) => {
  const status = error.status || 500;
  res.status(status);
  res.json({
    status,
    error: {
      message: error.message
    }
  });
});

module.exports = app;