#!/bin/bash

STACK_ID="$1"
VERSION="$2"

if [ -z "$STACK_ID" ]
then
      echo "You have to provide STACK_ID as first argument."
      exit 1
fi

if [ -z "$VERSION" ]
then
      echo "You have to provide VERSION as second argument."
      exit 1
fi

echo "Login: $PORTAINER_LOGIN"
echo "Password: $PORTAINER_PASSWORD"
payload=$(echo "{\"username\": \"$PORTAINER_LOGIN\",\"password\": \"$PORTAINER_PASSWORD\"}")
json=$(curl --silent --location --request POST 'https://portainer.beta.envoys.vision/api/auth' -H 'Content-Type: application/json' -d "$payload")

echo "Result: ${json}"
if [[ ${json} != *"jwt"* ]];then
      echo "Authorization failed. Exit."
      exit 1
fi

echo "Authorization success. Start deploying version '$VERSION' to stack: $STACK_ID"
TOKEN=$(echo $json | sed "s/{.*\"jwt\":\"\([^\"]*\).*}/\1/g")
deploy=$(echo "{\"env\":[{\"name\":\"VERSION\",\"value\":\"$VERSION\"}],\"prune\":true,\"RepositoryReferenceName\":\"refs/heads/develop\",\"RepositoryAuthentication\":true,\"RepositoryUsername\":\"$REPOSITORY_LOGIN\",\"RepositoryPassword\":\"$REPOSITORY_PASSWORD\"}")
curl --silent --location --request PUT "https://portainer.beta.envoys.vision/api/stacks/$STACK_ID/git/redeploy?endpointId=1" \
-H 'Content-Type: application/json' -H "Authorization: Bearer $TOKEN" -d "$deploy"
