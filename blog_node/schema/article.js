const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: String,
  description: String,
  tags: Array,
  subcategory: {
    type: Schema.Types.ObjectId,
    ref: 'subcategory'
  },
  isTop: {
    type: Number,
    default: 0
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  markType: String,
  status: {
    type: Boolean,
    default: true
  },
  content: {
    type: Object,
    default: {
      markdown: String,
      article: String
    }
  },
  commit: {
    type: Array,
    default: []
  },
  likes: {//点赞量
    type: Array,
    default: {
      name: String,
      createDate: {
        type: Date,
        default: Date.now
      }
    }
  },
  views: {//浏览量
    type: Number,
    default: 0
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  updateDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('article', articleSchema);