#!/usr/bin/env bash

# Run development commands when NODE_ENV is development
if [[ ${NODE_ENV} = "development" ]]
then
  # when the api needs to connect to the database generated by docker_compose support, use wait-for-it.sh. Example
  # ./wait-for-it.sh ${DB_HOST}:${DB_PORT} --timeout=45 -- npx sequelize db:migrations
  # Replace "npx sequelize db:migrations" for others commands used by your api.
fi

exec "$@"