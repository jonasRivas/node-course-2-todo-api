// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
    if (err) {
      return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').findOneAndUpdate({
    //   _id: new ObjectID('5a0494352ee5f9c7789bf190')
    // }, {
    //   $set: {
    //     completed: true
    //   }
    // }, {
    //   returnOriginal: false
    // }).then((result) => {
    //   console.log(result);
    // });
    //
    db.collection('Users').findOneAndUpdate({
      _id : new ObjectID('5a0488de2ee5f9c7789bef11')
    }, {
      $set: {
        name: 'Jonas'
      },
      $inc : {
        age: 2
      }
    }, {
      returnOriginal : false
    }).then((result)=>{
      console.log(result);
    })


  //  db.close();
});
