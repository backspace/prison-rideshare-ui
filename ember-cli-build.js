'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = async function (defaults) {
  const { setConfig } = await import('@warp-drive/build-config');
  const deployTarget = process.env.DEPLOY_TARGET;

  let autoImport = {};
  let fingerprint = {};

  if (deployTarget) {
    const s3Bucket = require('./config/deploy')(process.env.DEPLOY_TARGET).s3
      .bucket;

    autoImport.publicAssetURL = `//${s3Bucket}.s3.amazonaws.com/assets/`;
    fingerprint.prepend = `//${s3Bucket}.s3.amazonaws.com/`;
  }

  const app = new EmberApp(defaults, {
    autoImport,
    babel: {
      plugins: [
        require.resolve('decorator-transforms'),
        require.resolve('ember-concurrency/async-arrow-task-transform'),
      ],
    },
    'ember-cli-babel': {
      disableDecoratorTransforms: true,
    },
    fingerprint,
    minifyCSS: {
      enabled: false,
    },
    sourcemaps: {
      enabled: true,
    },
    emberHighCharts: {
      includeHighCharts: true,
      includeModules: ['heatmap'],
    },
    sassOptions: {
      precision: 4,
      includePaths: [
        './node_modules/@hashicorp/design-system-tokens/dist/products/css',
        './node_modules/@hashicorp/design-system-components/dist/styles',
      ],
    },
  });

  setConfig(app, __dirname, {
    deprecations: {
      DEPRECATE_TRACKING_PACKAGE: false,
    },
  });

  return app.toTree();
};
