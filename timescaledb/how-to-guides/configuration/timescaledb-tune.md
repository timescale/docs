## Using `timescaledb-tune`

To streamline the configuration process, we've created a tool called
[`timescaledb-tune`][tstune] that handles setting the most common parameters to
good values based on your system, accounting for memory, CPU, and PostgreSQL
version. `timescaledb-tune` is packaged along with our binary releases as
a dependency, so if you installed one of our binary releases (including
Docker), you should have access to the tool. Alternatively, with a standard
Go environment, you can also `go get` the repository to install it.

`timescaledb-tune` reads your system's `postgresql.conf` file and offers
interactive suggestions for updating your settings:
```
Using postgresql.conf at this path:
/usr/local/var/postgres/postgresql.conf

Is this correct? [(y)es/(n)o]: y
Writing backup to:
/var/folders/cr/zpgdkv194vz1g5smxl_5tggm0000gn/T/timescaledb_tune.backup201901071520

shared_preload_libraries needs to be updated
Current:
#shared_preload_libraries = 'timescaledb'
Recommended:
shared_preload_libraries = 'timescaledb'
Is this okay? [(y)es/(n)o]: y
success: shared_preload_libraries will be updated

Tune memory/parallelism/WAL and other settings? [(y)es/(n)o]: y
Recommendations based on 8.00 GB of available memory and 4 CPUs for PostgreSQL 11

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

These changes are then written to your `postgresql.conf` and take effect
on the next (re)start. If you are starting on fresh instance and don't feel
the need to approve each group of changes, you can also automatically accept
and append the suggestions to the end of your `postgresql.conf` like so:
```bash
$ timescaledb-tune --quiet --yes --dry-run >> /path/to/postgresql.conf
```


[tstune]: https://github.com/timescale/timescaledb-tune
[pgtune]: http://pgtune.leopard.in.ua/
[async-commit]: https://www.postgresql.org/docs/current/static/wal-async-commit.html
[synchronous-commit]: https://www.postgresql.org/docs/current/static/runtime-config-wal.html#GUC-SYNCHRONOUS-COMMIT
[lock-management]: https://www.postgresql.org/docs/current/static/runtime-config-locks.html
[docker]: /how-to-guides/install-timescaledb//docker/installation-docker
[wale]: /how-to-guides/backup-and-restore/docker-and-wale/
[chunk_detailed_size]: /api/:currentVersion:/hypertable/chunk_detailed_size
