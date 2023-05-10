---
title: About psql
excerpt: Connect to your database with the psql command line tool
products: [cloud, mst, self_hosted]
keywords: [connect, psql]
---

# About psql

The `psql` command line tool is widely used for interacting with a PostgreSQL or
Timescale instance, and it is available for all operating systems. Most of
the instructions in the Timescale documentation assume you are using `psql`.

To use `psql` to connect to your database, you need the connection details for
your PostgreSQL server. For more information about how to retrieve your
connection details, see the [about connecting][about-connecting] section.

## Connecting to your database with psql

There are two different ways you can use `psql` to connect to your database.

You can provide the details using parameter flags, like this:

```bash
psql -h <HOSTNAME> -p <PORT> -U <USERNAME> -W -d <DATABASENAME>
```

Alternatively, you can use a service URL to provide the details, like this:

```bash
psql postgres://<USERNAME>@<HOSTNAME>:<PORT>/<DATABASENAME>?sslmode=require
```

If you configured your Timescale service to connect using
[SSL mode][ssl-mode], use:

```bash
psql "postgres://tsdbadmin@<SERVICE_URL_WITH_PORT>/tsdb?sslmode=verify-full"
```

When you run one of these commands, you are prompted for your password. If you
don't want to prompted, you can supply your password directly within the service
URL instead, like this:

```bash
psql "postgres://<USERNAME>:<PASSWORD>@<HOSTNAME>:<PORT>/<DATABASENAME>?sslmode=require"
```

## Common psql commands

When you start using `psql`, these are the commands you are likely to use most
frequently:

|Command|Description|
|-|-|
|`\c <DB_NAME>`|Connect to a new database|
|`\d <TABLE_NAME>`|Show the details of a table|
|`\df`|List functions in the current database|
|`\df+`|List all functions with more details|
|`\di`|List all indexes from all tables|
|`\dn`|List all schemas in the current database|
|`\dt`|List available tables|
|`\du`|List PostgreSQL database roles|
|`\dv`|List views in current schema|
|`\dv+`|List all views with more details|
|`\dx`|Show all installed extensions|
|`ef <FUNCTION_NAME>`|Edit a function|
|`\h`|Show help on syntax of SQL commands|
|`\l`|List available databases|
|`\password <USERNAME>`|Change the password for the user|
|`\q`|Quit `psql`|
|`\set`|Show system variables list|
|`\timing`|Show how long a query took to execute|
|`\x`|Show expanded query results|
|`\?`|List all `psql` slash commands|

*   For a more comprehensive list of `psql` commands, see the
    [Timescale psql cheat sheet][psql-cheat-sheet].
*   For more information about all `psql` commands, see the
    [psql documentation][psql-docs].

### Save query results to a file

When you run queries in `psql`, the results are shown in the console by default.
If you are running queries that have a lot of results, you might like to save
the results into a comma-separated `.csv` file instead. You can do this using
the `COPY` command. For example:

```sql
\copy (SELECT * FROM ...) TO '/tmp/output.csv' (format CSV);
```

This command sends the results of the query to a new file called `output.csv` in
the `/tmp/` directory. You can open the file using any spreadsheet program.

### Edit queries in a text editor

Sometimes, queries can get very long, and you might make a mistake when you try
typing it the first time around. If you have made a mistake in a long query,
instead of retyping it, you can use a built-in text editor, which is based on
`Vim`. Launch the query editor with the `\e` command. Your previous query is
loaded into the editor. When you have made your changes, press `Esc`, then type
`:`＋`w`＋`q` to save the changes, and return to the command prompt. Access the
edited query by pressing `↑`, and press `Enter` to run it.

[about-connecting]: /use-timescale/:currentVersion:/connecting/about-connecting/
[psql-cheat-sheet]: https://postgrescheatsheet.com/
[psql-docs]: https://www.postgresql.org/docs/13/app-psql.html
[ssl-mode]: /use-timescale/:currentVersion:/security/strict-ssl/
