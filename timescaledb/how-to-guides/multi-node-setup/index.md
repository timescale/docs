# Multi-node TimescaleDB environments

If you have multiple instances of PostgreSQL running TimescaleDB 2.0 or greater,
you can set them up to act as a TimescaleDB multi-node environment.

To start, you'll need to have the following:
- One PostgreSQL instance to act as an **access node**
- One or more PostgreSQL instances to act as **data nodes**
- TimescaleDB [installed][install] and [set up][setup] on all nodes
- Access to a superuser role (e.g. `postgres`) on all nodes
- Multi-node [required configuration][configuration] applied

All nodes begin as standalone TimescaleDB instances, i.e., hosts with
a running PostgreSQL server and a loaded TimescaleDB extension. This
is assumed for "access node" and "data node" in the instructions. More
detail on the architecture can be found in the [Core Concepts][] section.

TimescaleDB multi-node can be created as part of a self-managed deployment or as
a managed cloud deployment.

To set up a self-managed cluster, including configuring the nodes for secure
communication and creating users and roles across servers, follow the
instructions in this section.

If you would like to give multi-node a try  without the management overhead, you
can [setup and explore a multi-node cluster in Timescale
Forge][multi_node_forge],  our fully managed database
service. [Sign-up for your free](https://forge.timescale.com/signup), 30-day
trial and get started today!



[init_data_nodes]: /getting-started/setup-multi-node-basic#init_data_nodes_on_access_node
[auth-password]: https://www.postgresql.org/docs/current/auth-password.html
[passfile]: https://www.postgresql.org/docs/current/libpq-pgpass.html
[md5sum]: https://www.tutorialspoint.com/unix_commands/md5sum.htm
[distributed hypertables]: /using-timescaledb/distributed-hypertables
[add_data_node]: /api#add_data_node
[attach_data_node]: /api#attach_data_node
[delete_data_node]: /api#delete_data_node
[detach_data_node]: /api#detach_data_node
[distributed_exec]: /api#distributed_exec
[configuration]: /how-to-guides/multi-node-setup/required-configuration
[install]: /how-to-guides/install-timescaledb
[setup]: /how-to-guides/install-timescaledb/post-install-setup/
[postgresql-hba]: https://www.postgresql.org/docs/12/auth-pg-hba-conf.html
[user-mapping]: https://www.postgresql.org/docs/current/sql-createusermapping.html
[Core Concepts]: /overview/core-concepts/
[multi_node_forge]: /timescale-forge/latest/forge-multi-node/
