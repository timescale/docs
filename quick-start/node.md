---
title: "Quick Start: Python and TimescaleDB"
excerpt: Get started with TimescaleDB for a Node.js application
keywords: [Node, node.js]
---

import Intro from "versionContent/_partials/_quickstart-intro.mdx";

# Node.js quick start

<Intro />

This quick start guide walks you through:

*   [Connecting to TimescaleDB][connect]
*   [Creating a relational table][create-table]
*   [Creating a hypertable][create-hypertable]
*   [Inserting data][insert]
*   [Executing a query][query]

## Prerequisites

Before you start, make sure you have:

*   Installed TimescaleDB. For more information, see the
    [installation documentation][install].
*   Installed [Node.js][node-install].
*   Installed the Node.js package manager [npm][npm-install].

<highlight type="cloud" header="Run all tutorials free" button="Try for free">
Your Timescale trial is completely free for you to use for the first
thirty days. This gives you enough time to complete all the tutorials and run
a few test projects of your own.
</highlight>

## Connect to TimescaleDB

In this section, you create a connection to TimescaleDB with a common Node.js
ORM (object relational mapper) called [Sequelize][sequelize-info].

<procedure>

<Collapsible heading="Connecting to TimescaleDB" headingLevel={3}>

1.  At the command prompt, initialize a new Node.js app:

    ```bash
    npm init -y
    ```

    This creates a `package.json` file in your directory, which contains all
    of the dependencies for your project. It looks something like this:

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

1.  Install Express.js:

    ```bash
    npm install express
    ```

1.  Create a simple web page to check the connection. Create a new file called
    `index.js`, with this content:

    ```java
    const express = require('express')
    const app = express()
    const port = 3000;

    app.use(express.json());
    app.get('/', (req, res) => res.send('Hello World!'))
    app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
    ```

1.  Test your connection by starting the application:

    ```bash
    node index.js
    ```

   In your web browser, navigate to `http://localhost:3000`. If the connection
   is successful, it shows "Hello World!"

1.  Add Sequelize to your project:

    ```bash
    npm install sequelize sequelize-cli pg pg-hstore
    ```

1.  Locate your TimescaleDB credentials and use them to compose a connection
   string for Sequelize.

    You'll need:

      *   password
      *   username
      *   host URL
      *   port
      *   database name

1.  Compose your connection string variable, using this format:

    ```java
    'postgres://user:pass@example.com:5432/dbname'
    ```

1.  Open the `index.js` file you created. Require Sequelize in the application,
    and declare the connection string:

    ```java
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

    Make sure you add the SSL settings in the `dialectOptions` sections. You
    can't connect to TimescaleDB using SSL without them.

1.  You can test the connection by adding these lines to `index.js` after the
    `app.get` statement:

    ```java
    sequelize.authenticate().then(() => {
        console.log('Connection has been established successfully.');
    }).catch(err => {
        console.error('Unable to connect to the database:', err);
    });
    ```

    Start the application on the command line:

    ```bash
    node index.js
    ```

    If the connection is successful, you'll get output like this:

    ```bash
    Example app listening at http://localhost:3000
    Executing (default): SELECT 1+1 AS result
    Connection has been established successfully.
    ```

</Collapsible>

</procedure>

## Create a relational table

In this section, you create a relational table called `page_loads`.

<procedure>

<Collapsible heading="Creating a relational table" headingLevel={3}>

1.  Use the Sequelize command line tool to create a table and model called `page_loads`:

    ```bash
    npx sequelize model:generate --name page_loads \
    --attributes userAgent:string,time:date
    ```

    The output looks similar to this:

    ```bash
    Sequelize CLI [Node: 12.16.2, CLI: 5.5.1, ORM: 5.21.11]

    New model was created at <PATH>.
    New migration was created at <PATH>.
    ```

1.  Edit the migration file so that it sets up a migration key:

    ```java
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

1.  Migrate the change and make sure that it is reflected in the database:

    ```bash
    npx sequelize db:migrate
    ```

    The output looks similar to this:

    ```bash
    Sequelize CLI [Node: 12.16.2, CLI: 5.5.1, ORM: 5.21.11]

    Loaded configuration file "config/config.json".
    Using environment "development".
    == 20200528195725-create-page-loads: migrating =======
    == 20200528195725-create-page-loads: migrated (0.443s)
    ```

1.  Create the `PageLoads` model in your code. In the `index.js` file, above the
    `app.use` statement, add these lines:

    ```java
    let PageLoads = sequelize.define('page_loads', {
        userAgent: {type: Sequelize.STRING, primaryKey: true },
        time: {type: Sequelize.DATE, primaryKey: true }
    }, { timestamps: false });
    ```

1.  Instantiate a `PageLoads` object and save it to the database.

</Collapsible>

</procedure>

## Create a hypertable

When you have created the relational table, you can create a hypertable.
Creating tables and indexes, altering tables, inserting data, selecting data,
and most other tasks are executed on the hypertable.

<procedure>

<Collapsible heading="Creating a hypertable" headingLevel={3}>

1.  Create a migration to modify the `page_loads` relational table, and change
    it to a hypertable by first running the following command:

    ```bash
    npx sequelize migration:generate --name add_hypertable
    ```

    The output looks similar to this:

    ```bash
    Sequelize CLI [Node: 12.16.2, CLI: 5.5.1, ORM: 5.21.11]

    migrations folder at <PATH> already exists.
    New migration was created at <PATH>/20200601202912-add_hypertable.js .
    ```

1.  In the `migrations` folder, there is now a new file. Open the
    file, and add this content:

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

1.  At the command prompt, run the migration command:

    ```bash
    npx sequelize db:migrate
    ```

    The output looks similar to this:

    ```bash
    Sequelize CLI [Node: 12.16.2, CLI: 5.5.1, ORM: 5.21.11]

    Loaded configuration file "config/config.json".
    Using environment "development".
    == 20200601202912-add_hypertable: migrating =======
    == 20200601202912-add_hypertable: migrated (0.426s)
    ```

</Collapsible>

</procedure>

## Insert rows of data

This section covers how to insert data into your hypertables.

<procedure>

<Collapsible heading="Inserting rows into TimescaleDB" headingLevel={3}>

## Insert rows into TimescaleDB

1.  In the `index.js` file, modify the `/` route to get the `user-agent` from
    the request object (`req`) and the current timestamp. Then, call the
    `create` method on `PageLoads` model, supplying the user agent and timestamp
    parameters. The `create` call executes an `INSERT` on the database:

    ```java
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

</Collapsible>

</procedure>

## Execute a query

This section covers how to execute queries against your database. In this
example, every time the page is reloaded, all information currently in the table
is displayed.

<procedure>

<Collapsible heading="Executing a query" headingLevel={3}>

1.  Modify the `/` route in the `index.js` file to call the Sequelize `findAll`
    function and retrieve all data from the `page_loads` table using the
    `PageLoads` model:

    ```java
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

</Collapsible>

</procedure>

[node-install]: https://nodejs.org
[npm-install]: https://www.npmjs.com/get-npm
[sequelize-info]: https://sequelize.org
[connect]: #connect-to-timescaledb
[create-table]: #create-a-relational-table
[create-hypertable]: #create-hypertable
[insert]: #insert-rows-of-data
[query]: #execute-a-query
[install]: /getting-started/latest/
