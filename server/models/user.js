var mongoose = require('mongoose');

var User = mongoose.model('User',{
  email:{
    required: true,
    trim:true,
    minlength:1,
    type: String
  }
});

  newUser = new User({
    email: '    Alfonso@test.com'
  });

  // newUser.save().then((docs)=>{
  //   console.log(JSON.stringify(docs,undefined,2));
  // }, (e)=>{
  //   console.log('unable to save values ',e);
  // });

  module.exports = {User};
