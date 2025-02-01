const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowerCase: true,
    validate: [validator.isEmail, 'Please provide a valide email'],
  },
  password: {
    type: String,
    required: [true, 'Auser must have a password'],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm the password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match',
    },
  },
  passwordChangedAt: Date,
  photo: String,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// INSTANCE MWTHOD TO CHECK IF PASSWORD PROVIDED DURING LOGIN IS CORRECT
userSchema.methods.correctPassword = async function (
  canditadatePSWD,
  userPSWD
) {
  return await bcrypt.compare(canditadatePSWD, userPSWD);
};

userSchema.methods.changedPasswordAt = function (JWTtimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;

    // console.log(changedTimestamp, JWTtimestamp);
    
    return JWTtimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
