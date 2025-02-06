---
title: Connect to a Timescale Cloud service with psql 
excerpt: Install the psql client for PostgreSQL and connect to your service 
products: [cloud, mst, self_hosted]
keywords: [connect, psql]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Connect with psql

[`psql`][psql-docs] is a terminal-based frontend to PostgreSQL that enables you to type in queries interactively, issue them to Postgres, and see the query results. 

This page shows you how to use the `psql` command line tool to interact with your $SERVICE_LONG.

## Prerequisites

<IntegrationPrereqs />

## Check for an existing installation

On many operating systems, `psql` is installed by default. To use the functionality described in this page, best practice is to use the latest version of `psql`. To check the version running on your system:

<Terminal>
    
<tab label='Linux/MacOS'>
    

```bash
psql --version
```
    
</tab>
    
<tab label="Windows">

    
```powershell
wmic
/output:C:\list.txt product get name, version
```

</tab>
    
</Terminal>

If you already have the latest version of `psql` installed, proceed to the [Connect to your $SERVICE_SHORT][connect-database] section. 

## Install psql

If there is no existing installation, take the following steps to install `psql`:
    
<Tabs label="Install psql">
    
<Tab title="MacOS Homebrew">

Install using Homebrew. `libpqxx` is the official C++ client API for PostgreSQL.

<Procedure>

1. Install Homebrew, if you don't already have it:

    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```

    For more information about Homebrew, including installation instructions, see the [Homebrew documentation][homebrew].
 
1. Make sure your Homebrew repository is up to date:

    ```bash
    brew doctor
    brew update
    ```

1. Install `psql`:

    ```bash
    brew install libpq
    ```

1. Update your path to include the `psql` tool:

    ```bash
    brew link --force libpq
    ```

On Intel chips, the symbolic link is added to `/usr/local/bin`. On Apple Silicon, the symbolic link is added to `/opt/homebrew/bin`.

</Procedure>

</Tab>

<Tab title="MacOS MacPorts">

Install using MacPorts. `libpqxx` is the official C++ client API for PostgreSQL.

<Procedure>

1. [Install MacPorts][macports] by downloading and running the package installer.

1. Install the latest version of `libpqxx`:

    ```bash
    sudo port install libpqxx
    ```
         
1.  View the files that were installed by `libpqxx`:

     ```bash
     port contents libpqxx
     ```
         
</Procedure>

</Tab>
  
<Tab title="Debian and Ubuntu">

Install `psql` on Debian and Ubuntu with the `apt` package manager.

<Procedure>

1.  Make sure your `apt` repository is up to date:

    ```bash
       sudo apt-get update
    ```

1.  Install the `postgresql-client` package:

    ```bash
    sudo apt-get install postgresql-client
    ```

</Procedure>

</Tab>

<Tab title="Windows">

`psql` is installed by default when you install PostgreSQL. This procedure uses the interactive installer provided by PostgreSQL and EnterpriseDB.

<Procedure>

1.  Download and run the PostgreSQL installer from [www.enterprisedb.com][windows-installer].
 
1. In the `Select Components` dialog, check `Command Line Tools`, along with any other components you want to install, and click `Next`.

1.  Complete the installation wizard to install the package.

</Procedure>

</Tab>

</Tabs>

## Connect to your $SERVICE_SHORT

To use `psql` to connect to your $SERVICE_SHORT, you need the connection details. See [Find your connection details][connection-info].

Connect to your $SERVICE_SHORT with either:

- The parameter flags:
    
   ```bash
   psql -h <HOSTNAME> -p <PORT> -U <USERNAME> -W -d <DATABASENAME>
   ```

- The $SERVICE_SHORT URL:

   ```bash
   psql "postgres://<USERNAME>@<HOSTNAME>:<PORT>/<DATABASENAME>?sslmode=require"
   ```
  
   You are prompted to provide the password. 

- The $SERVICE_SHORT URL with the password already included and [a stricter SSL mode][ssl-mode] enabled:

   ```bash
   psql "postgres://<USERNAME>:<PASSWORD>@<HOSTNAME>:<PORT>/<DATABASENAME>?sslmode=verify-full"
   ```

## Useful psql commands

When you start using `psql`, these are the commands you are likely to use most frequently:

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

For more on `psql` commands, see the [$COMPANY psql cheat sheet][psql-cheat-sheet] and [psql documentation][psql-docs].

## Save query results to a file

When you run queries in `psql`, the results are shown in the console by default.
If you are running queries that have a lot of results, you might like to save
the results into a comma-separated `.csv` file instead. You can do this using
the `COPY` command. For example:

```sql
\copy (SELECT * FROM ...) TO '/tmp/output.csv' (format CSV);
```

This command sends the results of the query to a new file called `output.csv` in
the `/tmp/` directory. You can open the file using any spreadsheet program.

## Run long queries

To run multi-line queries in `psql`, use the `EOF` delimiter. For example:

```sql
psql -d $TARGET -f -v hypertable=<hypertable> - <<'EOF'
SELECT public.alter_job(j.id, scheduled=>true)
FROM _timescaledb_config.bgw_job j
JOIN _timescaledb_catalog.hypertable h ON h.id = j.hypertable_id
WHERE j.proc_schema IN ('_timescaledb_internal', '_timescaledb_functions')
AND j.proc_name = 'policy_compression'
AND j.id >= 1000
AND format('%I.%I', h.schema_name, h.table_name)::text::regclass = :'hypertable'::text::regclass;
EOF
```

## Edit queries in a text editor

Sometimes, queries can get very long, and you might make a mistake when you try
typing it the first time around. If you have made a mistake in a long query,
instead of retyping it, you can use a built-in text editor, which is based on
`Vim`. Launch the query editor with the `\e` command. Your previous query is
loaded into the editor. When you have made your changes, press `Esc`, then type
`:`＋`w`＋`q` to save the changes, and return to the command prompt. Access the
edited query by pressing `↑`, and press `Enter` to run it.

[psql-cheat-sheet]: https://www.timescale.com/learn/postgres-cheat-sheet
[psql-docs]: https://www.postgresql.org/docs/current/app-psql.html
[ssl-mode]: /use-timescale/:currentVersion:/security/strict-ssl/
[homebrew]: https://docs.brew.sh/Installation
[macports]: https://guide.macports.org/#installing.macports
[windows-installer]: https://www.postgresql.org/download/windows/
[connect-database]:/use-timescale/:currentVersion:/integrations/psql/#connect-to-your-service
[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/

