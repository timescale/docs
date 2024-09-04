---
title: User permissions do not allow chunks to be compressed or decompressed
section: troubleshooting
products: [cloud, mst, self_hosted]
topics: [hypertables, compression, configuration]
errors:
  - language: text
    message: |-
      ERROR:  must be owner of hypertable "HYPERTABLE_NAME"
apis:
  - [compression, compress_chunk(), decompress_chunk(), recompress_chunk()]
  - [timescaledb_information.chunks, timescaledb_information.compression_settings]
keywords: [hypertables, compression, indexes, security, users]
tags: [hypertables, compression, indexes, security, users]
---

{/*
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
*/}

If you attempt to compress or decompress a chunk with a non-privileged user
account, you might get this error. To compress or decompress a chunk, your user
account must have permissions that allow it to perform `CREATE INDEX` on the
chunk. You can check the permissions of the current user with this command at
the `psql` command prompt:

```sql
\dn+ <USERNAME>
```

To resolve this problem, grant your user account the appropriate privileges with
this command:

```sql
GRANT PRIVILEGES
    ON TABLE <TABLE_NAME>
    TO <ROLE_TYPE>;
```

For more information about the `GRANT` command, see the
[PostgreSQL documentation][pg-grant].

[pg-grant]: https://www.postgresql.org/docs/current/sql-grant.html
