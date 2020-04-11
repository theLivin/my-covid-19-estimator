/* eslint-disable no-unused-vars */

const express = require('express');
const estimator = require('../../estimator');

const router = express.Router();

// handle base route
router.post('/', (req, res, next) => {
  const result = estimator(req.body);
  res.header('Content-Type', 'application/json');
  res.status(200).json(result);
});

module.exports = router;

/* eslint-enable no-unused-vars */
