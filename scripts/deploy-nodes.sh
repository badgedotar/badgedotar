#!/bin/bash

# Get server list
set -f
string=$DEPLOY_IP	
array=(${string//,/ })

for i in "${!array[@]}"; do
  echo "Deploying cardano node on ${array[$i]}"
  ssh -i ~/.ssh/id_rsa ubuntu@${array[i]} "cd /home/ubuntu/badgear/badgedotar && git config --global user.name \"badgear\" && git config --global user.email gitlab@actions && git pull && cd cardano-nodes && docker-compose up -d"
done
