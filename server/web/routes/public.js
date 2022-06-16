'use strict';

const register = function (server, serverOptions) {

  server.route({
    method: 'GET',
    path: '/{param}',
    options: {
      auth: false
    },
    handler: {
      directory: {
        path: './dist/prod/',
        listing: true
      }
    }
  });
};

module.exports = {
  name: 'web-public',
  dependencies: ['inert'],
  register
};
