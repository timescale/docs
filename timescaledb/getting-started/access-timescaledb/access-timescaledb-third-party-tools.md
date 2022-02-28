# Access your database with third-party tools
You can connect to your TimescaleDB instance using many different tools. If a
tool works with PostgreSQL, it works with TimescaleDB. This tutorial uses the
database client [DBeaver][dbeaver-link]. 

DBeaver is a free, open source, multi-platform database tool. To install
DBeaver, visit [the DBeaver installation page][dbeaver-install]. 

If you use another third-party tool, you should find the connection process
fairly similar to the instructions in this guide. You can use this guide as a
reference and ask questions on Timescale's [community Slack][slack] and
[forum][forum].

<highlight type="note">
Connecting with third-party tools is one way of accessing TimescaleDB. You can
also access your database from the terminal. To learn more, see the [terminal
access guide](/timescaledb/latest/getting-started/access-timescaledb/access-timescaledb-terminal/).
</highlight>

## Access a Timescale Cloud instance using third-party tools
Connect to a TimescaleDB instance on Timescale Cloud by using DBeaver.

<procedure>

### Accessing a Timescale Cloud instance using third-party tools
1.  Log in to [your Timescale Cloud account][cloud-log-in].
1.  Click on a service to view its details. Leave this page open for reference.
1.  Open DBeaver and create a new database connection. You can create a
    connection by clicking `Database` in the top menu bar and selecting `New
    Database Connection`. Or you can directly click the new database connection
    icon in the top left corner, shown in the following GIF.
1.  In the pop-up, select `TimescaleDB` as the type of database you want to
    connect to. If `TimescaleDB` doesn't appear in the list, use the search bar
    at the top to find it.

    <img class="main-content__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/dbeaver-new-connection.gif"
    alt="Create new database connection"/>

    <!-- COMMENT:
    Should we use WebMs or MP4s embedded as videos rather than GIFs embedded as 
    images? We might get some file-size savings, and viewers can use the video 
    control buttons to pause and rewind, which is very useful when trying to follow 
    video instructions.
    -->

1.  Refer back to your Timescale Cloud service details to find the database
    information: host, port, database name, and username. This information is
    available in the `Overview` tab.

    <img class="main-content__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-running-service.png"
    alt="Service info for connecting"/>

1.  In DBeaver, enter the service details in the `Connection Settings` pop-up window.
1.  Enter your service password. Use the password that was created when you
    launched your database, not your Timescale Cloud password.
1.  Establish the connection by pressing `Finish`.

</procedure>

Now that you've connected to your Timescale Cloud instance, learn how to [add
data][add-data] and explore the power of TimescaleDB.

## Access a TimescaleDB Docker instance using third-party tools
Connect to a TimescaleDB instance on Docker by using DBeaver.

<procedure>

### Accessing a TimescaleDB Docker instance using third-party tools
1.  Double-check the port and host information that you used to create your
    Docker container. If you followed the [Docker installation steps in this
    tutorial][launch-docker], the port is `5432` and the host is `127.0.0.1`.
    Otherwise, the port and host are the values you provided for the `-p` flag:
    ```
    -p <HOST>:<HOST_PORT>:<CONTAINER_PORT>
    ```
1.  Open DBeaver and create a new database connection. You can create a
    connection by clicking `Database` in the top menu bar and selecting `New
    Database Connection`. Or you can directly click the new database connection
    icon in the top left corner, shown in the following GIF.
1.  In the pop-up, select `TimescaleDB` as the type of database you want to
    connect to. If `TimescaleDB` doesn't appear in the list, use the search bar
    at the top to find it.

    <img class="main-content__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/dbeaver-new-connection.gif"
    alt="Create new database connection"/> 
1.  In the `Connection Settings` pop-up window, enter the database name, user,
    host, and port values. By default, TimescaleDB Docker images set the
    database name and user to `postgres`.
1.  Enter your service password. Use the password that you set within your
    initial `docker run` command.
1.  Establish the connection by pressing `Finish`.

</procedure>

Now that you've connected to your TimescaleDB Docker instance, learn how to [add
data][add-data] and explore the power of TimescaleDB.


[access-terminal]: /getting-started/access-timescaledb/access-timescaledb-terminal/
[add-data]: /getting-started/add-data/
[launch-docker]: /getting-started/launch-timescaledb/launch-timescaledb-docker/
[dbeaver-link]: https://dbeaver.io/
[dbeaver-install]: https://dbeaver.io/download/
[slack]: https://slack.timescale.com/
[forum]: https://www.timescale.com/forum/
[cloud-log-in]: https://console.cloud.timescale.com/
[launch-timescaledb]: /getting-started/launch-timescaledb/launch-timescaledb-cloud/