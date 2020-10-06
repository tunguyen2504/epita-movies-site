const snakecaseKeys = require('snakecase-keys');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  return res.status(err.statusCode || 500).send(
    snakecaseKeys({
      code: err.statusCode || 500,
      message: err.message || 'Something went wrong',
    }),
  );
}

module.exports = errorHandler;
