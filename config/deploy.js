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
}
