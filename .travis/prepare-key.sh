openssl aes-256-cbc -K $encrypted_ce91012c77dd_key -iv $encrypted_ce91012c77dd_iv -in .travis/deploy.key.enc -out .travis/deploy.key -d
chmod 600 .travis/deploy.key # this key should have push access

eval "$(ssh-agent -s)" #start the ssh agent
ssh-add .travis/deploy.key
ssh-keyscan corepoint.chromatin.ca >> ~/.ssh/known_hosts
