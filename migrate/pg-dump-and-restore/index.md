---
title: Migrations using pg_dump and pg_restore
excerpt: Migrate a hypertable or entire database with native PostgreSQL commands
products: [cloud, self_hosted]
keywords: [backups, restore]
tags: [recovery, logical backup, pg_dump, pg_restore]
---

import ConsiderCloud from "versionContent/_partials/_consider-cloud.mdx";

# Migrate using `pg_dump` and `pg_restore`

It is possible to migrate from self-hosted PostgreSQL or TimescaleDB to
Timescale using the native PostgreSQL [`pg_dump`][pg_dump] and
[`pg_restore`][pg_restore] programs. This works for compressed hypertables,
without having to decompress data before you begin.

If you're planning on migrating to Timescale, there are a few limitations that
you must be aware of:

1. Timescale does not allow having multiple databases per instance.
   If you would like to migrate a PostgreSQL database cluster consisting of
   multiple databases, you must either create a timescale instance per
   database, or you can merge each database into its own schema in the
   Timescale instance.

TODO: more caveats?

<Highlight type="info">
A long-running `pg_dump` against a database can cause various issues due to the
types of locks that `pg_dump` takes. Consult the troubleshooting section
[Dumping and locks][dumping-and-locks] for more details.
</Highlight>


[pg_dump]: https://www.postgresql.org/docs/current/static/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/current/static/app-pgrestore.html
