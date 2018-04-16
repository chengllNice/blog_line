const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subcategorySchema = new Schema({
    name: String,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    },
    imgIcon: {
        type: String,
        default: 'defaultIcon.png'
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('subcategory', subcategorySchema);