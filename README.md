# Setup Development & Test Environments

## You'll need to create two .env files to determine when we are using the development or test databases! You can use the following commands in the root directory:
```
$ echo 'PGDATABASE=nc_games' >> .env.development
$ echo 'PGDATABASE=nc_games_test' >> .env.test
```