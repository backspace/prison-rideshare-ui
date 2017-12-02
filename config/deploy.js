var VALID_DEPLOY_TARGETS = [
  'production',
  'sandbox',
];

module.exports = function(deployTarget) {
  var ENV = {
    build: {
      environment: 'production'
    },
    redis: {
      allowOverwrite: true,
      keyPrefix: process.env.CLEANED_BRANCH_SUBDOMAIN,
      host: 'localhost',
      password: process.env.REDIS_PASSWORD
    },
    s3: {
      bucket: `rideshare-lightning-${deployTarget}`,
      region: 'us-east-1',
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET
    },
    'ssh-tunnel': {
      username: 'ubuntu',
      host: 'corepoint.chromatin.ca',
      privateKeyPath: '.travis/deploy-lightning.key',
      dstPort: 6699
    }
  };
  if (VALID_DEPLOY_TARGETS.indexOf(deployTarget) === -1) {
    throw new Error('Invalid deployTarget ' + deployTarget);
  }

  return ENV;

  /* Note: a synchronous return is shown above, but ember-cli-deploy
   * does support returning a promise, in case you need to get any of
   * your configuration asynchronously. e.g.
   *
   *    var Promise = require('ember-cli/lib/ext/promise');
   *    return new Promise(function(resolve, reject){
   *      var exec = require('child_process').exec;
   *      var command = 'heroku config:get REDISTOGO_URL --app my-app-' + deployTarget;
   *      exec(command, function (error, stdout, stderr) {
   *        ENV.redis.url = stdout.replace(/\n/, '').replace(/\/\/redistogo:/, '//:');
   *        if (error) {
   *          reject(error);
   *        } else {
   *          resolve(ENV);
   *        }
   *      });
   *    });
   *
   */
}
