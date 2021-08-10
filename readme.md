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
Create .env file for application config
```
DB_SRV=
DB_HOST=
DB_USER=
DB_PASS=
DB_NAME=

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
Now you can run it
```
node index.js
```
___
Frontend files are located in /public
- index.html
- styles.css
- main.js
___

After successful run, in browser you can go to (change PORT to it`s value)
- localhost:PORT - for frontend
- localhost:PORT/api-docs - for Swagger doc

