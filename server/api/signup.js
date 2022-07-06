'use strict';
const Boom = require('boom');
const Config = require('../../config');
const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');
const Session = require('../models/session');
const User = require('../models/user');
const Mailer = require('../mailer');

const register = function (server, options) {

  server.route({
    method: 'POST',
    path: '/api/signup',
    options: {
      tags: ['api','auth'],
      description: 'Sign up for a new user account.',
      auth: false,
      validate: {
        payload: User.payload
      },
      pre: [{
        assign: 'usernameCheck',
        method: async function (request, h) {

          const user = await User.findByUsername(request.payload.username);

          if (user) {

            throw Boom.conflict('Username already in use.');
          }

          return h.continue;
        }
      }, {
        assign: 'emailCheck',
        method: async function (request, h) {

          const user = await User.findByEmail(request.payload.email);

          if (user) {

            throw Boom.conflict('Email already in use.');
          }

          return h.continue;
        }
      },{
        assign: 'passwordCheck',
        method: async function (request, h) {

          const complexityOptions = Config.get('/passwordComplexity');

          const complexityCheck = (new PasswordComplexity(complexityOptions)).validate(request.payload.password);
          if(complexityCheck.error) {
           throw Boom.conflict('Password does not meet complexity standards');
          }
          return h.continue;
        }
      }]
    },
    handler: async function (request, h) {

      const username = request.payload.username;
      const password = request.payload.password;
      const email = request.payload.email;
      const name = request.payload.name;

      // create and link account and user documents
      const user = await User.create(username, password, email, name);
      const emailOptions = {
        subject: 'Your ' + Config.get('/projectName') + ' account',
        to: {
          name: request.payload.name,
          ddress: request.payload.email
        }
      };

      try {
        await Mailer.sendEmail(emailOptions, 'welcome', request.payload);
      }
      catch (err) {
        request.log(['mailer', 'error'], err);
      }

      // create session
      const userAgent = request.headers['user-agent'];
      const ip = request.headers['x-forwarded-for'] || request.info.remoteAddress;

      const doc = {
        userId: user._id.toString(),
        ip,
        userAgent
      };
      const session = await Session.create(doc);

      const credentials = session._id + ':' + session.key;
      const authHeader = 'Basic ' + Buffer.from(credentials).toString('base64');

      //request.cookieAuth.set(session);
      const result = {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          roles: user.roles
        },
        session,
        authHeader
      };

      return result;
    }
  });

  /**
   * Get the requirements for signup. This currently is the complexity of
   * the password which is required.
   */
  server.route({
    method: 'GET',
    path: '/api/signup/requirements',
    options: {
      tags: ['api','auth'],
      description: 'Get the signup requirements',
      auth: false,
    },
    handler: (_request, _h) => {
      return Config.get('/passwordComplexity');
    }
  });

  /**
   * Get if the given username is available
   */
  server.route({
    method: 'GET',
    path: '/api/signup/available',
    options: {
      description: 'Find out if the given email and username is available',
      auth: false,
      validate: {
        query: Joi.object({
          username: Joi.string(),
          email: Joi.string()
        })
      },
    },
    handler: async function (request, _h) {
      const usernameAvailable = (await User.findOne({ username: request.query.username })) == null;
      const emailAvailable = (await User.findOne({ email: request.query.email })) == null;
      return {
        username: usernameAvailable,
        email: emailAvailable
      };
    }
  });
};

module.exports = {
  name: 'signup',
  dependencies: [
    'hapi-anchor-model',
    'auth'
  ],
  register
};
