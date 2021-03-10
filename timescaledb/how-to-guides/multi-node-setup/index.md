# Multi-node TimescaleDB environments

If you have multiple instances of PostgreSQL running TimescaleDB 2.0 or greater,
you can set them up to act as a TimescaleDB multi-node environment.

To start, you'll need to have the following:
- One PostgreSQL instance to act as an **access node**
- One or more PostgreSQL instances to act as **data nodes**
- TimescaleDB [installed][install] and [set up][setup] on all nodes
- Access to a superuser role (e.g. `postgres`) on all nodes
- Multi-node [required configuration][configuration] applied

## Node-to-node communication [](#node-communication)

Once you have your instances set up, the next task is configuring your
PostgreSQL instances to accept connections from the access node to the
data nodes. The authentication mechanism used when accepting such
connections might be different than the one used by external clients
when connecting to the access node. The task also requires different
steps depending on what authentication mechanism you want to use on
your nodes. The simplest approach is to simply trust all incoming
connections, and is discussed in [this
section](#multi-node-auth-trust).

Setting up a secure system is a complex task and this section should not 
be read as recommending any particular security measures for securing 
your system.  That said, here are two technical examples for how to 
enable authentication, [password authentication](#multi-node-auth-password) and 
[certificate authentication](#multi-node-auth-certificate).