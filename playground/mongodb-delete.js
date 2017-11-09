// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
    if (err) {
      return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    //deleteMany
    // db.collection('Todos').deleteMany({text:'Eat lunch'}).then((result)=>{
    //   console.log(result);
    // });

    //deleteOne
    // db.collection('Todos').deleteOne({text:'Eat lunch'}).then((result)=>{
    //   console.log(result);
    // });

    //findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result)=>{
    //   console.log(result);
    // });

    //deleteMany
    db.collection('Users').deleteMany({name: 'Jonas'}).then((result)=>{
      //console.log(result);
    });

    //deleteOne
    db.collection('Users').deleteOne({_id: new ObjectID('5a0488ed2ee5f9c7789bef13')}).then((result)=>{
    //  console.log(result);
    });

  //  db.close();
});
