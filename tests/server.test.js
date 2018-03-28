import request from 'request';
import {config} from '../src/config/index';

describe('Server is live?', function(){
  it('deve tornare una risposta alla GET', function(done){
    request.get({
      url: `http://localhost:${config.server.PORT}`,
      json: true
    }, function(err, res, body){
      expect(res.statusCode).toBe(200);
      expect(body).toEqual({ 'Page' :'Home Page' });
      done();
    });
  });
});
