'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const deployTarget = process.env.DEPLOY_TARGET;

  let autoImport = {};
  let fingerprint = {};

  if (deployTarget) {
    const s3Bucket = require('./config/deploy')(process.env.DEPLOY_TARGET).s3
      .bucket;

    autoImport.publicAssetURL = `//${s3Bucket}.s3.amazonaws.com/assets/`;
    fingerprint.prepend = `//${s3Bucket}.s3.amazonaws.com/`;
  }

  let app = new EmberApp(defaults, {
    autoImport,
    babel: {
      plugins: [
        require.resolve('ember-concurrency/async-arrow-task-transform'),
        ...require('ember-cli-code-coverage').buildBabelPlugin(),
      ],
    },
    fingerprint,
    sourcemaps: {
      enabled: true,
    },
    emberHighCharts: {
      includeHighCharts: true,
      includeModules: ['heatmap'],
    },
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
