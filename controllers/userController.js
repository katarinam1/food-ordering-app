const AppError = require('../utils/appError');
const User = require('./../models/userModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query).filter().sort().limitFields().paginate();
  const users = await features.query;

  res.status(201).json({
    status: 'success',
    results: users.length,
    data: {
      data: users,
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: newUser,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('The requested user does not exist', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateUserInfo = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  }).select('name email _id cart deliveryAddress phoneNumber photo');

  if (!user) {
    return next(new AppError('The requested user does not exist', 404));
  }
  await user
    .populate({
      path: 'favorites',
      model: 'Restaurant',
      select: 'name imageCover _id location',
    })
    .execPopulate();

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('The requested user does not exist', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  });
});

exports.updateFavorites = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new AppError('The requested user does not exist', 404));
  }

  user.updateFavorites(req.body.favorite);

  await user.save({ validateBeforeSave: false });

  await user
    .populate({
      path: 'favorites',
      model: 'Restaurant',
      select: 'name imageCover _id location',
    })
    .execPopulate();

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
