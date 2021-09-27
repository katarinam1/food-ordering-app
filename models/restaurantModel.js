const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A restaurant must have a name'],
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      maxLength: [500, 'A description can not be longer than 500 characters'],
    },
    prepTime: Number,
    workingHours: [
      {
        select: false,
        day: {
          type: String,
          enum: {
            values: [
              'monday',
              'tuesday',
              'wednesday',
              'thursday',
              'friday',
              'saturday',
              'sunday',
            ],
            message: 'Please provide a valid day',
          },
        },
        open: Number,
        close: Number,
      },
    ],
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    tags: [String],
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
    },
    imageCover: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

restaurantSchema.index({ location: '2dsphere' });

restaurantSchema.virtual('workingTimeToday').get(function () {
  const date = new Date();
  const day = date.toLocaleString('en-us', { weekday: 'long' }).toLowerCase();

  if (!this.workingHours) return;

  const [{ open, close }] = this.workingHours.filter((el) => el.day === day);

  if (!open && !close) return 'closed';

  const openHour = Math.round(open / 60);
  let openMinutes = open % 60;

  const closeHour = Math.round(close / 60);
  let closeMinutes = close % 60;

  openMinutes = openMinutes < 10 ? `0${openMinutes}` : openMinutes;
  closeMinutes = closeMinutes < 10 ? `0${closeMinutes}` : closeMinutes;

  return `${openHour}.${openMinutes} - ${closeHour}.${closeMinutes}`;
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
