## Changing configuration with Docker [](docker-config)

When running TimescaleDB via a [Docker container][docker], there are
two approaches to modifying your PostgreSQL configuration.  In the
following example, we modify the size of the database instance's
write-ahead-log (WAL) from 1GB to 2GB in a Docker container named
`timescaledb`.

#### Modifying postgres.conf inside Docker

1. Get into a shell in Docker in order to change the configuration on a running container.
```
docker start timescaledb
docker exec -i -t timescaledb /bin/bash
```

2. Edit and then save the config file, modifying the setting for the desired configuration parameter (e.g., `max_wal_size`).
```
vi /var/lib/postgresql/data/postgresql.conf
```

3. Restart the container so the config gets reloaded.
```
docker restart timescaledb
```

4. Test to see if the change worked.
```
    docker exec -it timescaledb psql -U postgres

    postgres=# show max_wal_size;
     max_wal_size
    --------------
    2GB
```

#### Specify configuration parameters as boot options

Alternatively, one or more parameters can be passed in to the `docker run`
command via a `-c` option, as in the following.

```
docker run -i -t timescale/timescaledb:latest-pg10 postgres -cmax_wal_size=2GB
```

Additional examples of passing in arguments at boot can be found in our
[discussion about using WAL-E][wale] for incremental backup.


[tstune]: https://github.com/timescale/timescaledb-tune
[pgtune]: http://pgtune.leopard.in.ua/
[async-commit]: https://www.postgresql.org/docs/current/static/wal-async-commit.html
[synchronous-commit]: https://www.postgresql.org/docs/current/static/runtime-config-wal.html#GUC-SYNCHRONOUS-COMMIT
[lock-management]: https://www.postgresql.org/docs/current/static/runtime-config-locks.html
[docker]: /how-to-guides/install-timescaledb//docker/installation-docker
[wale]: /how-to-guides/backup-and-restore/docker-and-wale/
[chunk_detailed_size]: /api/:currentVersion:/hypertable/chunk_detailed_size
