'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// ===== Define UserSchema & UserModel =====
const userSchema = new mongoose.Schema({
  firstname: { type: String, default: '' },
  lastname: { type: String, default: '' },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  questions: [
    {
      prompt: { type: String, required: true },
      answer: { type: String, required: true },
      score: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
      mValue: { type: Number, default: 1 },
      next: { type: Number, default: null }
    }
  ],
  head: { type: Number, default: 0 }
}, { timestamps: true });

userSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret.questions;
    delete ret.head;
    delete ret.createdAt;
    delete ret.updatedAt;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  }
});

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('User', userSchema);
