---
title: Low-downtime migrations with dual-write and backfill
excerpt: Migrate a hypertable or entire database with low downtime
products: [cloud, self_hosted]
keywords: [backups, restore]
tags: [recovery, logical backup, pg_dump, pg_restore]
---

# Dual-write and backfill

Dual-write and backfill is a migration strategy to move a large amount of
time-series data (100&nbsp;GB-4&nbsp;TB+) with low downtime (on the order of 
minutes).
Roughly, it consists of three steps:

1. Clone schema and relational data from source to target
1. Dual-write to source and target
1. Backfill time-series data

Dual-write and backfill can be used for any source database type, as long as it
can provide data in csv format. It can be used to move data from a PostgresSQL
source, and from TimescaleDB to TimescaleDB. If the source and target databases
are PostgresSQL, they can be of different versions, as long as the target is
greater than the source. If both source and target use TimescaleDB, the version
of TimescaleDB must be the same.

Dual-write and backfill works well when:
1. The bulk of the (on-disk) data is in time-series tables.
1. Writes by the application do not reference historical time-series data.
1. There is no requirement for transactional consistency (that is, it is possible
   to filter the time-series data by time and retain data integrity).
1. No `UPDATE` or `DELETE` queries will be run on time-series data in the
   source database during the migration process (or if they are, it happens in
   a controlled manner, such that it's possible to either ignore, or
   re-backfill).
1. Either the relational (non-time-series) data is small enough to be copied
   from source to target in an acceptable amount of time for this to be done
   with downtime, or the relational data can be copied asynchronously while the
   application continues to run (that is, changes relatively infrequently).

## Migration process

In detail, the migration process consists of the following steps:
1. Set up a second database
1. Modify the application to write to a secondary database
1. Migrate schema and relational data from source to target
1. Start the application in dual-write mode
1. Determine the consistency time `T`
1. Backfill time-series data from source to target
1. Enable retention and compression policies
1. Validate that all data is present in target database
1. Validate that target database can handle production load
1. Switch application to treat target database as primary (potentially continuing to write into source database, as a backup)

### 1. Set up a second database

[Create a database service in Timescale][create-service].

### 2. Modify the application to write to a secondary database 

How exactly to do this is dependent on the language that your application is
written in, and on how exactly your ingestion and application function. In the
simplest case, you simply execute two inserts in parallel. In the general case,
you will need to think about how to handle the failure to write to either the
old or new database, and what mechanism you want to or can build to recover
from such a failure.

You may also want to execute the same read queries on the old and new database,
in order to evaluate the correctness and performance of the results which the
queries deliver. Bear in mind that the new database will spend a certain amount
of time without all data being present, so you should expect that the results
are not the same for some period (potentially a number of days).

### 3. Set up schema and migrate relational data to new database

How exactly you perform this is dependent on whether you're migrating from
plain PostgreSQL, TimescaleDB, or some other database.

#### From TimescaleDB

Dump the database roles from the source database:

```
pg_dumpall -d "$SOURCE" \
  --quote-all-identifiers \
  --roles-only \
  --file=roles.sql
```

Timescale services do not support roles with superuser access. If your SQL
dump includes roles that have such permissions, you'll need to modify the file
to be compliant with the security model.

You can use the following `sed` command to remove unsupported statements and
permissions from your roles.sql file:

```
sed -i -E \
-e '/CREATE ROLE "postgres";/d' \
-e '/ALTER ROLE "postgres"/d' \
-e 's/(NO)*SUPERUSER//g' \
-e 's/(NO)*REPLICATION//g' \
-e 's/(NO)*BYPASSRLS//g' \
-e 's/GRANTED BY "[^"]*"//g' \
roles.sql
```

<Highlight type="note">
This command works only with the GNU implementation of sed (sometimes referred
to as gsed). For the BSD implementation (the default on macOS), you need to
add an extra argument to change the `-i` flag to `-i ''`.

To check the sed version, you can use the command sed --version. While the GNU
version will explicitly identify itself as GNU, the BSD version of sed
generally doesn't provide a straightforward --version flag and will simply
output an "illegal option" error.
</Highlight>

- `CREATE ROLE "postgres"`; and `ALTER ROLE "postgres"`: These statements are
  removed because they require superuser access, which is not supported
  by TimescaleDB Cloud.

- `(NO)SUPERUSER` | `(NO)REPLICATION` | `(NO)BYPASSRLS`: These are permissions
  that require superuser access.

- `GRANTED BY role_specification`: The GRANTED BY clause can also have permissions that
  require superuser access and should therefore be removed. Note: Per the
  TimescaleDB documentation, the GRANTOR in the GRANTED BY clause must be the
  current user, and this clause mainly serves the purpose of SQL compatibility.
  Therefore, it's safe to remove it.

Dump all plain tables and the TimescaleDB catalog from the source database:

```
pg_dump -d "$SOURCE" \
  --format=plain \
  --quote-all-identifiers \
  --no-tablespaces \
  --no-owner \
  --no-privileges \
  --exclude-table-data='_timescaledb_internal.*' \
  --file=dump.sql
```

a. `--no-tablespaces` is required because Timescale does not support
   tablespaces other than the default. This is a limitation.
b. `--no-owner` is required because tsdbadmin is not a superuser and cannot
   assign ownership in all cases. This flag means that everything will be
   owned by the tsdbadmin user in the target regardless of ownership in the
   source. This is a limitation.
c. `--no-privileges` is required because tsdbadmin is not a superuser and
   cannot assign privileges in all cases. This flag means that privileges
   assigned to other users will need to be reassigned in the target
   database as a manual clean-up task. This is a limitation.
d. `--exclude-table-data='_timescaledb_internal.*'` will dump the structure
   of the hypertable chunks, but not the data. This will create empty
   chunks on the target ready for the backfill process.

1. If the source database has the timescaledb extension installed in a schema
   other than "public" it will cause issues on Timescale. Edit the dump file to
   remove any references to the non-public schema. We need the extension in the
   "public" schema on Timescale. This is a limitation.
1. If any background jobs are owned by the "postgres" user, they need to be
   owned by "tsdbadmin" on the target database. Edit the dump file accordingly.

Load the roles and schema into the target database, and disable all background jobs.

```
psql -X -d "$TARGET" \
  -v ON_ERROR_STOP=1 \
  --echo-errors \
  -f roles.sql \
  -c 'select public.timescaledb_pre_restore();' \
  -f dump.sql \
  -f - <<'EOF'
begin;
select public.timescaledb_post_restore();

-- disable all background jobs
select public.alter_job(id::integer, scheduled=>false)
from _timescaledb_config.bgw_job
where id >= 1000
;
commit;
EOF
```

<Highlight type="note">
Background jobs need to be disabled to prevent continuous aggregates from
updating with incomplete data. Once the migration is complete, we will
refresh the continuous aggregates for the required range.
</Highlight>

#### From plain PostgreSQL

Dump the database roles from the source database:

```
pg_dumpall -d "$SOURCE" \
  --quote-all-identifiers \
  --roles-only \
  --file=roles.sql
```

Timescale services do not support roles with superuser access. If your SQL
dump includes roles that have such permissions, you'll need to modify the file
to be compliant with the security model.

You can use the following `sed` command to remove unsupported statements and
permissions from your roles.sql file:

```
sed -i -E \
-e '/CREATE ROLE "postgres";/d' \
-e '/ALTER ROLE "postgres"/d' \
-e 's/(NO)*SUPERUSER//g' \
-e 's/(NO)*REPLICATION//g' \
-e 's/(NO)*BYPASSRLS//g' \
-e 's/GRANTED BY "[^"]*"//g' \
roles.sql
```

<Highlight type="note">
This command works only with the GNU implementation of sed (sometimes referred
to as gsed). For the BSD implementation (the default on macOS), you need to
add an extra argument to change the `-i` flag to `-i ''`.

To check the sed version, you can use the command sed --version. While the GNU
version will explicitly identify itself as GNU, the BSD version of sed
generally doesn't provide a straightforward --version flag and will simply
output an "illegal option" error.
</Highlight>

- `CREATE ROLE "postgres"`; and `ALTER ROLE "postgres"`: These statements are
  removed because they require superuser access, which is not supported
  by TimescaleDB Cloud.

- `(NO)SUPERUSER` | `(NO)REPLICATION` | `(NO)BYPASSRLS`: These are permissions
  that require superuser access.

- `GRANTED BY role_specification`: The GRANTED BY clause can also have permissions that
  require superuser access and should therefore be removed. Note: Per the
  TimescaleDB documentation, the GRANTOR in the GRANTED BY clause must be the
  current user, and this clause mainly serves the purpose of SQL compatibility.
  Therefore, it's safe to remove it.

Dump all plain tables and the TimescaleDB catalog from the source database:

```
pg_dump -d "$SOURCE" \
  --format=plain \
  --quote-all-identifiers \
  --no-tablespaces \
  --no-owner \
  --no-privileges \
  --file=dump.sql
```

a. `--no-tablespaces` is required because Timescale does not support
   tablespaces other than the default. This is a limitation.
b. `--no-owner` is required because tsdbadmin is not a superuser and cannot
   assign ownership in all cases. This flag means that everything will be
   owned by the tsdbadmin user in the target regardless of ownership in the
   source. This is a limitation.
c. `--no-privileges` is required because tsdbadmin is not a superuser and
   cannot assign privileges in all cases. This flag means that privileges
   assigned to other users will need to be reassigned in the target
   database as a manual clean-up task. This is a limitation.

Load the roles and schema into the target database.

```
psql -X -d "$TARGET" \
  -v ON_ERROR_STOP=1 \
  --echo-errors \
  -f roles.sql \
  -f dump.sql
```

TODO: Should we add a mention that customers can exclude the data from large
tables and backfill manually using (these
instructions](/self-hosted/:currentVersion:/migration/schema-then-data/#restore-hypertables-in-timescale)?

#### From some other database

TODO

### 4. Start application in dual-write mode

With the target database set up, your application can now be started in
dual-write mode.

### 5. Determine the consistency time `T`

After dual-writes have been executing for a while, the target hypertable will
contain data in three time ranges: missing writes, late-arriving data, and the
"consistency" range

#### Missing writes

If the application is made up of multiple writers, and these writers did not
all simultaneously start writing into the target hypertable, there is a period
of time in which not all writes have made it into the target hypertable. This
period starts when the first writer begins dual-writing, and ends when the last
writer begins dual-writing.

#### Late-arriving data

Some applications have late-arriving data: measurements which have a timestamp
in the past, but which weren't written yet (for example from devices which had
intermittent connectivity issues). The window of late-arriving data is between
the present moment, and the maximum lateness.

#### Consistency range

The consistency range is the range in which there are no missing writes, and in
which all data has arrived, that is between the end of the missing writes range
and the beginning of the late-arriving data range.

The length of these ranges is defined by the properties of the application,
there is no one-size-fits-all way to determine what they are.
The consistency time `T` is an arbitrarily chosen time in the consistency range.

### 6. Backfill data from source to target

If your source database is using TimescaleDB, we recommend using our backfill
tool `timescaledb-backfill`.

If your source database is not using TimescaleDB, we recommend dumping the data
from your source database on a per-table basis into CSV format, and restoring
those CSVs into the target database using the `timescaledb-parallel-copy` tool.

### 7. Enable retention and compression policies

Reenable all retention and compression policies.
If the backfill process took long enough for there to be significant
retention/compression work to be done, it may be preferable to run the jobs
manually in order to have control over the pacing of the work until it is
caught up before reenabling.

### 8. Validate that all data is present in target database

One possible approach to validating this is to compare row counts on a
chunk-by-chunk basis. One way to do so is to run `select count(*) ...` which is
exact but potentially costly. Another way to do it would be to run analyze on
both the source and target chunk and then look at the `reltuples` column of the
`pg_class` table for the chunks' rows. This would not be exact but would be
less costly.

### 9. Validate that target database can handle production load

Assuming dual-writes have been in place, the target database should be holding
up to production write traffic. Now would be the right time to determine if the
new database can serve all production traffic (both reads _and_ writes). How
exactly this is done is application-specific and up to you to determine.

### 10. Switch production workload to new database

Once you've validated that all the data is present, and that the new database
can handle the production workload, the final step is to switch to the new
database as your primary. You may want to continue writing to the old database
for a period, until you are certain that the new database is holding up to all
production traffic.

[create-service]:  /use-timescale/:currentVersion:/services/create-a-service/
