# Multi-node authentication
When you have your instances set up, you need to configure them to accept
connections from the access node to the data nodes. The authentication mechanism
you choose for this can be different than the one used by external clients to
connect to the access node.

How you set up your multi-node cluster depends on which authentication mechanism
you choose. The options are:
*   Trust authentication. This is the simplest approach, but also the
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

### Setting up trust authentication
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

## Password authentication
Password authentication requires every user role to know a password before it
can establish a connection between the access node and the data nodes. This
internal password is only used by the access node and it does not need to be
the same password as the client uses to connect to the access node. External
users do not need to share the internal password at all, it can be set up and
administered by the database administrator.

The access node stores the internal password so that it can verify the correct
password has been provided by a data node. We recommend that you store the
password on the access node in a local password file, and this section shows you
how to set this up. However, if it works better in your environment, you can use
[user mappings][user-mapping] to store your passwords instead. This is slightly
less secure than a local pasword file, because it requires one mapping for each
data node in your cluster.

This section sets up your password authentication using SCRAM SHA-256 password
authentication. For other password authentication methods, see the
[PostgreSQL authentication documentation][auth-password].

Before you start, check that you can use the `postgres` username to log in to
your access node.

<procedure>

### Setting up password authentication
1.  On the access node, open the `postgresql.conf` configuration file, and add
    or edit this line:
    ```txt
    password_encryption = 'scram-sha-256'		# md5 or scram-sha-256
    ```
1.  Repeat for each of the data nodes.
1.  On each of the data nodes, at the `psql` prompt,  locate the `pg_hba.conf`
    configuration file:
    ```sql
    SHOW hba_file
    ```
1.  On each of the data nodes, open the `pg_hba.conf` configuration file, and
    add or edit this line to enable encrypted authentication to the access
    node:
    ```txt
    # IPv4 local connections:
    # TYPE  DATABASE  USER  ADDRESS      METHOD
    host    all       all   192.0.2.20   scram-sha-256 #where '192.0.2.20' is the access node IP
    ```
1.  On the access node, open or create the password file at `data/passfile`.
    This file stores the passwords for each role that the access node connects
    to on the data nodes. If you need to change the location of the password
    file, adjust the `timescaledb.passfile` setting in the `postgresql.conf`
    configuration file.
1.  On the access node, open the `passfile` file, and add a line like this for
    each user, starting with the `postgres` user:
    ```bash
    *:*:*:postgres:xyzzy #assuming 'xyzzy' is the password for the 'postgres' user
    ```
1.  On the access node, at the command prompt, change the permissions of the
    `passfile` file:
    ```bash
    chmod 0600 passfile
    ```
1.  On the access node, and on each of the data nodes, reload the server
    configuration to pick up the changes:
    ```bash
    pg_ctl reload
    ```
1.  If you have not already done so, add the data nodes to the access node. For
    instructions, see the [multi-node setup][multi-node-setup] section.
1.  On the access node, at the `psql` prompt, create additional roles, and
    grant them access to foreign server objects for the data nodes:
    ```sql
    CREATE ROLE testrole PASSWORD 'clientpass' LOGIN;
    GRANT USAGE ON FOREIGN SERVER <data node name>, <data node name>, ... TO testrole;
    ```
    The `clientpass` password is used by external clients to connect to the access node as user `testrole`. If the access node is configured to accept other authentication methods, or the role is not a login role, then you might not need to do this step.
1.  On the access node, add the new role to each of the data nodes with
    [`distributed_exec`][distributed_exec]. Make sure you add the `PASSWORD`
    parameter to specify a different password to use when connecting to the
    data nodes with role `testrole`:
    ```sql
    CALL distributed_exec($$ CREATE ROLE testrole PASSWORD 'internalpass' LOGIN $$);
    ```
1.  On the access node, add the new role to the `passfile` you created earlier,
    by adding this line:
    ```bash
    *:*:*:testrole:internalpass #assuming 'internalpass' is the password used to connect to data nodes
    ```

<highlight type="important">
Any user passwords that you created before you set up password authentication
need to be re-created so that they use the new encryption method.
</highlight>

</procedure>

## Certificate authentication
This method is a bit more complex to set up than password authentication, but
it is more secure, easier to automate, and can be customized to your security environment.

To use certificates, the access node and each data node need three files:
*   The root CA certificate, called `root.crt`. This certificate serves as the
    root of trust in the system. It is used to verify the other certificates.
*   A node certificate, called `server.crt`. This certificate provides the node
    with a trusted identity in the system.
*   A node certificate key, called `server.key`. This provides proof of
    ownership of the node certificate. Make sure you keep this file private on
    the node where it is generated.

You can purchase certificates from a commercial certificate authority (CA), or
generate your own self-signed CA. This section shows you how to use your access
node certificate to create and sign new user certificates for the data nodes.

<procedure>

### Setting up certificate authentication
1.  On the access node, at the command prompt, generate a private key called
    `auth.key`:
    ```bash
    openssl genpkey -algorithm rsa -out auth.key
    ```
1.  Generate a self-signed root certificate for the certificat authority (CA):
    ```bash
    openssl req -new -key auth.key -days 3650 -out root.crt -x509
    ```

<!--- Lana, you're up to here! --LKB 2021-10-22-->

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

</procedure>


[init_data_nodes]: /how-to-guides/distributed-hypertables/
[auth-password]: https://www.postgresql.org/docs/current/auth-password.html
[passfile]: https://www.postgresql.org/docs/current/libpq-pgpass.html
[md5sum]: https://www.tutorialspoint.com/unix_commands/md5sum.htm
[distributed_exec]: /api/:currentVersion:/distributed-hypertables/distributed_exec
[user-mapping]: https://www.postgresql.org/docs/current/sql-createusermapping.html
[multi-node-setup]: /how-to-guides/multinode-timescaledb/multinode-setup/
