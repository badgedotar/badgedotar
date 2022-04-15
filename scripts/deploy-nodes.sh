#!/bin/bash

# Get server list
set -f
string=$DEPLOY_IP	
array=(${string//,/ })

for i in "${!array[@]}"; do
  echo "Deploying cardano node on ${array[$i]}"
  ssh ubuntu@${array[i]} "cd /home/ubuntu/badgear/badgear && git config --global user.name \"badgear\" && git config --global user.email gabmetal@hotmail.es && git pull && cd cardano_nodes && docker-compose up -d"
done
