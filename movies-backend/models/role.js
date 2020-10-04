const mongoose = require('mongoose')
const Counter = require('./counter')

const roleSchema = new mongoose.Schema(
	{
		name: String
	},
	{
		timestamps: true,
		versionKey: false
  }
);

// eslint-disable-next-line func-names
roleSchema.pre('save', async function(next) {
  await Counter.incrementCount('roleCounter');
  next();
});

module.exports = mongoose.model('Role', roleSchema);