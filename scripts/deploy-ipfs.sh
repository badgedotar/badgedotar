#!/bin/bash

# Get server list
set -f
string=$DEPLOY_IP	
array=(${string//,/ })

for i in "${!array[@]}"; do
  echo "Deploying IPFS on ${array[$i]}"
  ssh -i ~/.ssh/id_rsa ubuntu@${array[i]} "cd /home/ubuntu/badgear/badgedotar && git config --global user.name badgear && git config --global user.email gitlab@actions && git pull && cd ipfs-clister-ctl && docker-compose --env-file ./.env up -d"
done
