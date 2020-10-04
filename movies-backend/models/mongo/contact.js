const mongoose = require('mongoose')
const Address = require('./address')

const contactSchema = new mongoose.Schema(
	{
		birthDate: Date,
		gender: String,
		address: Address
	},
  {
    _id: false,
    timestamps: false,
    versionKey: false,
  },
)

module.exports = contactSchema