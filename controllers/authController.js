const jwt = require('jsonwebtoken');
const util = require('util');
const AppError = require('../utils/appError');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
    passwordConfirm: req.body.passwordConfirm,
    deliveryAddress: req.body.deliveryAddress,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000),
    httpOnly: true,
  });

  newUser.password = '';

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new AppError('Please provide an email and a password', 400));

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(user.password, password))) return next(new AppError('Incorrect email or password!', 401));

  await user
    .populate({
      path: 'favorites',
      model: 'Restaurant',
      select: 'name imageCover _id location',
    })
    .execPopulate();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: user,
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) return next(new AppError('You are not logged in ', 401));

  const decodedPayload = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(decodedPayload.id);

  if (!user) return next(new AppError('The user no longer exists', 401));

  req.user = user;
  next();
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: 'success' });
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.comparePassword(user.password, req.body.passwordCurrent))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: user,
    },
  });
});

exports.restrictToAdmin = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to perform this action', 403));
  }
  next();
});
