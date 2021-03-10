## Certificate authentication [](multi-node-auth-certificate)
This method is more complex to set up than password authentication, but 
more secure and easier to automate.

The steps to set up certificate authentication are:

1. Set up a certificate authority (CA) that can sign certificates and
   create a root certificate.
2. Generate a key and certificate each for the access node and data nodes.
3. Configure the access node and data node to use the certificates and
   to accept certified connections.
4. Set up each user with appropriate permissions (keys, certificates, privileges).
5. Add data nodes to the access node.
6. Add any additional users.

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
```
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

>:TIP: You can configure the location of the user certificates and
>keys outside of the data directory using `timescaledb.ssl_dir`.

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

Once the nodes are properly configured, you can continue following the [multi-node setup][init_data_nodes].

### 6. Setting up additional roles [](multi-node-auth-certificate-roles)

Allowing new roles to use the certificate to authenticate is simply a matter of
adding them to the certificate role.  Aside from that, the process of adding new
users should be the same as for [trust authentication](multi-node-auth-trust-roles).

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
