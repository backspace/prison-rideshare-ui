echo env = $ENVIRONMENT and tld = $TLD

HOST=`echo $CLEANED_BRANCH_SUBDOMAIN`.test-deployments.barnonewpg.org
FULL_URL=https://`echo $HOST`

echo deployment url: $FULL_URL

if [[ $DEPLOYMENT_EXIT_CODE -eq 0 ]]
then
  ssh -t dokku@corepoint.chromatin.ca -- run rideshare-lightning dokku domains:add rideshare-lightning $HOST
  ssh -t dokku@corepoint.chromatin.ca -- run rideshare-lightning dokku letsencrypt rideshare-lightning

  curl -X POST \
       --data "{\"state\": \"success\", \"target_url\": \"$FULL_URL\", \"description\": \"Visit a $ENVIRONMENT deployment for this commit\", \"context\": \"deployments/$ENVIRONMENT\"}" \
       -H "Authorization: token $GITHUB_TOKEN" \
       https://api.github.com/repos/backspace/prison-rideshare-ui/statuses/$TRAVIS_PULL_REQUEST_SHA
else
  curl -X POST \
       --data "{\"state\": \"error\", \"description\": \"There was a failure with the PR deployment\", \"context\": \"deployments/$ENVIRONMENT\"}" \
       -H "Authorization: token $GITHUB_TOKEN" \
       https://api.github.com/repos/backspace/prison-rideshare-ui/statuses/$TRAVIS_PULL_REQUEST_SHA
fi
