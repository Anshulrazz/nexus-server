const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  documentation: String,
  file: {
    public_id: String,
    url: String,
  },
  category: { type: String, required: true },
  likes: { type: Number, default: 0 }
});

module.exports = mongoose.model('Document', DocumentSchema);
