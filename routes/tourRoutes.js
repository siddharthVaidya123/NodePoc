const express = require('express');
const tourController = require('../controllers/tourController');
const tourRouter = express.Router();
const authController = require('../controllers/authController');
const reviewcontoller = require('../controllers/reviewContoller');

tourRouter.param('id', tourController.checkId);
tourRouter
  .route('/')
  .get(authController.protect, tourController.getTours)
  .post(tourController.checkBody, tourController.createTour);

tourRouter.route('/getTourStats').get(tourController.getTourStats);
tourRouter.route('/getMontlyPlans/:year').get(tourController.getMonthlyPlans);

tourRouter
  .route('/:id')
  .get(tourController.getTourByID)
  .patch(tourController.updateTourById)
  .delete(authController.protect, tourController.deleteTourById);

tourRouter.route('/:tourId/reviews').post(authController.protect, 
  reviewcontoller.createReview)
module.exports = tourRouter;
