const AppError = require('../utils/appError');
const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};

  if (req.params.restId) filter = { restaurant: req.params.restId };

  const reviews = await Review.find(filter);

  res.status(201).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.restaurant) req.body.restaurant = req.params.restId;
  if (!req.body.user) req.body.user = req.user._id;

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: newReview,
    },
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);

  if (!review) {
    return next(new AppError('The requested review does not exist', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!review) {
    return next(new AppError('The requested review does not exist', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: review,
    },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('The requested review does not exist', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: review,
    },
  });
});
