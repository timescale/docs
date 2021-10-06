# Install TimescaleDB Toolkit
Some hyperfunctions are included in the default TimescaleDB product. For
additional hyperfunctions, you need to install the Timescale Toolkit PostgreSQL
extension.

If you are using [Timescale Cloud][], the Toolkit is already installed.

On [Managed TimescaleDB][], run this command on each database you want to use
the Toolkit with:
```sql
CREATE EXTENSION timescaledb_toolkit;
```

You can update an installed version of the Toolkit using this command:
```sql
ALTER EXTENSION timescaledb_toolkit UPDATE;
```

## Install Toolkit on self-hosted TimescaleDB
If you are hosting your own TimescaleDB database you install the Toolkit
extension from the command prompt.

### Procedure: Installing Toolkit on self-hosted TimescaleDB
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

For more information about installing Toolkit from source, see our
[developer documentation][toolkit-gh-docs] .

[Timescale Cloud]: /cloud/:currentVersion:/
[Managed TimescaleDB]: /mst/:currentVersion:/
[rust-install]: https://www.rust-lang.org/tools/install
[toolkit-gh-docs]: https://github.com/timescale/timescaledb-toolkit#-installing-from-source
