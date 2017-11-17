const _ = require('lodash');
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id : new ObjectID(),
  text: 'First test todo',
},{
  _id : new ObjectID(),
  text:'second text todo',
  completed: true,
  completedAt: 333
}] ;

beforeEach((done) =>{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);
  }).then(()=>done());
});

describe('POST /todos', ()=>{
  it('should create a new todo', (done)=>{
    var text = 'Text todo next';

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res)=>{
      expect(res.body.text).toBe(text);
    })
    .end((err,res)=> {
      if (err) {
        return done(err);
      }
      Todo.find({text}).then((todos)=>{
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e)=> done(e));
    });
  });

  it('Should not created todo with invalid body data',(done)=>{
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err,res)=>{
      if (err) {
        return done(err);
      }

      Todo.find().then((todos)=>{
          expect(todos.length).toBe(2);
          done();
      }).catch((e)=> done(e))
    });
  });
});

describe('GET /todo', ()=>{
  it('Should get all todos', (done)=>{
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
  });
});

describe('GET /todos/:id',()=>{
  it('Should return todo doc', (done)=>{
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('should return 404 if todo not found', (done)=>{
    request(app)
    .get(`/todos/5a0bc1eb814579301e0e886b123`)
    .expect(404)
    .end(done);
  });
  it('Should return 404 for non-object ids',(done)=>{
    request(app)
    .get(`/todos/123`)
    .expect(404)
    .end(done);
  });
});

describe('DELETE /todos/:id', ()=>{
  it('Should remove a todo', (done)=>{
      var hecId = todos[1]._id.toHexString();
      request(app)
      .delete(`/todos/${hecId}`)
      .expect(200)
      .expect((res)=>{
        // process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
        // return console.log(process.env.MONGODB_URI);
        expect(res.body.todo._id).toBe(hecId);
      })
      .end((err, res)=>{
        if (err) {
          return done(err);
        }
        Todo.findById(hecId).then((todo)=>{
          expect(todo).toNotExist();
          done();
        }).catch((e)=> done(e));
      });
  });

  it('Should return 404 if todo not found', (done)=>{
    var hecId = new ObjectID().toHexString();
    request(app)
    .delete(`/todos/${hecId}`)
    .expect(404)
    .end(done);

  });

  it('Should retrun 404 if object id is invalid', (done)=>{
    request(app)
    .delete(`/todos/123`)
    .expect(404)
    .end(done);
  });
});

describe('PATCH /todos/:id',()=>{
  it('should update the todo', (done)=>{
    var id = todos[0]._id.toHexString();
      request(app)
      .patch(`/todos/${id}`)
      .send({
        completed: true,
        text: 'This a test one'
      })
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done)
  });
  it('should clear completeAt when todo is not completed',(done)=>{
    var id = todos[1]._id.toHexString();
    var text = 'This a test two';
    request(app)
    .patch(`/todos/${id}`)
    .send({
        text,
        completed:false,
    })
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toNotExist();
    })
    .end(done);
 });
});
