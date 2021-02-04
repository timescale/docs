## From Source [](installation-source)

**Note: TimescaleDB requires PostgreSQL 11 or 12.**

#### Prerequisites

- A standard **PostgreSQL :pg_version:** installation with development environment (header files) (see https://www.postgresql.org/download/ for the appropriate package)
- C compiler (e.g., gcc or clang)
- [CMake][] version 3.11 or greater

#### Build & Install with Local PostgreSQL
>:TIP: It is **highly recommended** that you checkout the latest
tagged commit to build from (see the repo's [Releases][github-releases] page for that)

Clone the repository from [GitHub][github-timescale]:
```bash
git clone https://github.com/timescale/timescaledb.git
cd timescaledb
git checkout <release_tag>  # e.g., git checkout x.y.z

# Bootstrap the build system
./bootstrap

# To build the extension
cd build && make

# To install
make install
```

>:WARNING: Our build scripts use `pg_config` to find out where PostgreSQL
stores its extension files. If you have two versions of PostgreSQL
installed, use `pg_config` to find out which version TimescaleDB was
installed with.

#### Update `postgresql.conf`

You will need to edit your `postgresql.conf` file to include
the TimescaleDB library, and then restart PostgreSQL. First, locate your
`postgresql.conf` file:

```bash
psql -d postgres -c "SHOW config_file;"
```

Then modify `postgresql.conf` to add the required library.  Note that
the `shared_preload_libraries` line is commented out by default.
Make sure to uncomment it when adding our library.

```bash
shared_preload_libraries = 'timescaledb'
```
>:TIP: If you have other libraries you are preloading, they should be comma separated.

Then, restart the PostgreSQL instance.

>:TIP: Our standard binary releases are licensed under the Timescale License,
which allows to use all our capabilities.
To build a version of this software that contains
source code that is only licensed under Apache License 2.0, pass `-DAPACHE_ONLY=1`
to `bootstrap`.

[CMake]: https://cmake.org/
[github-releases]: https://github.com/timescale/timescaledb/releases
[github-timescale]: https://github.com/timescale/timescaledb
