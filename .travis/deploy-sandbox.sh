./.travis/prepare-ssh-key.sh

export API_HOST=https://prison-rideshare-api-sandbox.corepoint.chromatin.ca/
export SOCKET_HOST=wss://prison-rideshare-api-sandbox.corepoint.chromatin.ca
ember deploy sandbox --activate
