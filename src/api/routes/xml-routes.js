/* eslint-disable no-unused-vars */

const express = require('express');
const convert = require('xml-js');

const estimator = require('../../estimator');

const router = express.Router();

// handle base route
router.post('/', (req, res, next) => {
  const estimations = estimator(req.body);
  const options = { compact: true, ignoreComment: true, spaces: 4 };
  const result = convert.json2xml(JSON.stringify(estimations), options);
  res.status(200).send(result);
});

module.exports = router;

/* eslint-enable no-unused-vars */
