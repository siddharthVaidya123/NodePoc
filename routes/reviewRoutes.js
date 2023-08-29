const express = require('express');
const reviewContoller = require('../controllers/reviewContoller');
const authcon = require('../controllers/authController');
const reviewRouter = express.Router();

reviewRouter
  .route('/')
  .get(authcon.protect, reviewContoller.getReviews)
  .post(authcon.protect, reviewContoller.createReview);

module.exports = reviewRouter;
