const express = require('express');
const mealController = require('../controllers/mealController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(mealController.getAllMeals)
  .post(
    authController.protect,
    authController.restrictToAdmin,
    mealController.uploadMealPhoto,
    mealController.resizeMealPhoto,
    mealController.createMeal
  );

router
  .route('/:id')
  .get(mealController.getMeal)
  .patch(
    authController.protect,
    authController.restrictToAdmin,
    mealController.uploadMealPhoto,
    mealController.resizeMealPhoto,
    mealController.updateMeal
  )
  .delete(
    authController.protect,
    authController.restrictToAdmin,
    mealController.deleteMeal
  );

module.exports = router;
