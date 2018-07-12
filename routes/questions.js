'use strict';

const express = require('express');
const passport = require('passport');

const User = require('../models/user');

const router = express.Router();

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

router.get('/', (req, res, next) => {
  User.find({})
    .then(results => {
      res.json(results);
    })
    .catch(next);
})

/* ========== GET A QUESTION ========== */
router.get('/next', (req, res, next) => {
  const userId = req.user.id;
  User.findById(userId)
    .then(user => {
      res.json(user.questions[user.head]);
    })
    .catch(next);
});

module.exports = router;
