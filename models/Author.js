const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    bio: {
      type: String,
      default: '',
      trim: true,
      maxlength: 400,
    },
    avatarUrl: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Author', authorSchema);
