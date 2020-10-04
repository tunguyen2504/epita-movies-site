const { camelcaseKeys } = require('../utils/camelCase');

function camelcaseRequest(req, res, next) {
  req.query = camelcaseKeys(req.query, { deep: true });
  req.body = camelcaseKeys(req.body, { deep: true });
  next();
}

module.exports = camelcaseRequest;
