const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AppError = require('../utils/appError');
const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const Cart = require('../models/cartModel');
const User = require('../models/userModel');

exports.getAllOrders = catchAsync(async (req, res, next) => {
  let filter = {};

  if (req.user.role === 'user') filter = { user: req.user._id };
  const orders = await Order.find(filter).populate({
    path: 'meals.meal',
    model: 'Meal',
    select: 'name price specialOffer image',
  });

  res.status(201).json({
    status: 'success',
    results: orders.length,
    data: { orders: orders },
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const neworder = await Order.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { order: neworder },
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    return next(new AppError('The requested order does not exist', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findOne({ _id: req.params.id });
  // const order = await Order.findOne({ _id: req.body.order });
  if (!order) {
    return next(new AppError('The requested order does not exist', 404));
  }
  order.status = req.body.status;

  await order.save();

  res.status(201).json({
    status: 'success',
    token: req.token,
    data: {
      order,
    },
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate({
    path: 'meals.meal',
    model: 'Meal',
    select: 'name price specialOffer image -restaurant',
  });

  if (!order) {
    return next(new AppError('The requested order does not exist', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { order: order },
  });
});

exports.createRefund = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    return next(new AppError('The requested cart does not exist', 404));
  }

  const refund = await stripe.refunds.create({
    payment_intent: order.paymentIntent,
  });

  order.status = 'refunded';

  await order.save();

  res.status(200).json({
    status: 'success',
    refund,
  });
});

const checkoutUser = (customerId) =>
  new Promise((resolve, reject) => {
    stripe.checkout.sessions.listLineItems(customerId, (err, lineItems) => {
      if (err) {
        return reject(err);
      }
      resolve(lineItems);
    });
  });

const updateUserStripe = async (stripeUserId, userId) => {
  const user = await User.findById(userId);

  if (!user.stripeAccount) user.stripeAccount = stripeUserId;

  await user.save({ validateBeforeSave: false });
};

exports.stripeEventHandler = async (req, res, next) => {
  const payload = req.rawBody;
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = await stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET_KEY);
  } catch (err) {
    return next(new AppError(`Webhook Error: ${err.message}`, 400));
  }
  let lineItems;

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const sessionExpanded = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['total_details.breakdown'],
    });

    //user
    const { customer } = session;
    const { userId } = session.metadata;

    await updateUserStripe(customer, userId);

    //discounts
    const { discounts } = sessionExpanded.total_details.breakdown;

    const coupon = discounts[0] ? discounts[0].discount.coupon : null;

    lineItems = await checkoutUser(session.id);

    const cart = await Cart.findById(session.metadata.cart).populate({
      path: 'meals.meal',
      model: 'Meal',
      select: 'name _id price specialOffer image restaurant _id',
    });

    const deliveryFee = lineItems.data.find((lineItem) => lineItem.description === 'Delivery fee');

    const cartCheckout = lineItems.data.map((lineItem) => {
      const mealObj = {
        name: lineItem.description,
        quantity: lineItem.quantity,
      };
      return mealObj;
    });

    cart.price = session.amount_total / 100;

    cart.meals = cart.meals.map((mealObj) => {
      const [meal] = cartCheckout.filter((mealCheckout) => mealCheckout.name === mealObj.meal.name);
      if (meal) mealObj.quantity = meal.quantity;
      return mealObj;
    });

    req.body.meals = cart.meals;
    req.body.price = cart.price;
    req.body.user = session.metadata.userId;
    req.body.address = session.metadata.deliveryAddress;
    req.body.paymentIntent = session.payment_intent;
    req.body.deliveryFee = deliveryFee.price.unit_amount / 100;

    if (coupon)
      req.body.coupon = {
        code: coupon.name,
        percentOff: coupon.percent_off,
        amountDiscount: session.total_details.amount_discount / 100,
      };

    await Order.create(req.body);

    cart.price = 0;
    cart.status = 'accepted';
    cart.meals = [];

    await cart.save();
  }

  res.status(200).json({
    status: 'success',
  });
};

exports.createCoupon = catchAsync(async (req, res, next) => {
  const couponObj = {
    percent_off: req.body.discount,
    name: req.body.name,
  };

  if (req.body.date) {
    couponObj.redeem_by = req.body.date;
  }

  if (req.body.maxRedemptions) couponObj.max_redemptions = req.body.maxRedemptions;

  const coupon = await stripe.coupons.create(couponObj);

  req.coupon = coupon;
  next();
});

exports.createPromotionCode = catchAsync(async (req, res, next) => {
  const promotionObj = {
    coupon: req.coupon.id,
    code: req.coupon.name,
  };
  promotionObj.restrictions = {};

  if (req.body.minimumAmount) {
    promotionObj.restrictions = {
      minimum_amount: req.body.minimumAmount,
      minimum_amount_currency: 'usd',
    };
  }

  if (req.body.firstTime) {
    promotionObj.restrictions.first_time_transaction = req.body.firstTime;
  }

  if (req.body.description)
    promotionObj.metadata = {
      description: req.body.description,
    };

  const promotionCode = await stripe.promotionCodes.create(promotionObj);

  res.status(200).json({
    status: 'success',
    promotionCode,
  });
});

exports.getCoupons = catchAsync(async (req, res, next) => {
  const promotionCodes = await stripe.promotionCodes.list({ active: true });

  res.status(201).json({
    status: 'success',
    promotionCodes,
  });
});

exports.deleteCoupon = catchAsync(async (req, res, next) => {
  await stripe.coupons.del(req.body.coupon);

  res.status(204).json({
    status: 'success',
  });
});
