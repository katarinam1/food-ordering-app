const express = require('express');
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.post('/webhook', orderController.stripeEventHandler);

router.use(authController.protect);
router.post('/create-coupon', authController.restrictToAdmin, orderController.createCoupon, orderController.createPromotionCode);

router.delete('/delete-coupon', authController.restrictToAdmin, orderController.deleteCoupon);

router.get('/fetch-coupons', orderController.getCoupons);

router.post('/refund-order/:orderId', orderController.createRefund);

router.route('/').get(orderController.getAllOrders).post(orderController.createOrder);
router
  .route('/:id')
  .get(orderController.getOrder)
  .patch(orderController.updateOrder)
  .delete(authController.restrictToAdmin, orderController.deleteOrder);

module.exports = router;
