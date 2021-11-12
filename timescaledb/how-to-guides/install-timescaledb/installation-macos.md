# Install self-hosted TimescaleDB on macOS systems
You can host TimescaleDB yourself on your Apple macOS system.
These instructions use a Homebrew installer on these versions:
*   Apple macOS 10.15 Catalina
*   Apple macOS 11 Big Sur
*   Apple macOS 12 Monterey

<highlight type="warning">
If you have already installed PostgreSQL using a method other than Homebrew, you
could encounter errors following these instructions. It is safest to remove any
existing PostgreSQL installations before you begin. If you want to keep your
current PostgreSQL installation, do not install TimescaleDB using this method.
using this method.
TimescaleDB using this method.
[Install from source](/how-to-guides/install-timescaledb/installation-source/)
instead.
</highlight>

<procedure>

### Installing self-hosted TimescaleDB on macOS-based systems
1.  Install Homebrew, if you don't already have it:
    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```
    For more information about Homebrew, including installation instructions,
    see the [Homebrew documentation][homebrew].
1.  At the command prompt, add the Timescale Homebrew tap:
    ```bash
    brew tap timescale/tap
    ```
1.  Install TimescaleDB:
    ```bash
    brew install timescaledb
    ```
1.  Run the setup script to complete installation:
    ```bash
    /usr/local/bin/timescaledb_move.sh
    ```

</procedure>

When you have completed the installation, you need to configure your database so
that you can use it. The easiest way to do this is to run the `timescaledb-tune`
script, which is included with the `timescaledb-tools` package. For more
information, see the [configuration][config] section.


[homebrew]: https://docs.brew.sh/Installation
[config]: /how-to-guides/configuration/
