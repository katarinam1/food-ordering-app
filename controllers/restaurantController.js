const mongoose = require('mongoose');
const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const Restaurant = require('./../models/restaurantModel');
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

exports.uploadRestaurantPhoto = upload.single('photo');

exports.resizeRestaurantPhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `rest-${Date.now()}.jpeg`;

  sharp(req.file.buffer).toFormat('jpeg').jpeg({ quality: 50 }).toFile(`client/public/restaurants/${req.file.filename}`);

  next();
};

exports.getAllRestaurants = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Restaurant.find(), req.query).filter().sort().limitFields().paginate();

  const generateTotalRestaurantsCount = new APIFeatures(Restaurant.find(), req.query).filter();

  const totalRestaurantsCount = await generateTotalRestaurantsCount.query;

  const restaurantsPaginated = await features.query;

  res.status(201).json({
    status: 'success',
    results: totalRestaurantsCount.length,
    data: {
      data: restaurantsPaginated,
    },
  });
});

exports.createRestaurant = catchAsync(async (req, res, next) => {
  req.body.location = JSON.parse(req.body.location);

  req.body.workingHours = req.body.workingHours.map((el) => JSON.parse(el));

  if (req.file) req.body.imageCover = req.file.filename;

  const newRest = await Restaurant.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: newRest,
    },
  });
});

exports.deleteRestaurant = catchAsync(async (req, res, next) => {
  const rest = await Restaurant.findByIdAndDelete(req.params.id);

  if (!rest) {
    return next(new AppError('The requested restaurant does not exist', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.updateRestaurant = catchAsync(async (req, res, next) => {
  if (req.body.location) req.body.location = JSON.parse(req.body.location);

  req.body.workingHours = req.body.workingHours.map((el) => JSON.parse(el));

  if (req.file) req.body.imageCover = req.file.filename;
  const rest = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!rest) {
    return next(new AppError('The requested restaurant does not exist', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: rest,
    },
  });
});

exports.getRestaurant = catchAsync(async (req, res, next) => {
  const rest = await Restaurant.findById(req.params.id);

  if (!rest) {
    return next(new AppError('The requested restaurant does not exist', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: rest,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng } = req.params;
  const [lat, lng] = latlng.split(',');

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;

  if (!lat || !lng) {
    next(new AppError('Please provide latitude and longitude i the format lat, lng', 400));
  }

  const totalDistancesAggregation = [
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        maxDistance: 5000,
        distanceMultiplier: 0.001,
      },
    },
  ];

  if (req.query.tags)
    totalDistancesAggregation.push({
      $match: {
        tags: req.query.tags,
      },
    });

  const totalDistancesCount = await Restaurant.aggregate(totalDistancesAggregation);

  const distanceAggregation = [
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        maxDistance: 5000,
        distanceMultiplier: 0.001,
      },
    },
    {
      $set: {
        deliveryTimeFrom: {
          $add: [
            '$prepTime',
            {
              $cond: {
                if: {
                  $lt: ['$distance', 1],
                },
                then: 5,
                else: {
                  $cond: [
                    {
                      $and: [{ $gte: ['$distance', 1] }, { $lt: ['$distance', 2] }],
                    },
                    10,
                    {
                      $cond: [
                        {
                          $and: [{ $gte: ['$distance', 2] }, { $lt: ['$distance', 3] }],
                        },
                        15,
                        {
                          $cond: [
                            {
                              $and: [{ $gte: ['$distance', 3] }, { $lt: ['$distance', 4] }],
                            },
                            20,
                            25,
                          ],
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
    {
      $set: {
        deliveryTimeTo: {
          $add: ['$deliveryTimeFrom', 10],
        },
      },
    },
    { $sort: { distance: 1 } },
  ];

  if (req.query.tags)
    distanceAggregation.push({
      $match: {
        tags: req.query.tags,
      },
    });

  distanceAggregation.push({ $skip: skip });
  distanceAggregation.push({ $limit: limit });

  const distances = await Restaurant.aggregate(distanceAggregation);

  const distancesIDs = distances.map((dist) => dist._id);

  const features = new APIFeatures(
    Restaurant.find({
      _id: { $in: distancesIDs },
    }),
    req.query
  ).filter();

  const restaurants = await features.query;

  const distancesFiltered = distances
    .map((dist) => {
      restaurants.forEach((rest) => {
        if (rest._id.equals(dist._id)) dist.workingTimeToday = rest.workingTimeToday;
      });
      if (dist.workingTimeToday) return dist;
      return null;
    })
    .filter((dist) => dist !== null);

  res.status(200).json({
    status: 'success',
    results: totalDistancesCount.length,
    data: {
      data: distancesFiltered,
    },
  });
});

exports.getDistance = catchAsync(async (req, res, next) => {
  const { latlng } = req.params;
  const { id } = req.params;
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    next(new AppError('Please provide latitude and longitude if the format lat, lng', 400));
  }
  const aggregation = [
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        maxDistance: 5000,
        distanceMultiplier: 0.001, //to km
        query: { _id: new mongoose.Types.ObjectId(id) },
      },
    },
    {
      $set: {
        deliveryTimeFrom: {
          $add: [
            '$prepTime',
            {
              $cond: {
                if: {
                  $lte: ['$distance', 1],
                },
                then: 5,
                else: {
                  $cond: [
                    {
                      $and: [{ $gte: ['$distance', 1] }, { $lt: ['$distance', 2] }],
                    },
                    10,
                    {
                      $cond: [
                        {
                          $and: [{ $gte: ['$distance', 2] }, { $lt: ['$distance', 3] }],
                        },
                        15,
                        {
                          $cond: [
                            {
                              $and: [{ $gte: ['$distance', 3] }, { $lt: ['$distance', 4] }],
                            },
                            20,
                            25,
                          ],
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
    {
      $set: {
        deliveryTimeTo: {
          $add: ['$deliveryTimeFrom', 10],
        },
      },
    },
  ];

  const [distance] = await Restaurant.aggregate(aggregation);

  const rest = await Restaurant.findById(id);
  distance.workingTimeToday = rest.workingTimeToday;

  res.status(200).json({
    status: 'success',
    data: {
      data: distance,
    },
  });
});
