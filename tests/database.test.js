import mongoose from 'mongoose';
import {schema, userSchema} from '../src/models/User';

describe('Database Tests', function() {
  beforeAll(function (done) {
    mongoose.connect('mongodb://localhost/testDatabase');
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', function() {
      console.log('We are connected to test database!');
      done();
    });
  });
  describe('User Database', function() {
    it('Should return a password required message', function(done) {
      var utente = userSchema({
        username:'Lorenzo'
      }).save(err => {
        if(err) {
          return done();
        }
        throw new Error('Should generate error!');
      });
    });
    it('Should save a new account', function(done) {
      var utente = userSchema({
        username: 'admin',
        password: '1a1dc91c907325c69271ddf0c944bc72' // pass in MD5
      });
      utente.save(err => {
        if(!err) { return done(); }
        throw new Error('Shouldn\'t generate error!');
      });
    });
    it('Should retrieve data from test database', function(done) {
      userSchema.find({username: 'admin'}, (err, username) => {
        if(err) {throw err;}
        if(username.length === 0) {throw new Error('No data!');}
        done();
      });
    });
  });
  afterAll(function(done){
    mongoose.connection.db.dropDatabase(function(){
      mongoose.connection.close(done);
    });
  });
});