## Password authentication [](multi-node-auth-password)

With password authentication, every user role that uses distributed
hypertables needs an "internal" password for establishing connections
between the access node and the data nodes. Such a password is only
used by the access node and it need not be the same password as used
by the client connecting externally to the access node (in case the
client also uses password authentication). In fact, unless the user
needs to connect directly to data nodes, it never needs to use the
internal password and it can be setup and configured by the database
admin. Neither does the internal password have to change when the user
changes its password used to connect to the access node.

The access node needs to store the internal passwords somewhere so
that it can retrieve the right password when connecting to a data
node. It is recommended that internal passwords are stored in a local
password file, but, alternatively, [user mappings][user-mapping] can
be used as well. However, such in-database user mappings are less
secure and require one mapping per user and data node. Therefore, this
section focuses on the password file approach.

We recommend using SCRAM SHA-256 password authentication. For other
password authentication methods, [see the PostgreSQL docs][auth-password].  
The method assumes the presence of a `postgres` user/password combination
that exists on all nodes.  Steps are as follows:

1. Set the password encryption method for the access node and the data nodes
2. Enable authentication for connections from the access node to the data nodes
3. Create/update the `passfile` on the access node with all user/password 
pairs
4. Reload all nodes to update configuration
5. Add data nodes to the access node
6. Add any additional users

### 1. Set the password encryption method for access node and data nodes
First set the password encryption method to `scram-sha-256` within the PostgreSQL 
configuration file `postgresql.conf` on each node. Add this line to the file:

```bash
password_encryption = 'scram-sha-256'		# md5 or scram-sha-256
```

Note that any previously created user passwords will need to be recreated to 
incorporate the new encryption.

### 2. Enable password authentication on the data nodes
Password authentication is set by modifying the HBA file (by default `pg_hba.conf`
in the data directory, can also be found via `SHOW hba_file` in psql). Add a
line to `pg_hba.conf` to enable encrypted authentication between the access node and
the data node for all users:

```bash
# IPv4 local connections:
# TYPE  DATABASE  USER  ADDRESS      METHOD
host    all       all   192.0.2.20   scram-sha-256 #where '192.0.2.20' is the access node IP
```

### 3. Create passwords on the access node

The password file `passfile` stores passwords for each role that the
access node connects with to data nodes. The file is by default
located in the data directory ([PostgreSQL
documentation][passfile]). The location of the passfile can be changed
via the settings variable `timescaledb.passfile`.  If a file doesn't
exist, create one with the new user information.  Add a line for each
user, starting with the `postgres` user:

```bash
*:*:*:postgres:xyzzy #assuming 'xyzzy' is the password for the 'postgres' user
```

Then apply the correct permissions to the file:

```
chmod 0600 passfile
```

### 4. Reload server configuration
Reload the server configuration on each node for the changes to take effect:

```bash
pg_ctl reload
```

### 5. Add the data nodes to the access node

Once the nodes are properly configured, you can continue following the [multi-node setup][init_data_nodes].

### 6. Setting up additional roles [](multi-node-auth-password-roles)

First, create the role on the access node if needed, and grant it
usage to the foreign server objects for the data nodes:

```sql
CREATE ROLE testrole PASSWORD 'clientpass' LOGIN;
GRANT USAGE ON FOREIGN SERVER <data node name>, <data node name>, ... TO testrole;
```

Note that `clientpass` is the password used by external clients to
connect to the access node as user `testrole`. If the access node is
configured to accept other authentication methods, or the role is not
a login role, then the password and login options might not be needed
when creating the role on the access node.

Second, use [`distributed_exec`][distributed_exec] to add the role to
all of the data nodes. In addition to `LOGIN`, make sure to provide
the `PASSWORD` parameter to specify a different password to use when
connecting to the data nodes with role `testrole`:


```sql
CALL distributed_exec($$ CREATE ROLE testrole PASSWORD 'internalpass' LOGIN $$);
```

Finally, the new role must be added to the `passfile` on the access
node (created in step 3 above).

```bash
*:*:*:testrole:internalpass #assuming 'internalpass' is the password used to connect to data nodes
```