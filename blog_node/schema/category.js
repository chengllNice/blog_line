const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: String,
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: 'subcategory'
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('category', categorySchema);