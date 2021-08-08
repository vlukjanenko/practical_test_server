# Practical test for fullstack javascript developer

## Author
Vladislav Lukyanenko <vlukjanenko@mail.ru>

## Requirements to lunch
- Nodejs
- npm
- Available connection to mongodb database
## How to run
Download __practical_test_server-master.zip__.

```
unzip -a practical_test_server-master.zip

cd practical_test_server-master

npm install --only=prod

```
___

By default application run on 3000 port and connect to mongodb in claud.
To change it edit file .env
```
DB_SRV=1
DB_HOST=cluster0.2qtsg.mongodb.net
DB_USER=vlad
DB_PASS=fL2FbWdH9zG3P6P
DB_NAME=practical

PORT=3000
```

For server

- PORT - localhost available port. Node server will use it

Database mongodb

- DB_SRV - use SRV record (leave blank if not)
- DB_HOST - host name where database is (leave blank for localhost)
- DB_USER - user name for database access (leave blank for unsecured access)
- DB_PASS - user password
- DB_NAME - db name (if blank nave will be "majosue_practical")
___

Frontend files are located in /public
- index.html
- styles.css
- main.js
___

## Run
```
node index.js
```
Then in browser go to (change  PORT to it`s value)
- localhost:PORT - for frontend
- localhost:PORT/api-docs - for Swagger doc

