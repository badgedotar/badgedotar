#!/bin/bash

# Get server list
set -f
string=$DEPLOY_IP	
array=(${string//,/ })

for i in "${!array[@]}"; do
  echo "Deploying backend server on ${array[$i]}"
  ssh -i ~/.ssh/id_rsa ubuntu@${array[i]} "export _APP_OPENSSL_KEY_V1=$_APP_OPENSSL_KEY_V1 && export _APP_LOGGING_CONFIG=$_APP_LOGGING_CONFIG && export _APP_DB_PASS=$_APP_DB_PASS && export _APP_DB_ROOT_PASS=$_APP_DB_ROOT_PASS && export _APP_EXECUTOR_SECRET=$_APP_EXECUTOR_SECRET && export DOCKERHUB_PULL_PASSWORD=$DOCKERHUB_PULL_PASSWORD && cd /home/ubuntu/badgear/badgedotar && git config --global user.name badgear && git config --global user.email gitlab@actions && git pull && cd backend_server && docker-compose --env-file ./.env up -d"
done
