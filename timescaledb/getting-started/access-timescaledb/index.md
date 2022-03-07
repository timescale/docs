# Access your database

Now that you have TimescaleDB set up and running in either Timescale Cloud or a Docker container, it's time
to connect to your database. This tutorial covers two connection methods: 
*   Connecting to your database using the terminal
*   Connecting to your database using third-party tools

## Connect using the terminal
If you're using Timescale Cloud, you can connect from your terminal with `psql`.
`psql` is the standard command-line interface for interacting with PostgreSQL or
TimescaleDB instances. You need to install `psql` on your local machine. For
more information, see the [guide to installing `psql`][install-psql].

If you're using Docker, you can connect from either your local terminal or the
container's terminal. On your local terminal, you need a local installation of
`psql`. On the container's terminal, you don't need a local installation. Your
Docker container already has `psql` tools from its PostgreSQL installation.

## Connect using third-party tools
You can connect to either Timescale Cloud or your Docker instance with
third-party tools. You can choose between many third-party PostgreSQL clients.
This tutorial uses [DBeaver][dbeaver-link]. DBeaver is a free, open source, multi-platform database tool. If you decide to use another third-party tool, the process and information required should be almost identical. 


## Learn more
* [Accessing your TimescaleDB instance using the terminal][access-terminal]
* [Accessing your TimescaleDB instance using third-party tools][access-third-party]

[access-terminal]: /getting-started/access-timescaledb/access-timescaledb-terminal/
[access-third-party]: /getting-started/access-timescaledb/access-timescaledb-third-party-tools/
[dbeaver-link]: https://dbeaver.io/
[install-psql]: /how-to-guides/connecting/psql/