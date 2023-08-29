const moongoose = require('mongoose');

// create new schema

const reviewSchema = new moongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review is required'],
  },
  rating: {
    type: String,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  tour: {
    type: moongoose.Schema.ObjectId,
    ref: 'Tour',
  },
  user: {
    type: moongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user'],
  },
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name',
  })
  next();
});

const Review = moongoose.model('Review', reviewSchema);
module.exports = Review;
