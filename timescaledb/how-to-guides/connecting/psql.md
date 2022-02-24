# Install the psql connection tool
The `psql` command line tool is widely used for interacting with a PostgreSQL or
TimescaleDB instance, and it is available for all operating systems. Most of
the instructions in the Timescale documentation assume you are using `psql`.

Before you start, check that you don't already have `psql` installed. It is
sometimes installed by default, depending on your operating system and other
packages you have installed over time:

<terminal>

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

</terminal>

## Install psql on Apple macOS
The `psql` tool is installed by default on macOS systems when you install
PostgreSQL, and this is the most effective way to install the tool. These
instructions use the Homebrew package management tool.

<procedure>

### Installing PostgreSQL on Apple macOS
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
    brew install postgres
    ```

</procedure>

If you do not want to install the entire PostgreSQL package, you can install the `psql` tool on its own.

<procedure>

### Installing psql on Apple macOS
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

</procedure>

## Install psql on Debian and Ubuntu
You can use the `apt` package manager on Debian and Ubuntu systems to install
the `psql` tool.

<procedure>

### Installing psql on Debian and Ubuntu
1.  Make sure your `apt` repository is up to date:
    ```bash
    sudo apt-get update
    ```
1.  Install the `postgresql-client` package:
    ```bash
    sudo apt-get install postgresql-client
    ```

</procedure>

## Install psql on Windows
The `psql` tool is installed by default on Windows systems when you install
PostgreSQL, and this is the most effective way to install the tool. These
instructions use the interactive installer provided by PostgreSQL and
EnterpriseDB.

<procedure>

### Installing psql on Windows
1.  Download and run the PostgreSQL installer from
    [www.enterprisedb.com][windows-installer].
1.  In the `Select Components` dialog, check `Command Line Tools`, along with
    any other components you want to install, and click `Next`.
1.  Complete the installation wizard to install the package.

</procedure>


[homebrew]: https://brew.sh/
[windows-installer]: https://www.postgresql.org/download/windows/
