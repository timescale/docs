---
title: Connect to a Timescale Cloud service with psql 
excerpt: Install the psql client for PostgreSQL and connect to your service 
products: [cloud, mst, self_hosted]
keywords: [connect, psql]
---

# Connect using psql

You use `psql` command line tool to interact with your $SERVICE_LONG. Most procedures in the $COMPANY documentation assume you are using `psql`.

To use `psql` to connect to your database, you need the connection details for your PostgreSQL server. For more information about how to retrieve your
connection details, see the [about connecting][about-connecting] section.

## Install psql

Before you start, check that you don't already have `psql` installed. It is
sometimes installed by default, depending on your operating system and other
packages you have installed over time:

<Terminal>

<tab label='Linux/macOS'>

```bash
psql --version
```

</tab>

<tab label='Windows'>

```powershell
wmic
/output:C:\list.txt product get name, version
```

</tab>

</Terminal>

### Install PostgreSQL package on macOS

The `psql` tool is installed by default on macOS systems when you install
PostgreSQL, and this is the most effective way to install the tool.

You can use Homebrew or MacPorts to install the PostgreSQL package
or just the `psql` tool.

<Tabs label="Install PostgreSQL package">

<Tab title="Homebrew">

<Procedure>

1.  Install Homebrew if you don't already have it:

    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```

    For more information about Homebrew, including installation instructions,
    see the [Homebrew documentation][homebrew].
1.  Make sure your Homebrew repository is up to date:

    ```bash
    brew doctor
    brew update
    ```

1.  Install PostgreSQL:

    ```bash
    brew install postgresql
    ```

</Procedure>

</Tab>

<Tab title="MacPorts">

<Procedure>

1.  Install MacPorts by downloading and running the package installer..
    For more information about MacPorts, including installation instructions,
    see the [MacPorts documentation][macports].
1.  Install the latest version of Postgresql:

    ```bash
    sudo port install postgresql<xx>
    ```

    For example, to install version *14* replace `postgresql<xx>` with `postgresql14`.
1.  <Optional />View the files that were installed:

    ```bash
    port contents postgresql<xx>
    ```

</Procedure>

</Tab>

</Tabs>

### Install psql on macOS

If you do not want to install the entire PostgreSQL package, you can install the `psql` tool on its own. `libpqxx` is the official C++ client API for PostgreSQL.

<Tabs label="Installing psql">

<Tab title="Homebrew">

<Procedure>

1.  Install Homebrew, if you don't already have it:

    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```

    For more information about Homebrew, including installation instructions,
    see the [Homebrew documentation][homebrew].
1.  Make sure your Homebrew repository is up to date:

    ```bash
    brew doctor
    brew update
    ```

1.  Install `psql`:

    ```bash
    brew install libpq
    ```

1.  Update your path to include the `psql` tool.

    ```bash
    brew link --force libpq
    ```

    On Intel chips, the symbolic link is added to `/usr/local/bin`. On Apple
    Silicon, the symbolic link is added to `/opt/homebrew/bin`.

</Procedure>

</Tab>

<Tab title="MacPorts">

<Procedure>

1.  Install MacPorts by downloading and running the package installer.
    For more information about MacPorts, including installation instructions,
    see the [MacPorts documentation][macports].
1.  Install the latest version of libpqxx:

    ```bash
    sudo port install libpqxx
    ```

1.  <Optional />View the files that were installed by libpqxx:

    ```bash
    port contents libpqxx
    ```

</Procedure>

</Tab>

</Tabs>

### Install psql on Debian and Ubuntu

You can use the `apt` package manager on Debian and Ubuntu systems to install
the `psql` tool.

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

### Install psql on Windows

The `psql` tool is installed by default on Windows systems when you install
PostgreSQL, and this is the most effective way to install the tool. These
instructions use the interactive installer provided by PostgreSQL and
EnterpriseDB.

<Procedure>

1.  Download and run the PostgreSQL installer from
    [www.enterprisedb.com][windows-installer].
1.  In the `Select Components` dialog, check `Command Line Tools`, along with
    any other components you want to install, and click `Next`.
1.  Complete the installation wizard to install the package.

</Procedure>

## Connect to your database

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
don't want to be prompted, you can supply your password directly within the service
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

## Save query results to a file

When you run queries in `psql`, the results are shown in the Console by default.
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


[about-connecting]: /use-timescale/:currentVersion:/integrations/query-admin/about-connecting/
[psql-cheat-sheet]: https://www.timescale.com/learn/postgres-cheat-sheet
[psql-docs]: https://www.postgresql.org/docs/13/app-psql.html
[ssl-mode]: /use-timescale/:currentVersion:/security/strict-ssl/
[homebrew]: https://docs.brew.sh/Installation
[macports]: https://guide.macports.org/#installing.macports
[windows-installer]: https://www.postgresql.org/download/windows/
