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

For more information, consult the step-by-step guide for your source database:

- [pg_dump/restore from TimescaleDB][from-timescaledb]
- [pg_dump/restore from PostgreSQL][from-postgres]

If you're planning on migrating to Timescale, there are a few limitations that
you must be aware of:

- [Timescale does not allow having multiple databases per instance].
- [Timescale does not support tablespaces].
- [Timescale does not support all available extensions].
- [Timescale does not provide a superuser]. 

[Timescale does not allow having multiple databases per instance]: /migrate/:currentVersion:/troubleshooting/#only-one-database-per-instance
[Timescale does not support tablespaces]: /migrate/:currentVersion:/troubleshooting/#tablespaces
[Timescale does not support all available extensions]: /migrate/:currentVersion:/troubleshooting/#extension-availability
[Timescale does not provide a superuser]: /migrate/:currentVersion:/troubleshooting/#superuser-privileges

[//]: # (TODO: more caveats?)

<Highlight type="note">
A long-running `pg_dump` against a database can cause various issues due to the
types of locks that `pg_dump` takes. Consult the troubleshooting section
[dumping and locks](/migrate/:currentVersion:/troubleshooting/#dumping-and-locks)
for more details.
</Highlight>

[pg_dump]: https://www.postgresql.org/docs/current/static/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/current/static/app-pgrestore.html
[from-timescaledb]: /migrate/:currentVersion:/pg-dump-and-restore/pg-dump-restore-from-timescaledb/
[from-postgres]: /migrate/:currentVersion:/pg-dump-and-restore/pg-dump-restore-from-postgres/
