// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
    if (err) {
      return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todo').insertOne({
    //   text: 'Something to do',
    //   completed: false
    // }, (err, result)=>{
    //   if (err) {
    //     return console.log('Unable to insert a document',err);
    //   }
    //   console.log(JSON.stringify(result.ops, undefined, 2));
    // });
    // db.collection('Users').insertOne({
    //   name:'Jonas',
    //   age: 27,
    //   location:'Mexico'
    // }, (err, result)=>{
    //   if (err) {
    //     return console.log('Unable to insert User', err);
    //   }
    //   console.log(JSON.stringify(result.ops, undefined,2));
    // });


    db.close();
});
