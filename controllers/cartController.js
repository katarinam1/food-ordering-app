const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AppError = require('../utils/appError');
const Cart = require('../models/cartModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllCarts = catchAsync(async (req, res, next) => {
  const carts = await Cart.find({}).populate({
    path: 'meals.meal',
    model: 'Meal',
    select: 'name price image specialOffer ',
  });

  res.status(201).json({
    status: 'success',
    results: carts.length,
    data: { carts: carts },
  });
});

exports.createCart = catchAsync(async (req, res, next) => {
  const newCart = await Cart.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { cart: newCart },
  });
});

exports.deleteCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findByIdAndDelete(req.params.id);

  if (!cart) {
    return next(new AppError('The requested cart does not exist', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.updateCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate({ _id: req.params.id }, req.body, {
    runValidators: true,
    new: true,
  });

  if (!cart) {
    return next(new AppError('The requested cart does not exist', 404));
  }
  res.status(201).json({
    status: 'success',
    token: req.token,
    data: { cart: cart },
  });
});

exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findById(req.params.id).populate({
    path: 'meals.meal',
    model: 'Meal',
    select: 'name price image specialOffer -restaurant',
  });

  if (!cart) {
    return next(new AppError('The requested cart does not exist', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { cart: cart },
  });
});

exports.insertMeal = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ _id: req.params.id }).populate({
    path: 'meals.meal',
    model: 'Meal',
    select: 'name price image specialPrice _id -restaurant',
  });

  if (!cart) {
    return next(new AppError('The requested cart does not exist', 404));
  }

  const newMeal = {
    meal: req.body.meal,
    quantity: req.body.quantity,
  };

  cart.addMeal(newMeal);

  await cart.save();

  await cart
    .populate({
      path: 'meals.meal',
      model: 'Meal',
      select: 'name price image specialOffer _id -restaurant',
    })
    .execPopulate();

  res.status(200).json({
    status: 'success',
    data: { cart: cart },
  });
});

exports.removeMeal = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ _id: req.params.id });
  const mealId = req.body.meal;
  if (!cart) {
    return next(new AppError('The requested cart does not exist', 404));
  }

  cart.removeMeal(mealId);

  await cart.save();

  await cart
    .populate({
      path: 'meals.meal',
      model: 'Meal',
      select: 'name price image specialOffer _id -restaurant',
    })
    .execPopulate();

  res.status(200).json({
    status: 'success',
    data: { cart: cart },
  });
});

exports.deleteAbandonedCarts = catchAsync(async (req, res, next) => {
  const threeHoursPeriod = new Date();
  threeHoursPeriod.setHours(threeHoursPeriod.getHours() - 3);

  await Cart.deleteMany({
    $or: [{ status: 'new' }, { status: 'accepted' }],
    updatedAt: { $lte: threeHoursPeriod },
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.deleteCompletedCarts = catchAsync(async (req, res, next) => {
  const cart = await Cart.deleteMany({ status: 'completed' });

  if (!cart) {
    return next(new AppError('The requested cart does not exist', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const cart = await Cart.findById(req.params.id).populate({
    path: 'meals.meal',
    model: 'Meal',
    select: 'name _id price specialOffer image restaurant _id',
  });

  if (!cart) {
    return next(new AppError('The requested cart does not exist', 404));
  }

  let shippingRate = '';

  if (req.body.distance < 1) shippingRate = 0;
  if (req.body.distance >= 1 && req.body.distance < 2) shippingRate = 100;
  if (req.body.distance >= 2 && req.body.distance < 3) shippingRate = 200;
  if (req.body.distance >= 3) shippingRate = 300;

  // eslint-disable-next-line arrow-body-style
  const lineItems = cart.meals.map((mealObj) => {
    const unitAmount = mealObj.meal.specialOffer > 0 ? mealObj.meal.specialOffer : mealObj.meal.price;
    return {
      adjustable_quantity: {
        enabled: true,
        minimum: 1,
        maximum: 10,
      },
      price_data: {
        currency: 'usd',
        product_data: {
          name: mealObj.meal.name,
        },
        unit_amount: unitAmount * 100,
      },
      quantity: mealObj.quantity,
    };
  });

  lineItems.push({
    price_data: {
      currency: 'usd',
      product_data: {
        name: `Delivery fee`,
      },
      unit_amount: shippingRate,
    },
    quantity: 1,
  });

  const stripeObj = {
    payment_method_types: ['card'],
    mode: 'payment',
    allow_promotion_codes: true,
    metadata: {
      cart: cart._id.toString(),
      deliveryAddress: req.user.deliveryAddress.address,
      userId: req.user._id.toString(),
    },
    // eslint-disable-next-line arrow-body-style
    line_items: lineItems,
    success_url: `http://localhost:3000/restaurants/${cart.meals[0].meal.restaurant.id}/meals/success`,
    cancel_url: `http://localhost:3000/restaurants/${cart.meals[0].meal.restaurant.id}/meals`,
  };

  if (req.user.stripeAccount) stripeObj.customer = req.user.stripeAccount;
  else stripeObj.customer_email = req.user.email;

  const session = await stripe.checkout.sessions.create(stripeObj);

  res.status(200).json({
    status: 'success',
    session,
  });
});
