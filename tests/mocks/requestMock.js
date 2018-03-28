const fs = require('fs');

export const requestMock = {
  post: (req, cb) => new Promise((resolve, reject) => {
    if(req.headers.Authorization && req.body){
      resolve(cb(null, {
        statusCode: 200
      }, {
        "_id": "12345678901234567890abcd",
        "birthDate": 0,
        "name": "NomeAttore",
        "surname": "CognomeAttore"
      }));
    }else {
      reject(cb(null, {
        statusCode: 403
      }, {message:"Not Authorized."}));
    }
  }),

  get: (req, cb) => new Promise((resolve, reject) => {
    const lastSlash = req.url.lastIndexOf('/')
    const actorID = req.url.substring(lastSlash + 1)
    if(req.headers.Authorization){
      fs.readFile(`./tests/mockData/actor.${actorID}.json`, 'utf8', (err, data) => {
        if (err) {
          reject(cb(null, {statusCode: 403}, {message:"Not Authorized."}));
        }
        else {
          resolve(cb(null, {statusCode:200}, JSON.parse(data) ));
        }
      });
    }
    else {
      reject(cb(null, {statusCode: 403}, {message:"Not Authorized."}));
    }
  }),

  delete: (req, cb) => new Promise((resolve, reject) => {
    const lastSlash = req.url.lastIndexOf('/')
    const actorID = req.url.substring(lastSlash + 1)
    if(req.headers.Authorization){
      fs.readFile(`./tests/mockData/actor.${actorID}.json`, 'utf8', (err, data) => {
        if (err) {
          reject(cb(null, {statusCode: 403}, {message:"Not Authorized."}));
        }
        else {
          resolve(cb(null, {statusCode:200}, {message: "OK"} ));
        }
      });
    } else {
      reject(cb(null, {statusCode: 403}, {message:"Not Authorized."}));
    }
  }),
}