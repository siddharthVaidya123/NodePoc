const moongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userModel = moongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
  },
  email: {
    type: String,
    unique: [true, 'Email must be unique'],
    requried: [true, 'Email is required'],
    lowercase: true,
    validate: [validator.isEmail, 'Please enter valid email'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    // this only works on CREATE and SAVE not on update
    validate: {
      validator: function (el) {
        return el == this.password;
      },
      message: 'Passwords are not the same!',
    },
    required: [true, 'Please confirm password'],
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  PasswordResetExpires: Date
});

userModel.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userModel.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userModel.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.PasswordResetExpires = Date.now() + 10 * 60 * 1000; 
  console.log({ resetToken }, this.passwordResetToken)
  return resetToken;
}

userModel.methods.changedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000);
    return jwtTimestamp < changedTimestamp;
  }
  // false means password not changed
  return false;
};
const User = moongoose.model('User', userModel);
module.exports = User;
