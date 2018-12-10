./.travis/prepare-ssh-key.sh

export API_HOST=https://rideshare-api.barnonewpg.org
export SOCKET_HOST=wss://rideshare-api.barnonewpg.org
ember deploy sandbox --activate
