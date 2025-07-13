const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
  annualSavingsAmount: { type: Number, default: 0 },
  occupation: { type: String },
  profileImage: { type: String }, // Store as base64 or URL
  dateOfBirth: { type: String },
  monthlyIncome: { type: Number, default: 0 },
  preferredCurrency: { type: String, default: 'INR' },
  financialGoal: { type: String },
  joinDate: { type: String },
  membershipLevel: { type: String, default: 'Basic' },
  bio: { type: String },
  emailNotifications: { type: Boolean, default: false },   // <-- Add this line
  mobileNotifications: { type: Boolean, default: false }   // <-- Add this line
});

module.exports = mongoose.model('UserProfile', UserProfileSchema);