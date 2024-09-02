# Shoppe #
## online shop using Node and PostgreSQL ##

- set DB and server details in .env (see .env.example)
- set path to server in client's serverPath.js

### Node modules used (backend): ###
- express for the server, also:
  - dotenv
  - cors
  - body-parser
  - express-session
- passport for user account functionality
- bcrypt for password hashing
- pg for database interactions
- stripe for payment
- google-auth-library for Login With Google

### Node modules used (frontend): ###
- React
- React Redux
- Redux Toolkit
- React Router v6

### to run the application ###
in shoppe:
> node app.js

in shoppe-client:
> npm start