# Twitter Bot Management Tool

A simple management tool for the creation of twitter bots for research.

## Setup

Prerequites:
- Node.js
- Brew (*only for isntallation of MongoDB*)

Run `yarn install` (*only run yarn for windows*)

## Install MongoDB

* Install MongoDB by running
```brew install mongodb-community@4.4``` 

* To start Mongodb run 
```brew services start mongodb-community``` 

* To stop the mogodb process run
```brew services stop mongodb-community```

One can verify that MongDB is running with `ps aux | grep -v grep | grep mongod`

Run `yarn start` to start the app

