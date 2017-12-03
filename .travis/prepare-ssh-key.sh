openssl aes-256-cbc -K $encrypted_ce91012c77dd_key -iv $encrypted_ce91012c77dd_iv -in .travis/keys.tar.enc -out .travis/keys.tar -d
tar xfv .travis/keys.tar
chmod -R 600 .travis

eval "$(ssh-agent -s)" #start the ssh agent
ssh-add .travis/$KEY_FILENAME
ssh-keyscan corepoint.chromatin.ca >> ~/.ssh/known_hosts
