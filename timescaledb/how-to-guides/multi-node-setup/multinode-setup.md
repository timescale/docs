# Set up multinode
To start, you'll need:
- One PostgreSQL instance to act as an **access node**
- One or more PostgreSQL instances to act as **data nodes**
- TimescaleDB [installed][install] and [set up][setup] on all nodes
- Access to a superuser role (e.g. `postgres`) on all nodes
- Multi-node [required configuration][configuration] applied

All nodes begin as standalone TimescaleDB instances, i.e., hosts with
a running PostgreSQL server and a loaded TimescaleDB extension. This
is assumed for "access node" and "data node" in the instructions. More
detail on the architecture can be found in the [Core Concepts][] section.

[configuration]: /how-to-guides/multi-node-setup/required-configuration
[install]: /how-to-guides/install-timescaledb
[setup]: /how-to-guides/install-timescaledb/post-install-setup
[Core Concepts]: /overview/core-concepts/
