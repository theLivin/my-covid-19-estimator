/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */

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
app.use(morgan(':method\t:url\t:status\t:response-time', { stream: accessLogStream }));

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
  res.status(200);
  const lines = logs.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    if (currentLine !== '') {
      // Get response time and ceil it
      const lastTabIndex = currentLine.lastIndexOf('\t');
      const lastCharIndex = currentLine.length - 1;
      const resTimeStr = currentLine.substring(lastTabIndex + 1, lastCharIndex);
      const resTimeInt = Math.ceil(parseFloat(resTimeStr));
      // Put 0 infront of resTimeInt if it is less than 10
      const resTimeFinal = (resTimeInt < 10) ? `0${resTimeInt}` : resTimeInt;

      const outputLine = `${currentLine.substring(0, lastTabIndex + 1)}${resTimeFinal}`;
      res.write(`${outputLine.toString()}ms\n`);
    }
  }
  res.end();
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
/* eslint-enable no-plusplus */
