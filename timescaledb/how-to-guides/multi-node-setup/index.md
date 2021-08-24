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
Cloud][multi_node_cloud],  our fully managed database
service. [Sign-up for your free](https://forge.timescale.com/signup), 30-day
trial and get started today!


[configuration]: /how-to-guides/multi-node-setup/required-configuration
[install]: /how-to-guides/install-timescaledb
[setup]: /how-to-guides/install-timescaledb/post-install-setup
[Core Concepts]: /overview/core-concepts/
[multi_node_cloud]: /cloud/:currentVersion:/cloud-multi-node
