/*暂时没有用*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const echartsSchema = new Schema({
  commits: 0,
  views: 0,
  likes: 0,
  createdDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('echarts', echartsSchema);