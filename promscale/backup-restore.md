---
title: Back up and restore Promscale
excerpt: Learn how to back up and restore a Promscale database
product: promscale
keywords: [backup, restore]
---

# Back up and restore Promscale

## Prerequisites

Trusted extensions were introduced in PostgreSQL 13. If using a PostgreSQL 
version prior to 13, the database user used to perform the backup and restore 
must have superuser access. If using version 13 and later, the database user 
must have the `CREATE` privilege on the database.

## Backup

Assuming you use a database user that has appropriate privileges as listed 
above, there is nothing special required to take a backup of the Promscale 
database. There are many ways to backup a PostgreSQL database, the simplest 
being to use pg_dump with the plain format.

For example:

```bash
pg_dump -h localhost -p 5432 -U tsdbadmin -d mydb -F p -f dump.sql
```
To backup larger databases use the custom format:

```bash
pg_dump -h localhost -p 5432 -U tsdbadmin -d mydb -F c -f dump.dat
```
## Restore

Starting with version 0.11.0 of the Promscale connector and 0.5.0 of the 
Promscale extension, database objects are managed by the extension.

If the timescaledb extension is not already installed in the target database, 
install it. Then, put the timescaledb extension in restore mode. The promscale 
extension must be created AFTER calling `public.timescaledb_pre_restore()` 
during a restore. This signals the promscale extension to expect a restore and 
create database objects accordingly.

```sql
CREATE EXTENSION timescaledb;
SELECT public.timescaledb_pre_restore();
CREATE EXTENSION promscale;
```

Using a database user with the privileges described [above][prerequisites],
restore the database. If pg_dump was used as described above, you may restore
the database with a command like below:

```bash
psql -h localhost p 5432 -U tsdbadmin -d mydb -f dump.sql
```
If you used `pg_dump` to backup in custom format, use `pg_restore`:
```bash
pg_restore -Fc -d mydb dump.dat
SELECT public.timescaledb_post_restore();
```

Do not use the `-v ON_ERROR_STOP=1` option with the above command. Some 
statements during the restore will fail. For example, pg_dump adds a statement
to set the comment on the timescaledb extension (for example,
`COMMENT ON EXTENSION promscale IS 'tables, types and functions supporting Promscale';`
) which will fail. This is unfortunate, but unavoidable, expected, and does not impact 
the validity of the restored database.

After the restore completes, run the following two commands to finalize the
restore.

```sql
SELECT public.timescaledb_post_restore();
SELECT prom_api.promscale_post_restore();
```

[prerequisites]: #prerequisites
