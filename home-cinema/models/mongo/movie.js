const mongoose = require('mongoose')
const Counter = require('./counter')

const movieSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		directors: [
			{
				name: String
			},
			{
				_id: false
			}
		],
		categories: [
			{
				name: String
			},
			{
				_id: false
			}
		],
		releaseDate: Date,
		thumbnailUrl: String,
		trailerUrl: String,
		rating: String
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

movieSchema.pre('save', async function (next) {
	await Counter.incrementCount('movieCounter');
	next();
});

module.exports = mongoose.model('Movie', movieSchema);