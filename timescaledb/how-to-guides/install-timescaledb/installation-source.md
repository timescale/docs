# Install self-hosted TimescaleDB from source
You can host TimescaleDB yourself, on any system, by downloading the source code
and compiling it. These instructions do not require the use of a package manager
or installation tool.

Before you start, make sure you have installed:

*   PostgreSQL 12 or later, with a development environment. For more information
    about PostgreSQL installation, including downloads and instructions, see the
    [PostgreSQL documentation][postgres-download].
*   CMake version 3.11 or later. For more information about CMake installation,
    including downloads and instructions, see the
    [CMake documentation][cmake-download].
*   C language compiler for your operating system, such as `gcc` or `clang`.

If you are installing from source on a Microsoft Windows system, you also need:
*   Visual Studio 2015 or later, packaged with CMake version 3.11 or later, and
    Git components.

<procedure>

### Installing self-hosted TimescaleDB from source
1.  At the command prompt, clone the Timescale GitHub repository:
    ```bash
    git clone https://github.com/timescale/timescaledb.git
    ```
1.  Change into the cloned directory:
    ```bash
    cd timescaledb
    ```
1.  Checkout the latest release. You can find the latest release tag on
    our [Releases page][gh-releases]:
    ```bash
    git checkout 2.5.0
    ```
1.  Bootstrap the build system:
    <terminal>

    <tab label='Linux'>

    ```bash
    ./bootstrap
    ```

    </tab>

    <tab label="Windows">

    ```powershell
    bootstrap.bat
    ```

    </tab>

    </terminal>
1.  Build the extension:
    <terminal>

    <tab label='Linux'>

    ```bash
    cd build && make
    ```

    </tab>

    <tab label="Windows">

    ```powershell
    cmake --build ./build --config Release
    ```

    </tab>

    </terminal>
1.  Install TimescaleDB:
    <terminal>

    <tab label='Linux'>

    ```bash
    make install
    ```

    </tab>

    <tab label="Windows">

    ```powershell
    cmake --build ./build --config Release --target install
    ```

    </tab>

    </terminal>

</procedure>

## Configure PostgreSQL after installing from source
When you install TimescaleDB from source, you need to do some additional
PostgreSQL configuration to add the TimescaleDB library.

<highlight type="important">
If you have more than one version of PostgreSQL installed, TimescaleDB can only
be associated with one of them. The TimescaleDB build scripts use `pg_config` to
find out where PostgreSQL stores its extension files, so you can use `pg_config`
to find out which PostgreSQL installation TimescaleDB is using.
</highlight>

<procedure>

### Configuring PostgreSQL after installing from source
1.  Locate the `postgresql.conf` configuration file:
    ```bash
    psql -d postgres -c "SHOW config_file;"
    ```
1.  Open the `postgresql.conf` file in your preferred text editor, and locate
    the `shared_preload_libraries` parameter. Uncomment the line, and
    add `timescaledb`:
    ```bash
    shared_preload_libraries = 'timescaledb'
    ```
    If you use other preloaded libraries, make sure they are comma separated.
1.  Restart the PostgreSQL instance:
    <terminal>

    <tab label='Linux'>

    ```bash
    service postgresql restart  
    ```

    </tab>

    <tab label="Windows">

    ```powershell
    pg_ctl restart
    ```

    </tab>

    </terminal>

</procedure>

When you have completed the installation, you need to configure your database so
that you can use it. The easiest way to do this is to run the `timescaledb-tune`
script, which is included with the `timescaledb-tools` package. For more
information, see the [configuration][config] section.


[postgres-download]: https://www.postgresql.org/download/
[cmake-download]: https://cmake.org/download/
[gh-releases]: https://github.com/timescale/timescaledb/releases
[config]: /how-to-guides/configuration/
