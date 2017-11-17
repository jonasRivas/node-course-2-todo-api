const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// there are three methods
// Todo.remove({}).then((result)=>{
//   console.log(result);
// });

Todo.findOneAndRemove({_id:'5a0decb2e9d778640c7451bb'}).then((doc)=>{

});
//
// Todo.findByIdAndRemove('5a0decb2e9d778640c7451bb').then((doc)=>{
//   console.log(doc);
// });
