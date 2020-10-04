const mongoose = require('mongoose')
const Counter = require('./counter')

const movieSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		directors: [{ name: String }],
		categories: [
			{
				name: String
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