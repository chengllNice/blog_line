const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  url: String,
  href: String,
  title: String,
  isShow: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('image', imageSchema);