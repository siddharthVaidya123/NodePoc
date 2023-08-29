const mongoose = require('mongoose');

const tourSchems = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Must have name'],
      unique: true,
      maxlength: [40, 'Name must have less then 40 characters']
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required!'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Size is required!'],
    },
    difficulty: {
      type: String,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(value) {
          return value < this.price;
        },
        message: `Invalid discount value`
      }
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      required: [true, 'Must have a price'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchems.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchems.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
  //just for populating the reviews
})

tourSchems.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

const Tour = mongoose.model('Tour', tourSchems);

module.exports = Tour;
