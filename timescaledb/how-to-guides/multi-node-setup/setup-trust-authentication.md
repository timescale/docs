### Trust authentication [](multi-node-auth-trust)

This is the quickest path to getting a multi-node environment up and running,
but should not be used for any sort of secure data.

<highlight type="warning">
The "trust" authentication method allows insecure access to all 
nodes.  For production implementations, please use more secure 
methods of authentication.
</highlight>

#### 1. Edit authentication configuration file on data nodes
Client authentication is usually configured in the `pg_hba.conf` ([reference doc][postgresql-hba])
file located in the data directory.  If the file is not located 
there, connect to the instance with `psql` and execute the command:

```sql
SHOW hba_file;
``` 

To enable "trust" authentication, add a line to `pg_hba.conf` to allow
access to the instance. Ex: for an access node ip address `192.0.2.20`:

```
# TYPE  DATABASE  USER  ADDRESS      METHOD
host    all       all   192.0.2.20   trust
```

#### 2. Reload server configuration
Reload the server configuration on each data node for the changes to take effect:

```bash
pg_ctl reload
```

#### 3. Add the data nodes to the access node

Once the nodes are properly configured, you can continue following the [multi-node setup][init_data_nodes].

#### 4. Setting up additional roles [](multi-node-auth-trust-roles)
There are no additional configuration changes that need to be done for trust
authentication, as connections from all users on the access node are trusted by
the data nodes.  You can simply perform the following commands on the access node.

First, create the role on the access node if not already present:
```sql
CREATE ROLE testrole;
```

If external clients need to connect to the access node as `testrole`
it is also necessary to add the `LOGIN` option. And, optionally, the
`PASSWORD` option if password authentication is used.

Next, allow that role to access the foreign server objects for the data nodes. Run
the following, making sure to include all data node names:
```sql
GRANT USAGE ON FOREIGN SERVER <data node name>, <data node name>, ... TO testrole;
```

Finally add the role to all of the data nodes. Use the
[`distributed_exec`][distributed_exec] command to do this from the
access node:

```sql
CALL distributed_exec($$ CREATE ROLE testrole LOGIN $$);
```

It's important that the role be created with the `LOGIN` privilege on
the data nodes, even if it doesn't have this privilege on the access
node.  Aside from this, any other permissions the user has should be
the same on the data node to ensure operations behave the same on all
nodes.