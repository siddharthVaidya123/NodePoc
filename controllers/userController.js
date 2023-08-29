const User = require('../model/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'Success',
    result: users.length,
    data: {
      users: users,
    },
  });
});

exports.createUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'invalid route',
  });
};
exports.getUserById = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'invalid route',
  });
};

getFilterBody = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.UpdateMe = async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return new AppError('Cannot update password!');
  }

  const filterBody = getFilterBody(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });
  res.status(500).json({
    status: 'Success',
    data: {
      user: updatedUser,
    },
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'invalid route',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'invalid route',
  });
};
