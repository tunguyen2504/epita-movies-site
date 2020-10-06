const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema(
  {
    counter: String,
    sequence: { type: Number, default: 0 },
  },
  {
    versionKey: false,
  },
);

// eslint-disable-next-line func-names
counterSchema.statics.incrementCount = async function(counter) {
  const updatedCounter = await this.findOneAndUpdate(
    { counter },
    { $inc: { sequence: 1 } },
    { new: true },
  );
  return updatedCounter.sequence;
};

module.exports = mongoose.model('Counter', counterSchema);
