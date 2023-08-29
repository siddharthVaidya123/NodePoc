const Review = require('../model/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: 'Success',
    result: reviews.length,
    data: {
      reviews: reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'Success',
    data: {
      review: newReview,
    },
  });
});
