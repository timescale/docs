---
title: "Quick Start: Node.js and TimescaleDB"
excerpt: Get started with TimescaleDB for a Node.js application
keywords: [Node.js]
---

# Quick Start: Node and TimescaleDB

## Goal

This quick start guide is designed to get the Node.js developer up
and running with TimescaleDB as their database. In this tutorial,
you'll learn how to:

*   [Connect to TimescaleDB](#connect-node-to-timescaledb)
*   [Create a relational table](#create-a-relational-table)
*   [Generate a Hypertable](#generate-hypertable)
*   [Insert a batch of rows into your Timescale database](#insert-rows-into-timescaledb)
*   [Execute a query on your Timescale database](#execute-a-query)

## Prerequisites

To complete this tutorial, you need a cursory knowledge of the Structured Query
Language (SQL). The tutorial walks you through each SQL command, but it is
helpful if you've seen SQL before.

To start, [install TimescaleDB][install-timescale]. Once your installation is complete,
we can proceed to ingesting or creating sample data and finishing the tutorial.

Obviously, you need to [install Node][node-install] and the
[Node Package Manager (npm)][npm-install] as well.

## Connect Node to TimescaleDB

TimescaleDB is based on PostgreSQL and we can use common PostgreSQL tools to connect
your Node app to the database. This example uses a common Node.js
Object Relational Mapper (ORM) called [Sequelize][sequelize-info].

### Step 1: Create your Node app

Let's initialize a new Node app. From your command line, type the following:

```bash
npm init -y
```

This creates a `package.json` file in your directory, which contains all
of the dependencies for your project:

```json
{
  "name": "node-sample",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

Now, let's install Express.js by running the following command:

```bash
npm install express
```

Finally, let's create a simple web page to display a greeting. Open your
code editor, and add the following to a file called `index.js`:

```javascript
const express = require('express')
const app = express()
const port = 3000;

app.use(express.json());
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
```

You can test your simple application by running the following from your
command line and using your browser to view <http://localhost:3000>:

```bash
node index.js
```

You should get a "Hello, World" greeting.

### Step 2: Configure the TimescaleDB database using Sequelize

Locate your TimescaleDB credentials in order to connect to your TimescaleDB instance.

You'll need the following credentials:

*   password
*   username
*   host URL
*   port
*   database name

Now, let's add Sequelize to our project by first installing it (and its command
line interface) and the packages for PostgreSQL from the command line:

```bash
npm install sequelize sequelize-cli pg pg-hstore
```

Now let's go back to our `index.js` file and require Sequelize in our application.
You'll need your TimescaleDB credentials in order to build the connection URL
as well. Once you have that information, add the following to `index.js`, below
the other `const` statements:

```javascript
const Sequelize = require('sequelize')
const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname',
    {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    })
```

<Highlight type="warning">
Note the settings in `dialectOptions`. These are critical in connecting to a TimescaleDB instance via SSL.
</Highlight>

We can test this connection by adding the following to `index.js` after the `app.get` statement:

```javascript
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
```

Once again, start the application on the command line:

```bash
node index.js
```

And you should get the following results:

```bash
Example app listening at http://localhost:3000
Executing (default): SELECT 1+1 AS result
Connection has been established successfully.
```

## Create a relational table

### Step 1: Add TimescaleDB to your Node configuration

Now that we have a successful connection to the `defaultdb` database, we
can build out our first database and model.

<Highlight type="warning">
You can skip the first two steps if you're going to use TimescaleDB cloud. The
service creates a database with the extension already enabled.
</Highlight>

Let's initialize Sequelize and create the necessary configuration files for our
project. From the command line, type the following:

```bash
npx sequelize init
```

This creates a `config/config.json` file in your project. You need to
modify it with the connection details we tested earlier. For the remainder of
this application, we'll use a database called `node_test`. Here's a full example
file. Again, note the `dialectOptions`.

```json
{
  "development": {
    "username": "[tsdbadmin]",
    "password": "[your_password]",
    "database": "node_test",
    "host": "[your_host]",
    "port": "[your_port]",
    "dialect": "postgres",
    "protocol": "postgres",
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    }
  },
  "test": {
    "username": "tsdbadmin",
    "password": "your_password",
    "database": "node_test",
    "host": "your_host",
    "port": "your_port",
    "dialect": "postgres",
    "protocol": "postgres",
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    }
  },
  "production": {
    "username": "tsdbadmin",
    "password": "your_password",
    "database": "node_test",
    "host": "your_host",
    "port": "your_port",
    "dialect": "postgres",
    "protocol": "postgres",
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    }
}
```

Now you're ready to create the `node_test` database. From the command line, type
the following:

```bash
npx sequelize db:create
```

You should get this result:

```bash
Loaded configuration file "config/config.json".
Using environment "development".
Database node_test created.
```

### Step 2: Add the TimescaleDB extension to the database

TimescaleDB is delivered as a PostgreSQL extension. Some instances and versions
of TimescaleDB already have the extension installed. Let's make sure the
extension is installed if it's not.

To start, create a database migration by running the following command:

```bash
npx sequelize migration:generate --name add_tsdb_extension
```

There is a file that has the name `add_tsdb_extension` appended to it in
your `migrations` folder. Modify that file to look like this:

```javascript
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;");
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("DROP EXTENSION timescaledb;");
  }
};
```

Now run the migration command from the command-line:

```bash
npx sequelize db:migrate
```

You should get the following result:

```bash
Sequelize CLI [Node: 12.16.2, CLI: 5.5.1, ORM: 5.21.11]

Loaded configuration file "config/config.json".
Using environment "development".
== 20200601214455-add_tsdb_extension: migrating =======
== 20200601214455-add_tsdb_extension: migrated (0.414s)
```

You can test and see if the TimescaleDB extension is installed by connecting
to your database [using `psql`][setup-psql] and running the `\dx`
command. You should get a result like this:

```bash
                                      List of installed extensions
    Name     | Version |   Schema   |                            Description                            
-------------+---------+------------+-------------------------------------------------------------------
 plpgsql     | 1.0     | pg_catalog | PL/pgSQL procedural language
 timescaledb | 1.7.1   | public     | Enables scalable inserts and complex queries for time-series data
(2 rows)
```

### Step 3: Create a table

Now let's create a table and model called `page_loads` for our database
using the Sequelize command line tool:

```bash
npx sequelize model:generate --name page_loads --attributes userAgent:string,time:date
```

You should get a result similar to this:

```bash
Sequelize CLI [Node: 12.16.2, CLI: 5.5.1, ORM: 5.21.11]

New model was created at [some path here] .
New migration was created at [some path here] .
```

Now, edit the migration file to make sure it sets up a composite primary key:

```javascript
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('page_loads', {
      userAgent: {
        primaryKey: true,
        type: Sequelize.STRING
      },
      time: {
        primaryKey: true,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('page_loads');
  }
};
```

And finally, let's migrate our change and ensure that it is reflected in the
database itself:

```bash
npx sequelize db:migrate
```

You should get a result that looks like this:

```bash
Sequelize CLI [Node: 12.16.2, CLI: 5.5.1, ORM: 5.21.11]

Loaded configuration file "config/config.json".
Using environment "development".
== 20200528195725-create-page-loads: migrating =======
== 20200528195725-create-page-loads: migrated (0.443s)
```

### Step 4: Create a model for the table

With the `node_test` database created and a `page_loads` table configured
with a proper schema, we are ready to create the `PageLoads` model in our
code. A model is an abstraction on the data stored in the table.

Above our `app.use` statement, add the following to `index.js`:

```javascript
let PageLoads = sequelize.define('page_loads', {
    userAgent: {type: Sequelize.STRING, primaryKey: true },
    time: {type: Sequelize.DATE, primaryKey: true }
}, { timestamps: false });
```

You can now instantiate a `PageLoads` object and save it to the
database.

## Generate hypertable

In TimescaleDB, the primary point of interaction with your data is a [hypertable][hypertables],
the abstraction of a single continuous table across all space and time
intervals, such that one can query it via standard SQL.

Virtually all user interactions with TimescaleDB are with hypertables. Creating tables
and indexes, altering tables, inserting data, selecting data, etc. can (and should)
all be executed on the hypertable.

A hypertable is defined by a standard schema with column names and types, with at
least one column specifying a time value.

<Highlight type="tip">
The TimescaleDB documentation on [schema management and indexing](/timescaledb/latest/how-to-guides/schema-management/indexing) explains this in further detail.
</Highlight>

Let's create this migration to modify the `page_loads` table and create a
hypertable by first running the following command:

```bash
npx sequelize migration:generate --name add_hypertable
```

You should get a result that looks like this:

```bash
Sequelize CLI [Node: 12.16.2, CLI: 5.5.1, ORM: 5.21.11]

migrations folder at [some_path] already exists.
New migration was created at [some_path]/]20200601202912-add_hypertable.js .
```

And there should now be a file in your `migrations` folder that we can modify
to look like the following:

```js
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("SELECT create_hypertable('page_loads', 'time');");
  },

  down: (queryInterface, Sequelize) => {
  }
};
```

Now run the migration command from the command-line:

```bash
npx sequelize db:migrate
```

You should get the following result:

```bash
Sequelize CLI [Node: 12.16.2, CLI: 5.5.1, ORM: 5.21.11]

Loaded configuration file "config/config.json".
Using environment "development".
== 20200601202912-add_hypertable: migrating =======
== 20200601202912-add_hypertable: migrated (0.426s)
```

## Insert rows into TimescaleDB

Now you have a working connection to your database, a table configured with
the proper schema, and a hypertable created to more efficiently query data
by time. Let's add data to the table.

In the `index.js` file, modify the `/` route like so to first get the
`user-agent` from the request object (`req`) and the current timestamp. Then,
call the `create` method on our model (`PageLoads`), supplying
the user agent and timestamp parameters. The `create` call executes
an `INSERT` on the database:

```javascript
app.get('/', async (req, res) => {
    // get the user agent and current time
    const userAgent = req.get('user-agent');
    const time = new Date().getTime();

    try {
        // insert the record
        await PageLoads.create({
            userAgent, time
        });

        // send response
        res.send('Inserted!');
    } catch (e) {
        console.log('Error inserting data', e)
    }
})
```

## Execute a query

Each time the page is reloaded, we also want to display all information
currently in the table.

To do this, modify the `/` route in our `index.js` file
to call the Sequelize `findAll` function and retrieve all data from the
`page_loads` table via the `PageLoads` model, like so:

```javascript
app.get('/', async (req, res) => {
    // get the user agent and current time
    const userAgent = req.get('user-agent');
    const time = new Date().getTime();

    try {
        // insert the record
        await PageLoads.create({
            userAgent, time
        });

        // now display everything in the table
        const messages = await PageLoads.findAll();
        res.send(messages);
    } catch (e) {
        console.log('Error inserting data', e)
    }
})
```

Now, when you reload the page, you should see all of the rows currently in the
`page_loads` table.

## Next steps

Now that you're able to connect, read, and write to a TimescaleDB instance from your
Node application, be sure to check out these advanced TimescaleDB tutorials:

*   [Time Series Forecasting using TimescaleDB, R, Apache MADlib and Python][time-series-forecasting]
*   [Continuous Aggregates][continuous-aggregates]
*   [Try Other Sample Datasets][other-samples]
*   [Migrate your own Data][migrate]

[continuous-aggregates]: /getting-started/:currentVersion:/create-cagg/
[hypertables]: /timescaledb/:currentVersion:/overview/core-concepts/
[install-timescale]: /install/latest/
[migrate]: /timescaledb/:currentVersion:/how-to-guides/migrate-data/
[node-install]: https://nodejs.org
[npm-install]: https://www.npmjs.com/get-npm
[other-samples]: /timescaledb/:currentVersion:/tutorials/sample-datasets/
[sequelize-info]: https://sequelize.org
[setup-psql]: /timescaledb/:currentVersion:/how-to-guides/connecting/psql/
[time-series-forecasting]: /timescaledb/:currentVersion:/tutorials/time-series-forecast/
