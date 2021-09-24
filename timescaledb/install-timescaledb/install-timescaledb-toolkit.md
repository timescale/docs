# Installing TimescaleDB Toolkit

In order to use functions from the TimescaleDB Toolkit, you'll need to install 
it. If you are using [Timescale Cloud][] to host your database, the Toolkit is already
installed. 

On [Managed TimescaleDB][] you may need to run `CREATE EXTENSION timescaledb_toolkit;` 
in each database that you need to use the functions with. 

If you already have it installed and are updating to the latest version, run 
`ALTER EXTENSION timescaledb_toolkit UPDATE;`.

## Self-hosted install
If you are hosting your own TimescaleDB database and need to install the TimescaleDB
Toolkit first, follow the instructions provided at the GitHub repo to [install it
from source][install-source].

[Timescale Cloud]: /cloud/:currentVersion:/
[MST]: /mst/:currentVersion:/
[install-source]: https://github.com/timescale/timescaledb-toolkit#-installing-from-source