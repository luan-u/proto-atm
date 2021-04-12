# proto-atm
An API that simulates ATM operations. It was built using Express.js.

## Getting started
1. Clone this repo to a local directory.
2. On an instance of PostgreSQL, create the user `atm` and the database `atm_db`, granting its privileges to `atm` user.
3. Import the sample data into the database.
   
   `psql postgres://atm:r34WG7VcdfJvN4WplbWYHEk@localhost:5432/atm_db < sample_db.sql`

   You may edit the connection string to connect to a remote host and/or change user password.
   However, if you do so you must also edit the connection string in `src\controllers\db-controller.js`.

4. `npm install`
5. `node server.js`

After this, it is just executing requests.

## Endpoints

Please check `endpoints.md` for details.

## Automatic endpoint testing

1. `npm install mocha -g --save-dev`
2. `npm install chai request --save-dev`
3. Run `mocha` on project root directory

Before testing, ensure the database is populated and node server is running.

## TODO
- [x] Implement initial working version of API
- [x] Document API installation and usage
- [x] Implement automated tests
- [ ] Ensure safety on concurrent database operations
- [ ] Increase test coverage
- [ ] Get rid of stray TODOs across the codespace
- [ ] Add meaningful code comments
