./.travis/prepare-ssh-key.sh

export CLEANED_BRANCH_SUBDOMAIN=`echo $TRAVIS_PULL_REQUEST_BRANCH | tr '.' '-' | tr '[:upper:]' '[:lower:]'`

export API_HOST=https://prison-rideshare-api.corepoint.chromatin.ca/
export SOCKET_HOST=wss://prison-rideshare-api.corepoint.chromatin.ca
ember deploy production --activate
DEPLOYMENT_EXIT_CODE=$? ENVIRONMENT=production ./.travis/deployment/update-github-status.sh

export API_HOST=https://prison-rideshare-api-sandbox.corepoint.chromatin.ca/
export SOCKET_HOST=wss://prison-rideshare-api-sandbox.corepoint.chromatin.ca
ember deploy sandbox --activate
DEPLOYMENT_EXIT_CODE=$? ENVIRONMENT=sandbox ./.travis/deployment/update-github-status.sh