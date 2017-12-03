KEY_FILENAME=deploy-lightning.key ./.travis/prepare-ssh-key.sh

export API_HOST=https://prison-rideshare-api-sandbox.corepoint.chromatin.ca/
export SOCKET_HOST=wss://prison-rideshare-api-sandbox.corepoint.chromatin.ca
npx ember deploy sandbox --activate
