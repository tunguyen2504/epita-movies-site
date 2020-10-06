'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SeenMovie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  SeenMovie.init({
    userId: {
			type:DataTypes.STRING,
			allowNull:false
		},
    movieId: {
			type: DataTypes.STRING,
			allowNull: false
		},
    seenTime: {
			type: DataTypes.DATE,
			allowNull: false
		}
  }, {
    sequelize,
    modelName: 'SeenMovie',
  });
  return SeenMovie;
};