/* eslint-disable no-unused-vars */
const mung = require('express-mung');
const snakecaseKeys = require('snakecase-keys');

function transformObjectId(obj) {
  if (typeof obj !== 'object') {
    return obj;
  }

  // typeof null = object
  if (obj === null) {
    return null;
  }

  // Check if obj is Mongoose Object
  if (obj._doc) {
    return transformObjectId(obj.toJSON());
  }

  // Check if obj is ObjectId
  if (obj._bsontype === 'ObjectID') {
    return obj.toString();
  }

  Object.keys(obj).forEach(key => {
    // eslint-disable-next-line no-param-reassign
    obj[key] = transformObjectId(obj[key]);
  });

  return obj;
}

function snakecaseRes() {
  return mung.json(function transform(body, req, res) {
    return snakecaseKeys(transformObjectId(body), { deep: true });
  });
}

module.exports = snakecaseRes;
