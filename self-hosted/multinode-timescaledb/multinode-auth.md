---
title: Multi-node authentication
excerpt: Configure authentication between access nodes and data nodes
products: [self_hosted]
keywords: [multi-node, authenticate]
tags: [admin]
---

import MultiNodeDeprecation from "versionContent/_partials/_multi-node-deprecation.mdx";

<MultiNodeDeprecation />

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

<Highlight type="important">
Going beyond the simple trust approach to create a secure system can be complex,
but it is important to secure your database appropriately for your environment.
We do not recommend any one security model, but encourage you to perform a risk
assessment and implement the security model that best suits your environment.
</Highlight>

## Trust authentication

Trusting all incoming connections is the quickest way to get your multi-node
environment up and running, but it is not a secure method of operation. Use this
only for developing a proof of concept, do not use this method for production
installations.

<Highlight type="warning">
The trust authentication method allows insecure access to all nodes. Do not use
this method in production. It is not a secure method of operation.
</Highlight>

<Procedure>

### Setting up trust authentication

1.  Connect to the access node with `psql`, and locate the `pg_hba.conf` file:

    ```sql
    SHOW hba_file;
    ```

1.  Open the `pg_hba.conf` file in your preferred text editor, and add this
    line. In this example, the access node is located at IP `192.0.2.20` with a
    mask length of `32`. You can add one of these two lines:

    ```txt

    # Using local loopback TCP/IP connections

    # TYPE  DATABASE        USER            ADDRESS                 METHOD
    host    all             all             192.0.2.20/32            trust

    # The same as the previous line, but using a separate netmask column

    # TYPE  DATABASE        USER            IP-ADDRESS      IP-MASK             METHOD
    host    all             all             192.0.2.20      255.255.255.255    trust

1.  At the command prompt, reload the server configuration:

    ```bash
    pg_ctl reload
    ```

    On some operating systems, you might need to use the `pg_ctlcluster` command
    instead.

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

<Highlight type="important">
Make sure you create the role with the `LOGIN` privilege on the data nodes, even
if you don't use this privilege on the access node. For all other privileges,
ensure they are same on the access node and the data nodes.
</Highlight>

</Procedure>

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

<Procedure>

### Setting up password authentication

1.  On the access node, open the `postgresql.conf` configuration file, and add
    or edit this line:

    ```txt
    password_encryption = 'scram-sha-256'  # md5 or scram-sha-256
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

    The `clientpass` password is used by external clients to connect to the
    access node as user `testrole`. If the access node is configured to accept
    other authentication methods, or the role is not a login role, then you
    might not need to do this step.
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

<Highlight type="important">
Any user passwords that you created before you set up password authentication
need to be re-created so that they use the new encryption method.
</Highlight>

</Procedure>

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

Keys and certificates serve different purposes on the data nodes and access
node. For the access node, a signed certificate is used to verify user
certificates for access. For the data nodes, a signed certificate authenticates
the node to the access node.

<Procedure>

### Generating a self-signed root certificate for the access node

1.  On the access node, at the command prompt, generate a private key called
    `auth.key`:

    ```bash
    openssl genpkey -algorithm rsa -out auth.key
    ```

1.  Generate a self-signed root certificate for the certificate authority (CA),
    called `root.cert`:

    ```bash
    openssl req -new -key auth.key -days 3650 -out root.crt -x509
    ```

1.  Complete the questions asked by the script to create your root certificate.
    Type your responses in, press `enter` to accept the default value shown in
    brackets, or type `.` to leave the field blank. For example:

    ```txt
    Country Name (2 letter code) [AU]:US
    State or Province Name (full name) [Some-State]:New York
    Locality Name (eg, city) []:New York
    Organization Name (eg, company) [Internet Widgets Pty Ltd]:Example Company Pty Ltd
    Organizational Unit Name (eg, section) []:
    Common Name (e.g. server FQDN or YOUR name) []:http://cert.example.com/
    Email Address []:
    ```

</Procedure>

When you have created the root certificate on the access node, you can generate
certificates and keys for each of the data nodes. To do this, you need to create
a certificate signing request (CSR) for each data node.

The default names for the key is `server.key`, and for the certificate is
`server.crt`. They are stored in together, in the `data` directory on the data
node instance.

The default name for the CSR is `server.csr` and you need to sign
it using the root certificate you created on the access node.

<Procedure>

### Generating keys and certificates for data nodes

1.  On the access node, generate a certificate signing request (CSR)
    called `server.csr`, and create a new key called `server.key`:

    ```bash
    openssl req -out server.csr -new -newkey rsa:2048 -nodes \
    -keyout server.key
    ```

1.  Sign the CSR using the root certificate CA you created earlier,
    called `auth.key`:

    ```bash
    openssl ca -extensions v3_intermediate_ca -days 3650 -notext \
    -md sha256 -in server.csr -out server.crt
    ```

1.  Move the `server.crt` and `server.key` files from the access node, on to
    each data node, in the `data` directory. Depending on your network setup,
    you might need to use portable media.
1.  Copy the root certificate file `root.crt` from the access node, on to each
    data node, in the `data` directory. Depending on your network setup, you
    might need to use portable media.

</Procedure>

When you have created the certificates and keys, and moved all the files into
the right places on the data nodes, you can configure the data nodes to use SSL
authentication.

<Procedure>

### Configuring data nodes to use SSL authentication

1.  On each data node, open the `postgresql.conf` configuration file and add or
    edit the SSL settings to enable certificate authentication:

    ```txt
    ssl = on
    ssl_ca_file = 'root.crt'
    ssl_cert_file = 'server.crt'
    ssl_key_file = 'server.key'
    ```

1.  [](#)<optional />If you want the access node to use certificate authentication
    for login, make these changes on the access node as well.

1.  On each data node, open the `pg_hba.conf` configuration file, and add or
    edit this line to allow any SSL user log in with client certificate
    authentication:

    ```txt
    # TYPE    DATABASE  USER        ADDRESS   METHOD  OPTIONS
    hostssl   all       all         all       cert    clientcert=1
    ```

<Highlight type="note">
If you are using the default names for your certificate and key, you do not need
to explicitly set them. The configuration looks for `server.crt` and
`server.key` by default. If you use different names for your certificate and
key, make sure you specify the correct names in the `postgresql.conf`
configuration file.
</Highlight>

</Procedure>

When your data nodes are configured to use SSL certificate authentication, you
need to create a signed certificate and key for your access node. This allows
the access node to log in to the data nodes.

<Procedure>

### Creating certificates and keys for the access node

1.  On the access node, as the `postgres` user, compute a base name for the
    certificate files using [md5sum][], generate a subject identifier, and
    create names for the key and certificate files:

    ```bash
    pguser=postgres
    base=`echo -n $pguser | md5sum | cut -c1-32`
    subj="/C=US/ST=New York/L=New York/O=Timescale/OU=Engineering/CN=$pguser"
    key_file="timescaledb/certs/$base.key"
    crt_file="timescaledb/certs/$base.crt"
    ```

1.  Generate a new random user key:

    ```bash
    openssl genpkey -algorithm RSA -out "$key_file"
    ```

1.  Generate a certificate signing request (CSR). This file is temporary,
    stored in the `data` directory, and is deleted later on:

    ```bash
    openssl req -new -sha256 -key $key_file -out "$base.csr" -subj "$subj"
    ```

1.  Sign the CSR with the access node key:

    ```bash
    openssl ca -batch -keyfile server.key -extensions v3_intermediate_ca \
      -days 3650 -notext -md sha256 -in "$base.csr" -out "$crt_file"
    rm $base.csr
    ```

1.  Append the node certificate to the user certificate. This completes the
    certificate verification chain and makes sure that all certificates are
    available on the data node, up to the trusted certificate stored
    in `root.crt`:

    ```bash
    cat >>$crt_file <server.crt
    ```

<Highlight type="note">
By default, the user key files and certificates are stored on the access node in
the `data` directory, under `timescaledb/certs`. You can change this location
using the `timescaledb.ssl_dir` configuration variable.
</Highlight>

</Procedure>

Your data nodes are now set up to accept certificate authentication, the data
and access nodes have keys, and the `postgres` user has a certificate. If you
have not already done so, add the data nodes to the access node. For
instructions, see the [multi-node setup][multi-node-setup] section. The final
step is add additional user roles.

<Procedure>

### Setting up additional user roles

1.  On the access node, at the `psql` prompt, create the new user and grant
    permissions:

    ```sql
    CREATE ROLE testrole;
    GRANT USAGE ON FOREIGN SERVER <data node name>, <data node name>, ... TO testrole;
    ```

    If you need external clients to connect to the access node as `testrole`,
    make sure you also add the `LOGIN` option. You can also enable password
    authentication by adding the `PASSWORD` option.

1.  On the access node, use the [`distributed_exec`][distributed_exec] command
    to add the role to all the data nodes:

    ```sql
    CALL distributed_exec($$ CREATE ROLE testrole LOGIN $$);
    ```

</Procedure>

[auth-password]: https://www.postgresql.org/docs/current/auth-password.html
[distributed_exec]: /api/:currentVersion:/distributed-hypertables/distributed_exec
[md5sum]: https://www.tutorialspoint.com/unix_commands/md5sum.htm
[multi-node-setup]: /self-hosted/:currentVersion:/multinode-timescaledb/multinode-setup/
[user-mapping]: https://www.postgresql.org/docs/current/sql-createusermapping.html
