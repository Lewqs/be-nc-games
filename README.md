# Lewis' House of Games API

# [Link to hosted version](https://lewis-nc-games.onrender.com)

# Summary of API

This project is an API for a board game review application. Clients can view categories, users, reviews, and comments. Query requests are available to filter reviews by category or sort them by review_id, title, owner, category, created_at, votes or comment_count. You can also order them by ascending or descending. Endpoints also exist for updating votes on reviews and deleting comments by ID; New and edited reviews can be added/updated to the database.

---

# Cloning this repository

Clone the repository to your local machine with the following command:

```sh
git clone https://github.com/Lewqs/Lewis-be-nc-games.git
```

---

# INSTALL DEPENDENCIES

You can download the dependencies from the package.json by entering the following command in the terminal:

```
npm install
```

# Setup Development & Test Environments

You'll need to create two .env files to determine when we are using the development or test databases! You can use the following commands in the root directory:

```sh
echo 'PGDATABASE=nc_games' >> .env.development
echo 'PGDATABASE=nc_games_test' >> .env.test
```

# SEED THE LOCAL DATABASE

The package.json file contains the following scripts:

```json
"setup-dbs": "psql -f ./db/setup.sql",
"seed": "node ./db/seeds/run-seed.js",
```

Run the scripts in this order and it will create and seed the database:

```
npm run setup-dbs
npm run seed
```

---

You can enable the testing suite and check if you set it up correctly by entering the following command:

```
npm run test
```

---

# Dependencies

Below are the list of dependencies installed from the package.json:

```
dotenv
express
pg
```

Dev Dependencies:

```
husky
jest
jest-extended
jest-sorted
pg-format
supertest
```

---

# Minimum versions

```
Node: v19.1.0
NPM: v8.19.3
Postgres: v14.5
```
