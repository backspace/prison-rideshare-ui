openssl aes-256-cbc -K $encrypted_ce91012c77dd_key -iv $encrypted_ce91012c77dd_iv -in .travis/$KEY_FILENAME.enc -out .travis/$KEY_FILENAME -d
chmod 600 .travis/$KEY_FILENAME # this key should have push access

eval "$(ssh-agent -s)" #start the ssh agent
ssh-add .travis/$KEY_FILENAME
ssh-keyscan corepoint.chromatin.ca >> ~/.ssh/known_hosts
