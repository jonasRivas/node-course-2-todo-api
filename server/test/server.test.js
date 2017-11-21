const _ = require('lodash');
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', ()=>{
  it('should create a new todo', (done)=>{
    var text = 'Text todo next';

    request(app)
    .post('/todos')
    .set('x-auth', users[0].tokens[0].token)
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
    .set('x-auth', users[0].tokens[0].token)
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
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.length).toBe(1);
    })
    .end(done);
  });
});

describe('GET /todos/:id',()=>{
  it('Should return todo doc', (done)=>{
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('Should not return todo doc created by other user', (done)=>{
    request(app)
    .get(`/todos/${todos[1]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return 404 if todo not found', (done)=>{
    request(app)
    .get(`/todos/5a0bc1eb814579301e0e886b123`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });
  it('Should return 404 for non-object ids',(done)=>{
    var hecId = new ObjectID().toHexString();
    request(app)
    .get(`/todos/${hecId}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });
});

describe('DELETE /todos/:id', ()=>{
  it('Should remove a todo', (done)=>{
      var hecId = todos[1]._id.toHexString();
      request(app)
      .delete(`/todos/${hecId}`)
      .set('x-auth', users[1].tokens[0].token)
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

  it('Should remove a todo', (done)=>{
      var hecId = todos[0]._id.toHexString();
      request(app)
      .delete(`/todos/${hecId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res)=>{
        if (err) {
          return done(err);
        }
        Todo.findById(hecId).then((todo)=>{
          expect(todo).toExist();
          done();
        }).catch((e)=> done(e));
      });
  });
  it('Should return 404 if todo not found', (done)=>{
    var hecId = new ObjectID().toHexString();
    request(app)
    .delete(`/todos/${hecId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done);

  });

  it('Should retrun 404 if object id is invalid', (done)=>{
    request(app)
    .delete(`/todos/123`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done);
  });
});

describe('PATCH /todos/:id',()=>{
  it('should update the todo', (done)=>{
    var id = todos[0]._id.toHexString();
      request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
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

  it('should not update the todo created by other user', (done)=>{
    var id = todos[0]._id.toHexString();
      request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed: true,
        text: 'This a test one'
      })
      .expect(404)
      .end(done)
  });

  it('should clear completeAt when todo is not completed',(done)=>{
    var id = todos[1]._id.toHexString();
    var text = 'This a test two';
    request(app)
    .patch(`/todos/${id}`)
    .set('x-auth', users[1].tokens[0].token)
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

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123mnb!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((e)=> done(e));
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'and',
        password: '123'
      })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'Password123!'
      })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', ()=>{
  it('Should loging user and return auth token', (done)=>{
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: users[1].password
    })
    .expect(200)
    .expect((res)=>{
      expect(res.headers['x-auth']).toExist();
    })
    .end((err,res)=>{
      if (err) {
      return done(err);
      }

      User.findById(users[1]._id).then((user)=>{
        expect(user.tokens[1]).toInclude({
          access: 'auth',
          token: res.headers['x-auth']
        });
        done();
      }).catch((e)=> done(e));
    });
  });

  it('should reject invaid login', (done)=>{
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: users[1].password + '1'
    })
    .expect(400)
    .expect((res)=>{
      expect(res.headers['x-auth']).toNotExist();
    })
    .end((err,res)=>{
      if (err) {
      return done(err);
      }

      User.findById(users[1]._id).then((user)=>{
        expect(user.tokens.length).toBe(1);
        done();
      }).catch((e)=> done(e));

    });
  });
});

describe('DELETE /users/me/token', ()=>{
  it('should remove auth token on logout', (done)=>{
    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .end((err, req)=>{
      if (err) {
        return done(err);
      }

      User.findById(users[0]._id).then((user)=>{
          expect(user.tokens.length).toBe(0);
          done();
      }).catch((e)=> done(e));
    });
  });
});
