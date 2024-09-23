---
title: TimescaleDB tuning tool
excerpt: Use the timescaledb-tune tool to automatically configure your TimescaleDB instance
products: [self_hosted]
keywords: [configuration, settings, timescaledb-tune]
tags: [tune]
---

# TimescaleDB tuning tool

To help make configuring TimescaleDB a little easier, you can use the [`timescaledb-tune`][tstune]
tool. This tool handles setting the most common parameters to good values based
on your system. It accounts for memory, CPU, and PostgreSQL version.
`timescaledb-tune` is packaged with the TimescaleDB binary releases as a
dependency, so if you installed Timescale from a binary release (including
Docker), you should already have access to the tool. Alternatively, you can use
the `go install` command to install it:

```bash
go install github.com/timescale/timescaledb-tune/cmd/timescaledb-tune@latest
```

The `timescaledb-tune` tool reads your system's `postgresql.conf` file and
offers interactive suggestions for your settings. Here is an example of the tool
running:

```bash
Using postgresql.conf at this path:
/usr/local/var/postgres/postgresql.conf

Is this correct? [(y)es/(n)o]: y
Writing backup to:
/var/folders/cr/example/T/timescaledb_tune.backup202101071520

shared_preload_libraries needs to be updated
Current:
#shared_preload_libraries = 'timescaledb'
Recommended:
shared_preload_libraries = 'timescaledb'
Is this okay? [(y)es/(n)o]: y
success: shared_preload_libraries will be updated

Tune memory/parallelism/WAL and other settings? [(y)es/(n)o]: y
Recommendations based on 8.00 GB of available memory and 4 CPUs for PostgreSQL 12

Memory settings recommendations
Current:
shared_buffers = 128MB
#effective_cache_size = 4GB
#maintenance_work_mem = 64MB
#work_mem = 4MB
Recommended:
shared_buffers = 2GB
effective_cache_size = 6GB
maintenance_work_mem = 1GB
work_mem = 26214kB
Is this okay? [(y)es/(s)kip/(q)uit]:
```

When you have answered the questions, the changes are written to your
`postgresql.conf` and take effect when you next restart.

If you are starting on a fresh instance and don't want to approve each group of
changes, you can automatically accept and append the suggestions to the end of
your `postgresql.conf` by using some additional flags when you run the tool:

```bash
timescaledb-tune --quiet --yes --dry-run >> /path/to/postgresql.conf
```

[tstune]: https://github.com/timescale/timescaledb-tune
