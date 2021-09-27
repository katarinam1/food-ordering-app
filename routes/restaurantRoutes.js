const express = require('express');
const restaurantController = require('./../controllers/restaurantController');
const authController = require('./../controllers/authController');
const mealRouter = require('./../routes/mealRoutes');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

router.use('/:restId/meals', mealRouter);
router.use('/:restId/reviews', reviewRouter);

router.route('/:id/distance/:latlng').get(restaurantController.getDistance);

router.route('/distances/:latlng').get(restaurantController.getDistances);

router
  .route('/')
  .get(restaurantController.getAllRestaurants)
  .post(
    authController.protect,
    authController.restrictToAdmin,
    restaurantController.uploadRestaurantPhoto,
    restaurantController.resizeRestaurantPhoto,
    restaurantController.createRestaurant
  );

router
  .route('/:id')
  .get(restaurantController.getRestaurant)
  .patch(
    authController.protect,
    authController.restrictToAdmin,
    restaurantController.uploadRestaurantPhoto,
    restaurantController.resizeRestaurantPhoto,
    restaurantController.updateRestaurant
  )
  .delete(authController.protect, authController.restrictToAdmin, restaurantController.deleteRestaurant);

module.exports = router;
