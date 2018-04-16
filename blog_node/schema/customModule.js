const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customModuleSchema = new Schema({
  name: {
    text: String,
    mark: {
      type: Boolean,
      default: true
    }
  },
  sortIndex: Number,
  moduleType: Number,
  content: [
    {
      title: String,
      url: String,
      href: String
    }
  ],
  //是否展示模块
  status: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('customModule', customModuleSchema);