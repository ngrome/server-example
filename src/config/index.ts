export const config = {
  server: {
    API: '/api',
    PORT: 3000,
    COOKIE_KEY: 'asdfsadfsadffsd',
    SECRET_JWT: 'dsfadfdsfasdfsadf',
    EXPIRES_JWT: 250,
    ENV: 'development',
  },
  mongodb: {
    mongoURI: {
      dev: 'mongodb://localhost/codemotion2018',
      web: (process.env.MONGODB_URI || 'mongodb://localhost/ts-node-meetup'),
      prod: 'mongodb://localhost/ts-node-meetup',
    },
  },
};
