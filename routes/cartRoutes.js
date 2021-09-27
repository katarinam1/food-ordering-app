const express = require('express');
const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/checkout-session/:id', authController.protect, cartController.getCheckoutSession);

router
  .route('/deleteAbandoned')
  .delete(authController.protect, authController.restrictToAdmin, cartController.deleteAbandonedCarts);

router
  .route('/deleteCompleted')
  .delete(authController.protect, authController.restrictToAdmin, cartController.deleteCompletedCarts);

router
  .route('/')
  .get(authController.protect, authController.restrictToAdmin, cartController.getAllCarts)
  .post(cartController.createCart);

router
  .route('/:id')
  .get(cartController.getCart)
  .patch(cartController.updateCart)
  .delete(authController.protect, authController.restrictToAdmin, cartController.deleteCart);

router.route('/:id/insertMeal').patch(cartController.insertMeal);
router.route('/:id/removeMeal').patch(cartController.removeMeal);

module.exports = router;
