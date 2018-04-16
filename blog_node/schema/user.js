const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        default: 'admin'
    },
    showName: {
      type: String,
      default: ''
    },
    password: {
        type: String,
        default: '123456'
    },
    superAdmin: {
      type: Boolean,
      default: false
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('user', userSchema);