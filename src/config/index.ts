export const config = {
  server: {
    API: '/api',
    PORT: 3000,
    COOKIE_KEY: 'asdfsadfsadffsd',
    SECRET_JWT: 'dsfadfdsfasdfsadf',
    EXPIRES_JWT: 100000,
    ENV: 'development',
  },
  mongodb: {
    mongoURI: {
      dev: 'mongodb://localhost/ts-node-meetup',
      web: process.env.MONGOLAB_CRIMSON_URI || 'mongodb://localhost/ts-node-meetup',
      prod: 'mongodb://localhost/ts-node-meetup',
    },
  },
};
