const mongoose = require('mongoose');
const Meal = require('./mealModel');

const cartSchema = new mongoose.Schema(
  {
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
    status: {
      type: String,
      default: 'new',
      enum: ['new', 'accepted', 'completed'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

cartSchema.pre('save', async function (next) {
  if (!this.isModified('meals')) return next();
  let sum = 0;
  await Promise.all(
    Object.values(this.meals).map(async (mealObj) => {
      const { quantity } = mealObj;
      const meal = await Meal.findOne({ _id: mealObj.meal });
      if (meal.specialOffer) {
        sum += meal.specialOffer * quantity;
      } else {
        sum += meal.price * quantity;
      }
    })
  );
  this.price = sum;
  next();
});

cartSchema.methods.addMeal = function (newMeal) {
  const [found] = this.meals.filter((mealObj) => mealObj.meal.equals(newMeal.meal));
  if (!found) {
    this.meals.push(newMeal);
    return;
  }

  this.meals.forEach((mealObj) => {
    if (mealObj === found) mealObj.quantity += newMeal.quantity;
  });
};

cartSchema.methods.removeMeal = function (mealId) {
  this.meals = this.meals.filter((mealObj) => !mealObj.meal.equals(mealId));
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
