var VALID_DEPLOY_TARGETS = [
  'production',
  'sandbox',
  'pull-request-production',
  'pull-request-sandbox',
];

module.exports = function(deployTarget) {
  var ENV = {
    build: {
      environment: 'production',
    },
    redis: {
      allowOverwrite: true,
      host: 'localhost',
      password: process.env.REDIS_PASSWORD,
      port: 6699,
    },
    s3: {
      bucket: `prison-rideshare-${deployTarget}`,
      region: 'us-east-1',
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET,
    },
    'ssh-tunnel': {
      username: 'ubuntu',
      host: 'corepoint.chromatin.ca',
      privateKeyPath: '.travis/deploy-lightning.key',
      dstPort: 6699,
    },
  };
  if (VALID_DEPLOY_TARGETS.indexOf(deployTarget) === -1) {
    throw new Error('Invalid deployTarget ' + deployTarget);
  }

  if (deployTarget === 'production' || deployTarget === 'sandbox') {
    ENV.redis.keyPrefix = deployTarget;
  } else {
    ENV.redis.keyPrefix = process.env.CLEANED_BRANCH_SUBDOMAIN;
  }

  return ENV;
};
