# TP Connects Backend

## Getting Started

####  1) Create a .env file
####  2) Set the DB variables in the .env
###### MONGO_DEV_CONNECTION_STRING
###### MONGO_TEST_CONNECTION_STRING
###### MONGO_PRODUCTION_CONNECTION_STRING
####  3) Set the JWT variables in the .env
###### JWT_SECRET
###### JWT_ALGORITHM
###### JWT_REFRESH_ALGORITHM
###### JWT_REFRESH_SECRET
####  4) Run the below script to reset the DB
```bash
$ npm run resetDB
```
####  5) Run the below scripts which setup and start the server
```bash
$ npm run startup
$ npm start
```

