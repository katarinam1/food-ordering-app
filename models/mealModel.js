const mongoose = require('mongoose');
// const slugify = require('slugify');

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A meal must have a name'],
    maxLength: [30, "A meal can't have more than 30 characters"],
  },
  description: String,
  ingredients: {
    type: [String],
    validate: {
      validator: function arrayLimit(arr) {
        return arr.length <= 10;
      },
      message: '{PATH} exceeds the limit of 10',
    },
  },
  price: {
    type: Number,
    required: [true, 'A meal must have a price'],
  },
  tag: {
    type: [String],
    required: [true, 'A meal must have a tag'],
  },
  image: String,
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant',
    required: [true, 'A meal must belong to a restaurant'],
  },
  specialOffer: Number,
});

mealSchema.pre('save', function (next) {
  this.ingredients = this.ingredients.map((el) => el.toLowerCase().trim());
  this.tag = this.tag.map((el) => el.toLowerCase().trim());
  next();
});

mealSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'restaurant',
    select: 'name description _id',
  });
  next();
});

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;
