#!/bin/bash

# Get server list
set -f
string=$DEPLOY_IP	
array=(${string//,/ })

for i in "${!array[@]}"; do
  echo "Deploying cardano bridge on ${array[$i]}"
  ssh -i ~/.ssh/id_rsa ubuntu@${array[i]} "export COLLECTOR_ADDRESS=$COLLECTOR_ADDRESS && export IPFS_SECRET=$IPFS_SECRET && export IPFS_KEY=$IPFS_KEY && export APPWRITE_KEY=$APPWRITE_KEY && cd /home/ubuntu/badgear/badgedotar && git config --global user.name badgear && git config --global user.email gitlab@actions && git pull && cd cardano-bridge && docker-compose --env-file ./.env up --build -d"
done
