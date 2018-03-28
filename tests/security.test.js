import request from 'request';
import {config} from '../src/config/index';
import { UserController } from '../src/controller/User.controller.ts';

describe('Security API - /login.', () => {
  let token;
  beforeAll((done) => {

    request.post({
      body : {
        'username': 'admin',
        'password': '1a1dc91c907325c69271ddf0c944bc72' //MD5 PSW : pass
      },
      url: `http://localhost:${config.server.PORT}${config.server.API}/login`,
      json: true
    }, function(err, res, body){
      expect(res.statusCode).toBe(200);
      expect(body).toEqual(expect.objectContaining({
        id: expect.stringMatching(/^[0-9a-fA-F]{24}$/),
      }));
      token = res.headers.authorization;
      done();
    });
  });
  it('Deve tornare un utente.', function(done){
    request.post({
      body : {
        'username': 'admin',
        'password': '1a1dc91c907325c69271ddf0c944bc72' //MD5 PSW : pass
      },
      url: `http://localhost:${config.server.PORT}${config.server.API}/login`,
      json: true
    }, function(err, res, body){
      expect(res.statusCode).toBe(200);
      expect(body).toEqual(expect.objectContaining({
        id: expect.stringMatching(/^[0-9a-fA-F]{24}$/),
      }));
      done();
    });
  });
  it('Deve tornare un 401 per password errata.', function(done){
    request.post({
      body : {
        'username': 'admin',
        'password': ''
      },
      url: `http://localhost:${config.server.PORT}${config.server.API}/login`,
      json: true
    }, function(err, res, body){
      expect(res.statusCode).toBe(401);
      expect(body).toEqual({'message' :'Not Authorized' });
      done();
    });
  });
  it('Deve tornare un 401 per username inesistente.', function(done){
    request.post({
      body : {
        'username': 'admina',
        'password':'asd'
      },
      url: `http://localhost:${config.server.PORT}${config.server.API}/login`,
      json: true
    }, function(err, res, body){
      expect(res.statusCode).toBe(401);
      expect(body).toEqual({'message' :'Not Authorized' });
      done();
    });
  });
});

describe('Security API - /verifyToken', () => {
  let token;
  beforeAll((done) => {
    request.post({
      body : {
        'username': 'admin',
        'password': '1a1dc91c907325c69271ddf0c944bc72' //MD5 PSW : pass
      },
      url: `http://localhost:${config.server.PORT}${config.server.API}/login`,
      json: true
    }, function(err, res, body){
      expect(res.statusCode).toBe(200);
      expect(body).toEqual(expect.objectContaining({
        id: expect.stringMatching(/^[0-9a-fA-F]{24}$/),
      }));
      token = res.headers.authorization;
      done();
    });
  });
  it('Deve tornare un utente.', function(done){
    request.post({
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body : {
        'token': 'Bearer ' + token
      },
      url: `http://localhost:${config.server.PORT}${config.server.API}/verifyToken`,
      json: true
    }, function(err, res, body){
      expect(res.statusCode).toBe(200);
      expect(body).toEqual(expect.objectContaining({
        id: expect.stringMatching(/^[0-9a-fA-F]{24}$/),
      }));
      done();
    });
  });
  it('Deve tornare 403 per token di autorizzazione in header errato.', function(done){
    request.post({
      headers: {
        'Authorization': 'bad token sent'
      },
      body : {
        'token': 'eyJhbGciOiJIFzVbvayB6sJcI'
      },
      url: `http://localhost:${config.server.PORT}${config.server.API}/verifyToken`,
      json: true
    }, function(err, res, body){
      expect(res.statusCode).toBe(403);
      expect(body).toEqual({'success':false, 'message' :'Failed to authenticate token' });
      done();
    });
  });
  it('Deve tornare 403 per token nel body errato.', function(done){
    request.post({
      headers: {
        'Authorization': 'Bearer eyHR4'
      },
      body : {
        'token': 'bad token to verify'
      },
      url: `http://localhost:${config.server.PORT}${config.server.API}/verifyToken`,
      json: true
    }, function(err, res, body){
      expect(res.statusCode).toBe(403);
      expect(body).toEqual({'success':false, 'message' :'Failed to authenticate token' });
      done();
    });
  });
  it('Deve tornare un 403 per mancanza di token nell\'header.', function(done){
    request.post({
      body : {
        'token': 'eyJhbGciOiJIUzI1NiIsB6sJcI'
      },
      url: `http://localhost:${config.server.PORT}${config.server.API}/verifyToken`,
      json: true
    }, function(err, res, body){
      expect(res.statusCode).toBe(403);
      expect(body).toEqual({'success':false, 'message' :'No token provided' });
      done();
    });
  });
});

describe('Security API - /changePassword.', () => {
  let token;
  beforeAll((done) => {
    request.post({
      body : {
        'username': 'admin',
        'password': '1a1dc91c907325c69271ddf0c944bc72' //MD5 PSW : pass
      },
      url: `http://localhost:${config.server.PORT}${config.server.API}/login`,
      json: true
    }, function(err, res, body){
      expect(res.statusCode).toBe(200);
      expect(body).toEqual(expect.objectContaining({
        id: expect.stringMatching(/^[0-9a-fA-F]{24}$/),
      }));
      token = res.headers.authorization;
      done();
    });
  });
  it('Deve cambiare password.', function(done){
    request.post({
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body : {
        'passwordNew': '1a1dc91c907325c69271ddf0c944bc72',
        'passwordOld': '1a1dc91c907325c69271ddf0c944bc72' //MD5 PSW : pass
      },
      url: `http://localhost:${config.server.PORT}${config.server.API}/changePassword`,
      json: true
    }, function(err, res, body){
      expect(res.statusCode).toBe(200);
      expect(body).toEqual({'success': true, 'message' :'OK' });
      done();
    });
  });
  it('Non deve cambiare password senza token nell\'header.', function(done){
    request.post({
      body : {
        'passwordNew': '1a1dc91c907325c69271ddf0c944bc72',
        'passwordOld': '1a1dc91c907325c69271ddf0c944bc72' //MD5 PSW : pass
      },
      url: `http://localhost:${config.server.PORT}${config.server.API}/changePassword`,
      json: true
    }, function(err, res, body){
      expect(res.statusCode).toBe(403);
      expect(body).toEqual({'success':false, 'message' :'No token provided' });
      done();
    });
  });
  it('Deve tornare 500 in mancanza della oldPassword', function(done){
    request.post({
      headers: {
        'Authorization': 'Bearer ' + token
      },
      url: `http://localhost:${config.server.PORT}${config.server.API}/changePassword`,
      json: true
    }, function(err, res, body){
      expect(res.statusCode).toBe(500);
      expect(body).toEqual({'message' :'Old password not valid' });
      done();
    });
  });
});