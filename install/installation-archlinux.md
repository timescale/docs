# Install self-hosted TimescaleDB on archlinux-based systems
You can host TimescaleDB yourself, on your archlinux system. These
instructions use the `pacman` package manager.

<highlight type="warning">
If you have already installed PostgreSQL using a method other than the `pacman`
package manager, you could encounter errors following these instructions. It is
safest to remove any existing PostgreSQL installations before you begin. If you
want to keep your current PostgreSQL installation, do not install TimescaleDB
using this method.
[Install from source](/install/latest/self-hosted/installation-source/)
instead.
</highlight>

<procedure>

### Installing self-hosted TimescaleDB on archlinux-based systems
1.  At the command prompt, as root, add the PostgreSQL third party repository
    to get the latest PostgreSQL packages:
    ```bash
    pacman -Syu timescaledb
    ```
1.  To use TimescaleDB as PostgreSQL extension, update the `postgresql.conf` file:
    ```bash
    echo "shared_preload_libraries = 'timescaledb'" >> /var/lib/postgres/data/postgresql.conf
    ```
1.  Install `timescaledb-tune`:
    ```bash
    pacman -Syu timescaledb-tune
    ```
1.  Connect to the PostgreSQL instance as the `postgres` superuser:
    ```bash
    su -l postgres
    ```
1.  Initialize the database:
    ```bash
    initdb --locale=en_US.UTF-8 --encoding=UTF8 -D /var/lib/postgres/data --data-checksums
    ```
1. Logout as `postgres` superuser:
   ```bash
   exit
   ```    
1. Enable and start the service:
    ```
    systemctl enable postgresql.service
    systemctl start postgresql.service
    ```
1.  Restart the service after enabling TimescaleDB with `timescaledb-tune`:
    ```bash
    systemctl restart postgresql
    ```
    
</procedure>

When you have completed the installation, you need to configure your database so
that you can use it. The easiest way to do this is to run the `timescaledb-tune`
script, which is included with the `timescaledb-tools` package. For more
information, see the [configuration][config] section.

## Set up the TimescaleDB extension
When you have PostgreSQL and TimescaleDB installed, you can connect to it from
your local system using the `psql` command-line utility. This is the same tool
you might have used to connect to PostgreSQL before, but if you haven't
installed it yet, check out our [installing psql][install-psql] section.

<procedure>

### Setting up the TimescaleDB extension
1.  On your local system, at the command prompt, connect to the PostgreSQL
    instance as the `postgres` superuser:
    ```bash
    su postgres -c psql
    ```
    If your connection is successful, you'll see a message like this, followed
    by the `psql` prompt:
    ```
    psql (14.3)
    Type "help" for help.
    ```
1.  At the `psql` prompt, create an empty database. Our database is
    called `tsdb`:
    ```sql
    CREATE database tsdb;
    ```
1.  Connect to the database you created:
    ```sql
    \c tsdb
    ```
1.  Add the TimescaleDB extension:
    ```sql
    CREATE EXTENSION IF NOT EXISTS timescaledb;
    ```
1.  You can now connect to your database using this command:
    ```bash
    su postgres -c 'psql -d tsdb'
    ```

</procedure>

You can check that the TimescaleDB extension is installed by using the `\dx`
command at the `psql` prompt. It looks like this:
```sql
tsdb=# \dx
                                      List of installed extensions
    Name     | Version |   Schema   |                            Description                            
-------------+---------+------------+-------------------------------------------------------------------
 plpgsql     | 1.0     | pg_catalog | PL/pgSQL procedural language
 timescaledb | 2.7.0   | public     | Enables scalable inserts and complex queries for time-series data
(2 rows)

```

## Where to next
Now that you have your first TimescaleDB database up and running, you can check
out the [TimescaleDB][tsdb-docs] section in our documentation, and find out what
you can do with it.

If you want to work through some tutorials to help you get up and running with
TimescaleDB and time-series data, check out our [tutorials][tutorials] section.

You can always [contact us][contact] if you need help working something out, or
if you want to have a chat.


[contact]: https://www.timescale.com/contact
[install-psql]: /timescaledb/:currentVersion:/how-to-guides/connecting/psql/
[tsdb-docs]: /timescaledb/:currentVersion:/
[tutorials]: /timescaledb/:currentVersion:/tutorials/
[config]: /timescaledb/:currentVersion:/how-to-guides/configuration/
[releases-page]: https://packagecloud.io/timescale/timescaledb
