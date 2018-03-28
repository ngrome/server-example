import request from 'request';
import {config} from '../src/config/index';
import {requestMock} from './mocks/requestMock';

describe('Actor API - GET - /.', () => {
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
  it('Deve tornare una lista di attori.', function(done){
    request.get({
      headers: {
        'Authorization': 'Bearer ' + token
      },
      url: `http://localhost:${config.server.PORT}${config.server.API}/actors`,
      json: true
    }, function(err, res, body){
      expect(res.statusCode).toBe(200);
      /*expect(body).toEqual(expect.arrayContaining([{
        _id: expect.stringMatching(/^[0-9a-fA-F]{24}$/),
      }]));*/
      expect(Array.isArray(body)).toBe(true);
      done();
    });
  });
  it('Deve creare un attore.', function(done){
    requestMock.post({
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: {
        "birthDate": 0,
        "name": "NomeAttore",
        "surname": "CognomeAttore"
      },
      url: `http://localhost:${config.server.PORT}${config.server.API}/actors`,
      json: true
    }, function(err, res, body){
      expect(res.statusCode).toBe(200);
      expect(body).toEqual(expect.objectContaining({
        _id: expect.stringMatching(/^[0-9a-fA-F]{24}$/),
      }));
      done();
    });
  });
  it('Deve tornare un attore.', function(done){
    requestMock.get({
      headers: {
        'Authorization': 'Bearer ' + token
      },
      url: `http://localhost:${config.server.PORT}${config.server.API}/actors/1`,
      json: true
    }, function(err, res, body){
      expect(res.statusCode).toBe(200);
      expect(body).toEqual(expect.objectContaining({
        "_id": '12345678901234567890wxyz',
        "name": "TestNome",
        "surname": "TestCognome"
      }));
      done();
    });
  });
  it('Deve eliminare un attore.', function(done){
    requestMock.delete({
      headers: {
        'Authorization': 'Bearer ' + token
      },
      url: `http://localhost:${config.server.PORT}${config.server.API}/actors/1`,
      json: true
    }, function(err, res, body){
      expect(res.statusCode).toBe(200);
      expect(body).toEqual({'message' :'OK' });
      done();
    });
  });
});
