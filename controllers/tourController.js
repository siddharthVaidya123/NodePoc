const fs = require('fs');
const Tour = require('../model/tourModel');
const APIFeatrues = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.checkId = (req, res, next, val) => {
  // if (val > tours.length) {
  //   return res.status(404).json({
  //     status: "fail",
  //     message: "Invalid Id",
  //   });
  // }
  next();
};
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    res.status(500).json({
      status: 'Failed',
      message: 'Missing param',
    });
  }
  next();
};

exports.getTours = catchAsync(async (req, res, next) => {
  const features = (
    await new APIFeatrues(Tour.find(), req.query)
      .filter()
      .limitFields()
      .pagination()
  ).sort();
  const AllTours = await features.query;
  res.status(200).json({
    status: 'Success',
    result: AllTours.length,
    data: {
      tours: AllTours,
    },
  });
});

exports.getTourByID = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findById(id).populate('reviews');
  if(!tour) {
    return next(new AppError('No tour found with that id', 404))
  }
  res.status(200).json({
    status: 'Success',
    data: {
      tours: tour,
    },
  });
});

exports.updateTourById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.status(200).json({
    status: 'Success',
    data: {
      tours: tour,
    },
  });
});

exports.deleteTourById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await Tour.findByIdAndDelete(id);
  res.status(200).json({
    status: 'Success',
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'Success',
    data: {
      tour: newTour,
    },
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numRatings: { $sum: '$ratingsQuantity' },
        avgratings: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);
  res.status(201).json({
    status: 'Success',
    data: {
      tour: stats,
    },
  });
});

exports.getMonthlyPlans = catchAsync(async (req, res, next) => {
  const { year } = req.params;

  const plans = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-01`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numOfTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numOfTours: -1 },
    },
  ]);
  res.status(201).json({
    status: 'Success',
    data: {
      tour: plans,
    },
  });
});
