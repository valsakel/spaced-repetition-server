'use strict';

const express = require('express');
const mongoose = require('mongoose');
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

  User.findById(req.user.id)
    .then(user => {
      const { prompt, score, total, mValue } = user.questions[user.head];
      res.json({
        prompt,
        score,
        total,
        mValue
      });
    })
    .catch(next);
});

module.exports = router;
