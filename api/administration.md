---
title: Administrative functions
excerpt: Prepare a database for backup and restore, and keep track of your setup data
keywords: [administration]
tags: [backup, restore, set up]
---

# Administrative Functions

These administrative APIs help you prepare a database before and after a restore event. They also help you keep track of your TimescaleDB setup data.

## Dump TimescaleDB meta data

To help when asking for support and reporting bugs, TimescaleDB includes a SQL dump script. It outputs metadata from the internal TimescaleDB tables, along with version information.

This script is available in the source distribution in `scripts/`. To use it, run:

```bash
psql [your connect flags] -d your_timescale_db < dump_meta_data.sql > dumpfile.txt
```

Inspect `dumpfile.txt` before sending it together with a bug report or support question.

## get_telemetry_report()

Returns the background [telemetry][telemetry] string sent to Timescale servers. 

If telemetry is disabled, it sends the string that would be sent if telemetry were enabled.

### Sample usage

View the telemetry report:

```sql
SELECT get_telemetry_report();
```

## timescaledb_post_restore()

Perform the required operations after you have finished restoring the database using `pg_restore`. Specifically, this resets the `timescaledb.restoring` GUC and restarts any background workers. 

For more information, see [Migrate using pg_dump and pg_restore].

### Sample usage

Prepare the database for normal use after a restore:

```sql
SELECT timescaledb_post_restore();
```

## timescaledb_pre_restore()

Perform the required operations so that you can restore the database using `pg_restore`. Specifically, this sets the `timescaledb.restoring` GUC to `on` and stops any background workers which could have been performing tasks. 

The background workers are stopped until the [timescaledb_post_restore()](#timescaledb_post_restore) function is run, after the restore operation is complete.

For more information, see [Migrate using pg_dump and pg_restore].

<Highlight type="important">
After using `timescaledb_pre_restore()`, you need to run [timescaledb_post_restore()](#timescaledb_post_restore) before you can use the database normally.
</Highlight>

### Sample usage

Prepare to restore the database:

```sql
SELECT timescaledb_pre_restore();
```

[Migrate using pg_dump and pg_restore]: /migrate/:currentVersion:/pg-dump-and-restore/
[telemetry]: /self-hosted/:currentVersion:/configuration/telemetry
