const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  meals: [
    {
      meal: {
        type: mongoose.Schema.ObjectId,
        ref: 'Meal',
      },
      quantity: {
        type: Number,
      },
    },
  ],
  price: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: 'paid',
    enum: ['paid', 'cancelled', 'accepted', 'refund requested', 'refunded', 'refund denied'],
  },
  address: {
    type: String,
  },
  coupon: {
    code: {
      type: String,
    },
    percentOff: Number,
    amountDiscount: Number,
  },
  paymentIntent: String,
  refund: {
    reason: String,
    status: {
      type: String,
      enum: ['denied', 'accepted'],
    },
    amountRefunded: Number,
  },
  deliveryFee: Number,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'An order must belong to a user'],
  },
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
