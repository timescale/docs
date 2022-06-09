# View logs and metadata

To troubleshoot your TimescaleDB instance, you can examine its logging output.
For how to set up and find logs in TimescaleDB, refer to the
[PostgreSQL documentation][postgres-logs].

## View logs in Docker
If you have TimescaleDB installed in a Docker container, you can view your logs
using Docker, instead of looking in the PostgreSQL log destination. For more
information, see the [Docker documentation on logs][docker-logs].

## Dump TimescaleDB meta data

To help when asking for support and reporting bugs,
TimescaleDB includes a SQL script that outputs metadata
from the internal TimescaleDB tables as well as version information.
The script is available in the source distribution in `scripts/`
but can also be [downloaded separately][].
To use it, run:

```bash
psql [your connect flags] -d your_timescale_db < dump_meta_data.sql > dumpfile.txt
```

and then inspect `dump_file.txt` before sending it together with a bug report or support question.

[docker-logs]: https://docs.docker.com/config/containers/logging/
[downloaded separately]: https://raw.githubusercontent.com/timescale/timescaledb/master/scripts/dump_meta_data.sql
[postgres-logs]: https://www.postgresql.org/docs/current/runtime-config-logging.html
