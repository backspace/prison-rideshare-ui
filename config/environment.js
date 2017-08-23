/* eslint-env node */
'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'prison-rideshare-ui',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    DS: {
     host: 'http://localhost:4000',
     namespace: ''
    },

    'ember-simple-auth': {
      authenticationRoute: 'login',
      routeAfterAuthentication: 'index'
    },

    sentry: {}
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV['ember-cli-mirage'] = {
      enabled: false
    };

    if (process.env.API_HOST) {
      ENV.DS.host = process.env.API_HOST;
    }
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';

    ENV.DS.namespace = 'api';
    ENV.DS.host = undefined;
  }

  if (environment === 'production') {
    if (process.env.SENTRY_DSN) {
      ENV.sentry = {
        dsn: process.env.SENTRY_DSN
      };
    }

    if (process.env.API_HOST) {
      ENV.DS.host = process.env.API_HOST;
    } else {
      ENV['ember-cli-mirage'] = {
        enabled: true
      };
    }
  }

  return ENV;
};
