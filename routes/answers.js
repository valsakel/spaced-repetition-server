'use strict';

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const User = require('../models/user');

const router = express.Router();

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));


/* ========== POST/UPDATE AN ANSWER ========== */
router.post('/', (req, res, next) => {
  console.log(req.body);

  const userAnswer = req.body.answer.trim();
  console.log('USER ANSWER', userAnswer);

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
      console.log('CURR OBJ BEFORE', currObj);

      while(count && currObj.next !== null) {
        currObj = user.questions[currObj.next];
        console.log('CURRENT OBJ AFTER', currObj);
        count--;
      }
      user.head = currQuestion.next;
      console.log('USER HEAD', user.head);
      currQuestion.next = currObj.next;
      console.log('CURR Q NEXT', currQuestion.next);
      currObj.next = currIndex;
      console.log('CURR OBJ', currObj);

      return User.findByIdAndUpdate({_id: req.user.id}, {head: user.head, questions: user.questions}, { new: true })
    })
    .then(user => {
      res.json(user)
    })
    .catch(next);
});

module.exports = router;