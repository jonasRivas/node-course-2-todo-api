var mongoose = require('mongoose');


var Todo = mongoose.model('Todo',{
  text:{
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false

  },
  completedAt: {
    type: Number,
    default: null
  }
});

// var newTodo = new Todo({
//   text: 'Cook dinner'
// });
var newTodo = new Todo({
  text: 'Feed the cat',
  completed: true,
  completedAt: 123
});
// newTodo.save().then((doc)=>{
//   console.log(JSON.stringify(doc,undefined,2));
// }, (e) =>{
//   console.log('Unable to save', e);
// });

module.exports = {Todo};
