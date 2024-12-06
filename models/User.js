const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  branch: { type: String, required: true },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  bio: {
    type: String,
    default: "",
  },
  avatar: {
    public_id: String,
    url: String,
  },
  faceData: { type: Array, required: true },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  credit: {
    type: Number,
    default: 0
  },
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  rank: {
    type: Number,
    default: 0
  },
  project: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project"
    }
  ],
  document: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document"
    }
  ]
});
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
UserSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, config.JWT_SECRET);
};
module.exports = mongoose.model('User', UserSchema);
