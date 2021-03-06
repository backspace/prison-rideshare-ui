./.travis/prepare-ssh-key.sh

export CLEANED_BRANCH_SUBDOMAIN=`echo $TRAVIS_PULL_REQUEST_BRANCH | tr '.' '-' | tr '[:upper:]' '[:lower:]'`

export API_HOST=https://rideshare-api.barnonewpg.org
export SOCKET_HOST=wss://rideshare-api.barnonewpg.org
ember deploy pull-request-production --activate
DEPLOYMENT_EXIT_CODE=$? ENVIRONMENT=production ./.travis/update-github-status.sh
