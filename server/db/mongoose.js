var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// process.env.MONGODB_URI = 'mongodb://root:root@ds163705.mlab.com:63705/node-todo-api';
mongoose.connect(process.env.MONGODB_URI); //

module.exports = {mongoose};
