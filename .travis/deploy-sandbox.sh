./.travis/prepare-ssh-key.sh

git remote add deploy dokku@corepoint.chromatin.ca:prison-rideshare-sandbox
git config --global push.default simple
git push deploy primary
