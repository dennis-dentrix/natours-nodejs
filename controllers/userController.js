const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  let newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // password should not be part of the data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Use the route /updateme',
        401
      )
    );
  }

  // update the user password
  const filtredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filtredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'sucess',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async(req, res, next) => {
   await User.findByIdAndUpdate(req.user.id, {active: false});

  res.status(204).json({
    status: "success", 
    data: null
  })
})

exports.getUser = (req, res) => {
  return res.status(500).json({
    staus: 'error',
    message: 'This route is not yet correctly implemented',
  });
};

exports.createUser = (req, res) => {
  return res.status(500).json({
    staus: 'error',
    message: 'This route is not yet correctly implemented',
  });
};

exports.updateUser = (req, res) => {
  return res.status(500).json({
    staus: 'error',
    message: 'This route is not yet correctly implemented',
  });
};

exports.deleteUser = (req, res) => {
  return res.status(500).json({
    staus: 'error',
    message: 'This route is not yet correctly implemented',
  });
};
