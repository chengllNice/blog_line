const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/myBlog';
// const models = require('./models');

// models

module.exports = exports = function () {

    mongoose.connect(DB_URL);

    const con = mongoose.connection;

    con.on('error', () => {
        console.log('数据库连接失败')
    });

    con.on('disconnected', () => {
        console.log('数据库连接断开')
    });

    con.once('connected', () => {
        console.log('数据库连接成功');
        console.log('Mongoose connection open to ' + DB_URL);
    });
};