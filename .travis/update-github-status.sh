echo env = $ENVIRONMENT and tld = $TLD

FULL_URL=https://`echo $CLEANED_BRANCH_SUBDOMAIN`.test-deployments.barnonewpg.org

echo deployment url: $FULL_URL

if [[ $DEPLOYMENT_EXIT_CODE -eq 0 ]]
then
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
