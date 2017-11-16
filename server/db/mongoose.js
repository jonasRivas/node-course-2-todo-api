var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp' || 'mongodb://root:root@ds163705.mlab.com:63705/node-todo-api' );
module.exports = {mongoose};
