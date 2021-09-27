const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const Meal = require('./../models/mealModel');

const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError('Not an image! Please upload an image.', 400), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadMealPhoto = upload.single('photo');

exports.resizeMealPhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `meal-${Date.now()}.jpeg`;

  sharp(req.file.buffer).toFormat('jpeg').jpeg({ quality: 60 }).toFile(`../01-starting-project/public/meals/${req.file.filename}`);

  next();
};

exports.getAllMeals = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.restId) {
    filter = { restaurant: req.params.restId };
  }
  req.query.sort = 'name';

  const features = new APIFeatures(Meal.find(filter), req.query).filter().sort().limitFields().paginate();

  const meals = await features.query;

  res.status(201).json({
    status: 'success',
    results: meals.length,
    data: {
      meals,
    },
  });
});

exports.createMeal = catchAsync(async (req, res, next) => {
  if (!req.body.restaurant) {
    req.body.restaurant = req.params.restId;
  }

  if (req.file) req.body.image = req.file.filename;

  const newMeal = await Meal.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: newMeal,
    },
  });
});

exports.deleteMeal = catchAsync(async (req, res, next) => {
  const rest = await Meal.findByIdAndDelete(req.params.id);

  if (!rest) {
    return next(new AppError('The requested meal does not exist', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.updateMeal = catchAsync(async (req, res, next) => {
  if (req.file) req.body.image = req.file.filename;

  const meal = await Meal.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!meal) {
    return next(new AppError('The requested meal does not exist', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: meal,
    },
  });
});

exports.getMeal = catchAsync(async (req, res, next) => {
  const meal = await Meal.findById(req.params.id);

  if (!meal) {
    return next(new AppError('The requested meal does not exist', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: meal,
    },
  });
});
