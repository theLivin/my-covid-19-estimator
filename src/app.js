/* eslint-disable no-unused-vars */

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();

const jsonRoutes = require('./api/routes/json-routes');
const xmlRoutes = require('./api/routes/xml-routes');

// create text file to log accesses
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.txt'), { flags: 'a' });

// to log requests
// app.use(morgan('dev'));
// app.use(morgan(':method\t\t:url\t\t:status\t\t:response-time ms', { stream: accessLogStream }));
app.use(morgan(':method  :url  :status  :response-time ms', { stream: accessLogStream }));

// to get body of request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes to handle requests
app.use('/api/v1/on-covid-19', jsonRoutes);
app.use('/api/v1/on-covid-19/json', jsonRoutes);
app.use('/api/v1/on-covid-19/xml', xmlRoutes);

// handle read-logs request
app.use('/api/v1/on-covid-19/logs', (req, res, next) => {
  const logs = fs.readFileSync(path.join(__dirname, 'access.txt'), 'utf-8');
  res.header('Content-Type', 'text/plain');
  res.status(200).send(logs);
});

// handle errors
app.use((req, res, next) => {
  const error = new Error('route not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;

/* eslint-enable no-unused-vars */
