'use strict';

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const User = require('../models/user');

const router = express.Router();

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));


/* ========== POST/UPDATE AN ANSWER ========== */
router.post('/', (req, res, next) => {

  //TODO: see if there is a better solution
  // we need to send answer and head value so we could use that data
  // in the response body
  // {
  //   "answer": "hi",
  //   "head": 2
  // }

  const userAnswer = req.body.answer.trim();

  User.findById(req.user.id)
    .then(user => {

      const currQuestion = user.questions[user.head];
      const currIndex = user.head;

      if (userAnswer === currQuestion.answer) {
        currQuestion.mValue = (currQuestion.mValue * 2);
      } else {
        currQuestion.mValue = 1;
      }

      let count = currQuestion.mValue;

      let currObj = user.questions[currIndex];

      while(count && currObj.next !== null) {
        currObj = user.questions[currObj.next];
        count--;
      }
      user.head = currQuestion.next;
      currQuestion.next = currObj.next;
      currObj.next = currIndex;

      return user.save();
    })
    .then(user => {
      if ( user.questions[req.body.head].answer === req.body.answer.trim() ) {
        res.json({
          answer: 'correct'
        });
      }
      res.json({
        answer: 'incorrect'
      });
    })
    .catch(next);
});

module.exports = router;