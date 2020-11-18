<div align='center'>
  <h1>GrapeChats</h1>


GrapeChats is a chat application made with node , graphql , apollo , postgresql and react.....

[Live Preview](https://grape-chats.web.app)

</div>


<br/>

## Running The project locally

To run the project locally , u must have node and npm installed in your machine
You would also need a postgres server running on your machine or an postgresql database hoisted on the internet

then on the root folder , run 
```bash
npm install
```
then go to the client folder and again run
```bash
npm install
```
This will install all dependencies,

Before running the server , you must configure the database 

For this just go to config folder on the root of the project , there open config.json , it should initially look like this

```json
{
  "development": {
    "username": "postgres",
    "password": "root",
    "database": "chat",
    "host": "127.0.0.1",
    "port": "5432",
    "dialect": "postgres"
  },
  "test": {
    "username": "postgres",
    "password": "root",
    "database": "chat",
    "host": "127.0.0.1",
    "port": "5432",
    "dialect": "postgres"
  },
  "production": {
    "username": "postgres",
    "password": "root", 
    "database": "chat",
    "host": "127.0.0.1",
    "port": "5432",
    "dialect": "postgres",
    "operatorsAliases": false,
    "use_env_variable": "DATABASE_URL"
  }
}
```

change the file according to your needs , if you want you can use other sql dms like mysql , mariadb etc..

More info on config.json [here](https://sequelize.org/master/manual/migrations.html)

You then need to install sequelize cli , and run migrations

to install sequelize cli , just run

```bash
npm install -g sequelize-cli
```
Then to run migrations and seed database , on the root folder run

```bash
sequelize db:migrate

sequelize db:seed:all
```
Now you should be able to run the server , on the root folder of the project , run

```bash
npm start
```

This will spin up the graphql server on port 4000

Now go to the client folder and run

```bash
npm start
```

This will open the browser and start react application on port 3000

## Future Scope

* adding file uploads and sending files
* group chat
* editing user data