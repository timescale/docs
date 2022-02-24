# Access your database

Now that you have TimescaleDB set up and running in either Timescale Cloud or a Docker container, it's time
to connect to your database. We will cover two ways for this tutorial: connecting to your database using the terminal and connecting to your database using third-party tools.

### Using the terminal
We cover three scenarios for how to connect to TimescaleDB databases using the terminal:
- Accessing TimescaleDB Cloud instance using your local terminal
- Accessing TimescaleDB Docker instance using your local terminal
- Accessing TimescaleDB Docker instance through the containers terminal (does not require `psql` tools to be installed locally)
Using the terminal to connect to your database requires that you have access to `psql` tooling. `psql` is the standard command-line interface for interacting with PostgreSQL or TimescaleDB instances. Note that you will have to make sure `psql` tools are installed locally on your machine for the first two methods; the last one leverages the `psql` tooling within the docker container itself. 

### Using third-party tools
We cover two scenarios for ways to access your TimescaleDB databases using third-party tools:
- Accessing TimescaleDB Cloud instance
- Accessing TimescaleDB Docker instance
While there are many third-party tools you could use, we show you how to connect using [DBeaver][dbeaver-link] in this tutorial. DBeaver is a free, open-source, multi-platform database tool. If you decide to use another third-party tool, the process and information required should be almost identical. 


### Methods:
* [Accessing TimescaleDB instance using the terminal][access-terminal]
* [Accessing TimescaleDB instance using third party tools][access-third-party]

[access-terminal]: /getting-started/access-timescaledb/access-timescaledb-terminal/
[access-third-party]: /getting-started/access-timescaledb/access-timescaledb-third-party-tools/
[dbeaver-link]: https://dbeaver.io/