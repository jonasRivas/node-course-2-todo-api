// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
    if (err) {
      return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todo').find({completed:false}).toArray().then((docs)=>{
    // db.collection('Todo').find().count().then((count)=>{
    // console.log(`Todo Count: ${count} `);
    db.collection('Users').find({name:'Jonas'}).toArray().then((docs)=>{
      console.log(JSON.stringify(docs, undefined,2));
    }, (err)=>{
      return console.log('Unable to fetch Users',err);
    });


  //  db.close();
});
