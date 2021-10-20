# Multi-node authentication
When you have your instances set up, you need to configure them to accept
connections from the access node to the data nodes. The authentication mechanism
you choose for this can be different than the one used by external clients to
connect to the access node.

How you set this up depends on which authentication mechanism you choose. The
options are:

*   Trust all incoming connections. This is the simplest approach, but also the
    least secure. This is a good way to start if you are trying out multi-node,
    but is not recommended for production clusters.
*   Pasword authentication. Every user role requires an internal password for
    establishing connections between the access node and the data nodes. This
    method is easier to set up than certificate authentication, but provides
    only a basic level of protection.
*   Certificate authentication. Every user role requires a certificate from a
    certificate authority to establish connections between the access node and
    the data nodes. This method is more complex to set up than password
    authentication, but more secure and easier to automate.

<highlight type="important">
Going beyond the simple trust approach to create a secure system can be complex,
but it is important to secure your database appropriately for your environment.
We do not recommend any one security model, but encourage you to perform a risk
assessment and implement the security model that best suits your environment.
</highlight>

## Trust authentication
Trusting all incoming connections is the quickest way to get your multi-node
environment up and running, but it is not a secure method of operation. Use this
only for developing a proof of concept, do not use this method for production
installations.

<highlight type="warning">
The trust authentication method allows insecure access to all nodes. Do not use
this method in production. It is not a secure method of operation.
</highlight>

<procedure>

### Trusting all incoming connections
1.  Connect to the access node with `psql`, and locate the `pg_hba.conf` file:
    ```sql
    SHOW hba_file;
    ```
1.  Open the `pg_hba.conf` file in your preferred text editor, and add this
    line. In this example, the access node is located at IP `192.0.2.20`:
    ```txt
    # TYPE  DATABASE  USER  ADDRESS      METHOD
    host    all       all   192.0.2.20   trust
    ```
1.  At the command prompt, reload the server configuration:
    ```bash
    pg_ctl reload
    ```
1.  If you have not already done so, add the data nodes to the access node. For
    instructions, see the [multi-node setup][multi-node-setup] section.
1.  On the access node, create the trust role. In this example, we call
    the role `testrole`:
    ```sql
    CREATE ROLE testrole;
    ```
    **OPTIONAL**: If external clients need to connect to the access node
    as `testrole`, add the `LOGIN` option when you create the role. You can
    also add the `PASSWORD` option if you want to require external clients to
    enter a password.
1.  Allow the trust role to access the foreign server objects for the data
    nodes. Make sure you include all the data node names:
    ```sql
    GRANT USAGE ON FOREIGN SERVER <data node name>, <data node name>, ... TO testrole;
    ```
1.  On the access node, use the [`distributed_exec`][distributed_exec] command
    to add the role to all the data nodes:
    ```sql
    CALL distributed_exec($$ CREATE ROLE testrole LOGIN $$);
    ```

<highlight type="important">
Make sure you create the role with the `LOGIN` privilege on the data nodes, even
if you don't use this privilege on the access node. For all other privileges,
ensure they are same on the access node and the data nodes.
</highlight>

</procedure>

<!-- Lana, you're up to here! --LKB 2021-10-20 -->

## Password authentication
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
that exists on all nodes.

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
Once the nodes are properly configured, you can continue following the
[multi-node setup][init_data_nodes].

### 6. Setting up additional roles
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

---
## Certificate authentication
This method is more complex to set up than password authentication, but
more secure and easier to automate.

To use certificates, each node involved in certificate
authentication uses three files:

- A *root CA certificate*, which we assume to be named `root.crt`, which
  serves as the root of trust in the system. It is used to verify other
  certificates.
- A node *certificate* that provides the node with a trusted identity in the
  system. The node certificate is signed by the CA.
- A private *key* that provides proof of ownership of the node certificate. In the
case of the access node, this key is also used to sign user certificates. The key
should be kept secure on the node instance where it is generated.

The access node also needs a private key and certificate pair for each user (role)
in the database that will be used to connect and execute queries on the data
nodes. The access node can use its own node certificate to create and sign new
user certificates, as described further below.

### 1. Set up a certificate authority

A CA is necessary as a trusted third party to sign other certificates.  The _key_
of the CA is used to sign Certificate Signing Requests (CSRs), and the
_certificate_ of the CA is used as a root certificate for other parties.
Creating a new CA is not necessary if there is already one available to be
employed.  In that case skip to the next step.

First, generate a private key called `auth.key`:

```bash
openssl genpkey -algorithm rsa -out auth.key
```

Generate a self-signed root certificate for the CA:

```bash
openssl req -new -key auth.key -days 3650 -out root.crt -x509

You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:US
State or Province Name (full name) [Some-State]:New York
Locality Name (eg, city) []:New York
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Example Company Pty Ltd
Organizational Unit Name (eg, section) []:
Common Name (e.g. server FQDN or YOUR name) []:http://cert.example.com/
Email Address []:
```

### 2. Generate keys and certificates for nodes
Keys and certificates serve similar but distinct purposes for the data nodes and
access node respectively.  For the data nodes, a signed certificate verifies the
node to the access node.  For the access node a signed certificate is used to
sign user certificates for access.

The default names for the node key and certificate are `server.key`
and `server.crt` respectively and they are both placed in the data
directory of the instance. To create a server certificate:

1. Generate a CSR, `server.csr` for the node and generate a new key,
`server.key`. To generate both with one command:

  ```bash
  openssl req -out server.csr -new -newkey rsa:2048 -nodes \
  -keyout server.key
  ```

2. Sign the CSR using the previously generated CA key, `auth.key`:

  ```bash
  openssl ca -extensions v3_intermediate_ca -days 3650 -notext \
  -md sha256 -in server.csr -out server.crt
  ```

3. Move the server files `server.crt` and `server.key` into the node's data
  directory.

4. Copy the root certificate file `root.crt` from the certificate
  authority into the node's data directory.

### 3. Configure the node to use SSL authentication

Configure the node to use SSL authentication by setting the `ssl` option to `on` and setting
the `ssl_ca_file` value in the `postgresql.conf` configuration file:

```
ssl = on
ssl_ca_file = 'root.crt'
ssl_cert_file = 'server.crt'
ssl_key_file = 'server.key'
```

This configuration is only required on data nodes, but it can also be applied to
the access node to enable certificate authentication for login.

<highlight type="tip">
`ssl_cert_file` and `ssl_key_file` are here set explicitly, but do not need
to be set for the default values (`server.crt` and `server.key`).  If the values
are different from the defaults, they _would_ need to be set explicitly.

</highlight>

Now configure the HBA file (default `pg_hba.conf`) on the data node to
accept certificates for users.  Add a line to allow any user that uses
SSL to log in with client certificate authentication:

```
# TYPE    DATABASE  USER        ADDRESS   METHOD  OPTIONS
hostssl   all       all         all       cert    clientcert=1
```

### 4. Set up user permissions
The access node does not have any user keys nor certificates, so it cannot yet log
into the data node.  User key files and user certificates are stored in
`timescaledb/certs` in the data directory.

<highlight type="tip">
You can configure the location of the user certificates and
keys outside of the data directory using `timescaledb.ssl_dir`.

</highlight>

To generate a key and certificate file:

1. Compute the base name for the files (using [md5sum][]), generate a subject
  identifier, and create names for the key and certificate files. Here, for user
  `postgres`:
  ```bash
  pguser=postgres #change value for a different user name
  base=`echo -n $pguser | md5sum | cut -c1-32`
  subj="/C=US/ST=New York/L=New York/O=Timescale/OU=Engineering/CN=$pguser"
  key_file="timescaledb/certs/$base.key"
  crt_file="timescaledb/certs/$base.crt"
  ```
  Most of the data is copied from the server certificate for the
  subject, but the common name (`CN`) needs to be set to the user
  name.
2. Generate a new random user key.
  ```bash
  openssl genpkey -algorithm RSA -out "$key_file"
  ```
3. Generate a certificate signing request. The CSR file is just
  temporary, so we can place it in directly in the data directory. It
  will be removed later.
  ```bash
  openssl req -new -sha256 -key $key_file -out "$base.csr" -subj "$subj"
  ```
4. Sign the certificate signing request with the node key.
  ```bash
  openssl ca -batch -keyfile server.key -extensions v3_intermediate_ca \
	   -days 3650 -notext -md sha256 -in "$base.csr" -out "$crt_file"
  rm $base.csr
  ```
5. Append the node certificate to the user certificate. This is
  necessary to complete the certificate verification chain and make
  sure that all certificates are available on the data node, up to a
  trusted certificate (stored in `root.crt`).
  ```bash
  cat >>$crt_file <server.crt
  ```

The data node is now set up to accept certificate authentication, and
the data and access nodes have keys and the user has a certificate.

### 5. Add the data nodes to the access node
Once the nodes are properly configured, you can continue following the
[multi-node setup][init_data_nodes].

### 6. Setting up additional roles
Allowing new roles to use the certificate to authenticate is simply a matter of
adding them to the certificate role.  Aside from that, the process of adding new
users should be the same as for [trust authentication](#trust-authentication).

First create the user on the access node if needed and grant it usage on the
foreign server objects corresponding to the data nodes:
```sql
CREATE ROLE testrole;
GRANT USAGE ON FOREIGN SERVER <data node name>, <data node name>, ... TO testrole;
```

If external clients need to connect to the access node as `testrole`
it is also necessary to add the `LOGIN` option. And, optionally, the
`PASSWORD` option if password authentication is used.

And finally add the role to all of the data nodes with [`distributed_exec`][distributed_exec]:
```sql
CALL distributed_exec($$ CREATE ROLE testrole LOGIN $$);
```

---

## Next steps
To start working with the system, you can look at documentation for
[distributed hypertables][].

All functions for modifying the node network are described in the API
docs:
- [add_data_node][]
- [attach_data_node][]
- [delete_data_node][]
- [detach_data_node][]
- [distributed_exec][]

[init_data_nodes]: /how-to-guides/distributed-hypertables/
[auth-password]: https://www.postgresql.org/docs/current/auth-password.html
[passfile]: https://www.postgresql.org/docs/current/libpq-pgpass.html
[md5sum]: https://www.tutorialspoint.com/unix_commands/md5sum.htm
[distributed hypertables]: /how-to-guides/distributed-hypertables/
[add_data_node]: /api/:currentVersion:/distributed-hypertables/add_data_node
[attach_data_node]: /api/:currentVersion:/distributed-hypertables/attach_data_node
[delete_data_node]: /api/:currentVersion:/distributed-hypertables/delete_data_node
[detach_data_node]: /api/:currentVersion:/distributed-hypertables/detach_data_node
[distributed_exec]: /api/:currentVersion:/distributed-hypertables/distributed_exec
[postgresql-hba]: https://www.postgresql.org/docs/12/auth-pg-hba-conf.html
[user-mapping]: https://www.postgresql.org/docs/current/sql-createusermapping.html
[multi-node-setup]: /how-to-guides/multinode-timescaledb/multinode-setup/
