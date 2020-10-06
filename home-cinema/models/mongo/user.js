const mongoose = require('mongoose')
const md5 = require('md5')
const Counter = require('./counter')
const Contact = require('./contact')

const userSchema = new mongoose.Schema(
  {
    email: { type: String, trim: true, lowercase: true, required: true },
    name: { type: String, required: true },
		password: { type: String, required: true },
		roleId: { type: String, required: true },
    contact: { type: Contact }
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// eslint-disable-next-line func-names
userSchema.pre('save', async function(next) {
  this.password = md5(this.password);
  await Counter.incrementCount('userCounter');
  next();
});

// eslint-disable-next-line func-names
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
