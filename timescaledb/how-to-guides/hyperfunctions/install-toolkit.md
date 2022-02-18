# Install TimescaleDB Toolkit
Some hyperfunctions are included in the default TimescaleDB product. For
additional hyperfunctions, you need to install the TimescaleDB Toolkit PostgreSQL
extension.

If you're using [Timescale Cloud][cloud], the Toolkit is already installed.

## Install Toolkit on Managed Service for TimescaleDB
On [Managed Service for TimescaleDB][mst], run this command on each database you
want to use the Toolkit with:
```sql
CREATE EXTENSION timescaledb_toolkit;
```

You can update an installed version of the Toolkit using this command:
```sql
ALTER EXTENSION timescaledb_toolkit UPDATE;
```

## Install Toolkit on self-hosted TimescaleDB
If you're hosting your own TimescaleDB database, you can install Toolkit as an
RPM, Debian, or Ubuntu package. You can also build Toolkit from source.

<procedure>

### Installing Toolkit on Red Hat-based systems
These instructions use the `dnf` package manager on RHEL, CentOS, and Fedora.

1.  Make sure you have installed TimescaleDB and created a TimescaleDB
    repository in your `yum` repos. For more information, see [the installation
    instructions for Red Hat-based systems][red-hat-install].
1.  Update your local repository list:
    ```bash
    dnf update
    ```
1.  Install TimescaleDB Toolkit:
    ```bash
    dnf install timescaledb-toolkit-postgresql-14
    ```
1.  Connect to the database where you want to use Toolkit.
1.  Create the Toolkit extension in the database:
    ```sql
    CREATE EXTENSION timescaledb_toolkit;
    ```

</procedure>

<procedure>

### Installing Toolkit on Debian-based systems
These instructions use the `apt` package manager on Debian and Ubuntu.

1.  Make sure you have installed TimescaleDB and added the TimescaleDB
    repository and GPG key. For more information, see [the installation
    instructions for Debian-based systems][debian-install].
1.  Update your local repository list:
    ```bash
    apt update
    ```
1.  Install TimescaleDB Toolkit:
    ```bash
    apt install timescaledb-toolkit-postgresql-14
    ```
1.  Connect to the database where you want to use Toolkit.
1.  Create the Toolkit extension in the database:
    ```sql
    CREATE EXTENSION timescaledb_toolkit;
    ```

</procedure>

<procedure>

### Building Toolkit from source
1.  The extension requires `rust`, `rustfmt`, `clang`, and `pgx` packages, as
    well as the PostgreSQL headers for your installed version of PostgreSQL.
    Install these using your native package manager. For instructions on how to
    install Rust, see the [Rust installation instructions][rust-install].
1.  Install the TimescaleDB `pgx` package using Cargo:
    ```bash
    cargo install --git https://github.com/JLockerman/pgx.git --branch timescale2 cargo-pgx && \
    cargo pgx init --pg13 pg_config
    ```
1.  Clone the Toolkit repository, and change into the new directory:
    ```bash
    git clone https://github.com/timescale/timescaledb-toolkit && \
    cd timescaledb-toolkit/extension
    ```
1.  Use Cargo to complete installation:
    ```bash
    cargo pgx install --release && \
    cargo run --manifest-path ../tools/post-install/Cargo.toml -- pg_config
    ```

</procedure>

For more information about installing Toolkit from source, see the
[developer documentation][toolkit-gh-docs] .

[cloud]: /cloud/:currentVersion:/
[debian-install]: /install/:currentVersion:/self-hosted/installation-debian/
[mst]: /mst/:currentVersion:/
[red-hat-install]: /install/:currentVersion:/self-hosted/installation-redhat/
[rust-install]: https://www.rust-lang.org/tools/install
[toolkit-gh-docs]: https://github.com/timescale/timescaledb-toolkit#-installing-from-source
