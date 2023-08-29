const AppError = require("../utils/appError");

const handleError = (err) => {
  new AppError('Invalid Token. Please login again!');
}

module.exports = (err, req, res, next) => {
  let error = {...err}
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (err.name == 'JsonWebTokenError') {
    error = handleError(err);
  }
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
 
};
