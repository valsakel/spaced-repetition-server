'use strict';

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  q: { type: String, required: true },
  a: { type: String, required: true }
});

questionSchema.index({ q: 1, a: 1 }, { unique: true });

module.exports = mongoose.model('Question', questionSchema);