# Installing TimescaleDB Toolkit

In order to use functions from the TimescaleDB Toolkit, you'll need to install
it. If you are using [Timescale Forge][] to host your database, the Toolkit is already
installed.

On [Timescale Cloud][] you may need to run `CREATE EXTENSION timescaledb_toolkit;`
in each database that you need to use the functions with.

If you already have it installed and are updating to the latest version, run
`ALTER EXTENSION timescaledb_toolkit UPDATE;`.

## Self-hosted install

If you are hosting your own TimescaleDB database and need to install the TimescaleDB
Toolkit first, follow the instructions provided at the GitHub repo to [install it
from source][install-source].

## What is TimescaleDB Toolkit?

TimescaleDB Toolkit is an extension for TimescaleDB that gives users access to several unique "hyperfunctions" - SQL functions designed to make manipulation and analysis of time-series data in PostgreSQL simple and efficient. Hyperfunctions work on data in TimescaleDB hypertables, as well as data in regular PostgreSQL tables. All TimescaleDB Toolkit hyperfunctions
are available under the [Timescale Community Edition license](ts-license).

Functionality within the TimescaleDB Toolkit extension is separated into three categories: experimental, stable and deprecated.

<highlight type="warning">
Experimental APIs are still under active development, may not handle edge cases, and their performance will vary. They are subject to change across releases, which will lead to the dropping of objects you've created using these experimental features. Experimental functions and features are found in the toolkit_experimental schema.
</highlight>

<highlight type="important">
Toolkit functions labeled as deprecated are removed from future releases and are no longer supported. Currently, there are no deprecated Toolkit functions.
</highlight>

<highlight type="note">
Toolkit functions not labeled otherwise are stable - in this state, functionality is correct and performant. Stable APIs are found in releases and won't break in future releases.
</highlight>

For more on TimescaleDB Toolkit functions, explore the [API Reference documentation on hyperfunctions](/api/:currentVersion:/hyperfunctions/).

[timescale forge]: /timescale-forge/:currentVersion:/
[timescale cloud]: /timescale-cloud/:currentVersion:/
[install-source]: https://github.com/timescale/timescaledb-toolkit#-installing-from-source
[ts-license]: https://www.timescale.com/legal/licenses

