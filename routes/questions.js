'use strict';

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const User = require('../models/user');

const router = express.Router();

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));


/* ========== GET A QUESTION ========== */
router.get('/', (req, res, next) => {

  User.findById(req.user.id)
    .then(user => {
      const question = user.questions[user.head].question;
      console.log('RESULTS', user.questions[0]);
      res.json(question)
    })
    .catch(next);
});

module.exports = router;
