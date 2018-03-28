export const config = {
  server: {
    API: '/api',
    PORT: 3000,
    COOKIE_KEY: 'asdfsadfsadffsd',
    SECRET_JWT: 'dsfadfdsfasdfsadf',
    EXPIRES_JWT: 1000,
    ENV: 'development',
  },
  mongodb: {
    mongoURI: {
      dev: 'mongodb://user:psw@ds145438.mlab.com:45438/dbname',
      test: 'mongodb://user:psw@ds145438.mlab.com:45438/dbname',
      prod: 'mongodb://user:psw@ds145438.mlab.com:45438/dbname',
    },
  },
};
