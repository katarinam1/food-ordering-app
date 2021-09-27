const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.use(authController.protect);

router.patch('/updatePassword', authController.updatePassword);

router.patch('/updateFavorites', userController.updateFavorites);

router
  .route('/')
  .get(authController.restrictToAdmin, userController.getAllUsers)
  .post(authController.restrictToAdmin, userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUserInfo)
  .delete(authController.restrictToAdmin, userController.deleteUser);

module.exports = router;
