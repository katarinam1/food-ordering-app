const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  deliveryAddress: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: [Number],
    address: String,
  },
  phoneNumber: {
    type: String,
    required: [true, 'A user must have a phone'],
    validate: {
      validator: function (number) {
        return /^\+3816(([0-6]|[8-9])(\d{7}|\d{6})){1}$/.test(number);
      },
      message: (props) =>
        `${props.value} is not a valid phone number! Valid format is +3816XXXXXXX(X) `,
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Password field is required'],
    validate: [
      validator.isStrongPassword,
      'A password must be 8 characters long and contain a number, special character and upper case letter',
    ],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm the password'],
    validate: {
      validator: function (pass) {
        return pass === this.password;
      },
      message: 'Passwords do not match',
    },
  },
  stripeAccount: String,
  favorites: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Restaurant',
    },
  ],
});

userSchema.index({ deliveryAddress: '2dsphere' });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePassword = async function (userPass, bodyPass) {
  return await bcrypt.compare(bodyPass, userPass);
};

userSchema.methods.updateFavorites = function (favorite) {
  const fave = this.favorites.find((favoriteEl) =>
    favoriteEl._id.equals(favorite._id)
  );

  if (fave)
    this.favorites = this.favorites.filter(
      (favoriteEl) => !favoriteEl._id.equals(favorite._id)
    );
  if (!fave) this.favorites = this.favorites.push(favorite);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
