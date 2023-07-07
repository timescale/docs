---
title: Install the psql connection tool
excerpt: How to install the psql client for PostgreSQL
products: [cloud, mst, self_hosted]
keywords: [connect, psql]
---

# Install the psql connection tool

The `psql` command line tool is widely used for interacting with a PostgreSQL or
Timescale instance, and it is available for all operating systems. Most of
the instructions in the Timescale documentation assume you are using `psql`.

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

## Install PostgreSQL package on macOS

The `psql` tool is installed by default on macOS systems when you install
PostgreSQL, and this is the most effective way to install the tool. On macOS you can use Homebrew or MacPorts to install the PostgreSQL package or just the `psql` tool.

<Tabs label="Installing PostgreSQL package">

<Tab title="Homebrew">

<Procedure>

### Installing PostgreSQL package using Homebrew

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

1.  Install PostgreSQL:

    ```bash
    brew install postgresql
    ```

</Procedure>

</Tab>

<Tab title="MacPorts">

<Procedure>

### Installing PostgreSQL package using MacPorts

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

## Install psql on macOS

If you do not want to install the entire PostgreSQL package, you can install the `psql` tool on its own. `libpqxx` is the official C++ client API for PostgreSQL.

<Tabs label="Installing psql">

<Tab title="Homebrew">

<Procedure>

### Installing psql using Homebrew

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

### Installing psql using MacPorts

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

## Install psql on Debian and Ubuntu

You can use the `apt` package manager on Debian and Ubuntu systems to install
the `psql` tool.

<Procedure>

### Installing psql using the apt package manager

1.  Make sure your `apt` repository is up to date:

    ```bash
    sudo apt-get update
    ```

1.  Install the `postgresql-client` package:

    ```bash
    sudo apt-get install postgresql-client
    ```

</Procedure>

## Install psql on Windows

The `psql` tool is installed by default on Windows systems when you install
PostgreSQL, and this is the most effective way to install the tool. These
instructions use the interactive installer provided by PostgreSQL and
EnterpriseDB.

<Procedure>

### Installing psql on Windows

1.  Download and run the PostgreSQL installer from
    [www.enterprisedb.com][windows-installer].
1.  In the `Select Components` dialog, check `Command Line Tools`, along with
    any other components you want to install, and click `Next`.
1.  Complete the installation wizard to install the package.

</Procedure>

[homebrew]: https://docs.brew.sh/Installation
[macports]: https://guide.macports.org/#installing.macports
[windows-installer]: https://www.postgresql.org/download/windows/
