const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema(
	{
		country: String,
		area: String,
		city: String,
		street: String,
		number: String
	},
  {
    _id: false,
    timestamps: false,
    versionKey: false,
  },
)

module.exports = addressSchema