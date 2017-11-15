const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '5a0bc1eb814579301e0e886b123';
// // var id = '6a0bc1eb814579301e0e886b'; //wrong value
//
// if (!ObjectID.isValid(id)){
//   return console.log('ID not valid');
// }

// Todo.find({
//   _id: id
// }).then((todo) => {
//   console.log('Todos',todo);
// });
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo',todo);
// });
// Todo.findById(id).then((todo)=>{
//   if (!todo) {
//     return console.log('Id not found');
//   }
//   console.log('Todo by id ',todo);
// }).catch((e)=>console.log(e));
 var id = '5a0a71af20c3be4047e17d12';
 if (!ObjectID.isValid(id)){
    console.log('ID not valid');
 }
 User.findById(id).then((user)=>{
   if (!user) {
     return console.log('There are not user on database');
   }
   console.log('User by id:', user);
 }).catch((e)=>console.log(e));
