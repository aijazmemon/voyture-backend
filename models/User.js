const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs'); 


const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isHost: {
    type: Boolean,
    default: false,
  },
  profession: {
    type: String,
    required: function() { return this.isHost; }, // Only required for hosts
  },
  location: {
    type: String,
    required: function() { return this.isHost; }, // Only required for hosts
  },
  aadharCard: {
    type: String,
  },
  selfie: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

// Method to match user password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

// Hash password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});


module.exports = mongoose.model('User', userSchema);
