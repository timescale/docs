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
[Install from source](/install/latest/self-hosted/installation-source/)
instead.
</highlight>


### Installing self-hosted TimescaleDB on macOS-based systems

You can use Homebrew or MacPorts to install TimescaleDB on macOS-based systems.

 <procedure>

#### Using Homebrew

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

<procedure>

#### Using MacPorts
1.  Install MacPorts, by downloading the macOS package and double-click the downloaded package installer.
    
    For more information about MacPorts, including installation instructions,
    see the [MacPorts documentation][macports].
1.  Install TimescaleDB:
    ```bash
    sudo port install timescaledb 
    ```
1.  View the files that were installed by timescaledb:
    ```bash
    port contents timescaledb
    ``` 
     
<highlight type="warning">
 MacPorts does not install the `timescaledb-tools` to run the `timescaledb-tune` script. For more information about installing and using the tool, see [timescaledb-tune][tune] section.
 </highlight>

</procedure>

When you have completed the installation, you need to configure your database so
that you can use it. The easiest way to do this is to run the `timescaledb-tune`
script, which is included with the `timescaledb-tools` package. For more
information, see the [configuration][config] section.


## Where to next
Now that you have your first TimescaleDB database up and running, you can check
out the [TimescaleDB][tsdb-docs] section in our documentation, and find out what
you can do with it.

If you want to work through some tutorials to help you get up and running with
TimescaleDB and time-series data, check out our [tutorials][tutorials] section.

You can always [contact us][contact] if you need help working something out, or
if you want to have a chat.


[contact]: https://www.timescale.com/contact
[install-psql]: /how-to-guides/connecting/psql/
[tsdb-docs]: timescaledb/:currentVersion:/index/
[tutorials]: /timescaledb/:currentVersion:/tutorials/
[config]: /timescaledb/:currentVersion:/how-to-guides/configuration/
[homebrew]: https://docs.brew.sh/Installation
[macports]: https://guide.macports.org/#installing.macports
[tune]: /timescaledb/:currentVersion:/how-to-guides/configuration/timescaledb-tune/#timescaledb-tuning-tool
