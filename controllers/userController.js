const catchAsync = require('./../utils/catchAsync');
const User = require("./../models/userModel")
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find()

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

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
