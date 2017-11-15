var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://<dbuser>:<dbpassword>@ds163705.mlab.com:63705/node-todo-api' || 'mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};
