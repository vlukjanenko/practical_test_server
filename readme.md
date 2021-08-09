# Practical test for fullstack javascript developer

## Author
Vladislav Lukyanenko <vlukjanenko@mail.ru>

## Requirements to lunch
- Internet connection
- Nodejs
- npm
- Available connection to mongodb database
## How to run
Open terminal in project directory and install dependencies with command
```
npm install --only=prod
```
Now you can run it with default application port 3000 and connection to mongodb in cloud
```
node index.js
```
___

To change PORT and database connection edit file .env
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
- DB_NAME - db name (if blank name will be "majosue_db")
___

Frontend files are located in /public
- index.html
- styles.css
- main.js
___

After successful run, in browser you can go to (change PORT to it`s value)
- localhost:PORT - for frontend
- localhost:PORT/api-docs - for Swagger doc

