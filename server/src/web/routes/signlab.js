'use strict';

/**
 * This route handles exposing the SignLab UI. This will expose the
 * compiled Angular application including the main HTML, Javascript,
 * and CSS.
 */
const register = function (server, _serverOptions) {

  // Redirect the root to the compiled index.html
  server.route({
    method: 'GET',
    path: '/',
    options: {
      auth: false
    },
    handler: (_request, reply) => {
      return reply.redirect(`index.html`);
    }
  });

  server.route({
    method: 'GET',
    path: '/admin',
    options: {
      auth: false
    },
    handler: (_request, reply) => {
      return reply.redirect(`index.html`);
    }
  });

  server.route({
    method: 'GET',
    path: '/auth',
    options: {
      auth: false
    },
    handler: (_request, reply) => {
      return reply.redirect(`index.html`);
    }
  });

  // The Angular resources (Javascript, css, etc)
  server.route({
    method: 'GET',
    path: '/{param}',
    options: {
      auth: false
    },
    handler: {
      directory: {
        path: '../dist/prod/',
        listing: true
      }
    }
  });
};

module.exports = {
  name: 'web-signlab',
  dependencies: ['@hapi/inert'],
  register
};
