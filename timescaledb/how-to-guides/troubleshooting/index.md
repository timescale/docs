# Troubleshooting

If you run into problems when using TimescaleDB, there are a few things that you
can do.  There are some solutions to common errors below as well as ways to output
diagnostic information about your setup.  If you need more guidance, you can join
the support [slack group][slack] or post an issue on the TimescaleDB [github][].

## Common Errors
### Error updating TimescaleDB when using a third-party PostgreSQL admin tool.

The update command `ALTER EXTENSION timescaledb UPDATE` must be the first command
executed upon connection to a database.  Some admin tools execute command before
this, which can disrupt the process.  It may be necessary for you to manually update
the database with `psql`.  See our [update docs][update-db] for details.

###  Log error: could not access file "timescaledb" [](access-timescaledb)

If your PostgreSQL logs have this error preventing it from starting up,
you should double check that the TimescaleDB files have been installed
to the correct location. Our installation methods use `pg_config` to
get PostgreSQL's location. However if you have multiple versions of
PostgreSQL installed on the same machine, the location `pg_config`
points to may not be for the version you expect. To check which
version TimescaleDB used:
```bash
$ pg_config --version
PostgreSQL 12.3
```

If that is the correct version, double check that the installation path is
the one you'd expect. For example, for PostgreSQL 11.0 installed via
Homebrew on macOS it should be `/usr/local/Cellar/postgresql/11.0/bin`:
```bash
$ pg_config --bindir
/usr/local/Cellar/postgresql/11.0/bin
```

If either of those steps is not the version you are expecting, you need
to either (a) uninstall the incorrect version of PostgreSQL if you can or
(b) update your `PATH` environmental variable to have the correct
path of `pg_config` listed first, i.e., by prepending the full path:
```bash
$ export PATH = /usr/local/Cellar/postgresql/11.0/bin:$PATH
```
Then, reinstall TimescaleDB and it should find the correct installation
path.

### ERROR: could not access file "timescaledb-\<version\>": No such file or directory [](alter-issue)

If the error occurs immediately after updating your version of TimescaleDB and
the file mentioned is from the previous version, it is probably due to an incomplete
update process. Within the greater PostgreSQL server instance, each
database that has TimescaleDB installed needs to be updated with the SQL command
`ALTER EXTENSION timescaledb UPDATE;` while connected to that database.  Otherwise,
the database will be looking for the previous version of the timescaledb files.

See [our update docs][update-db] for more info.

---

## Getting more information

###  EXPLAINing query performance [](explain)

PostgreSQL's EXPLAIN feature allows users to understand the underlying query
plan that PostgreSQL uses to execute a query. There are multiple ways that
PostgreSQL can execute a query: for example, a query might be fulfilled using a
slow sequence scan or a much more efficient index scan. The choice of plan
depends on what indexes are created on the table, the statistics that PostgreSQL
has about your data, and various planner settings. The EXPLAIN output let's you
know which plan PostgreSQL is choosing for a particular query. PostgreSQL has a
[in-depth explanation][using explain] of this feature.

To understand the query performance on a hypertable, we suggest first
making sure that the planner statistics and table maintenance is up-to-date on the hypertable
by running `VACUUM ANALYZE <your-hypertable>;`. Then, we suggest running the
following version of EXPLAIN:

```
EXPLAIN (ANALYZE on, BUFFERS on) &lt;original query&gt;;
```

If you suspect that your performance issues are due to slow IOs from disk, you
can get even more information by enabling the
[track\_io\_timing][track_io_timing] variable with `SET track_io_timing = 'on';`
before running the above EXPLAIN.

When asking query-performance related questions in our [support portal][]
or via [slack][], providing the EXPLAIN output of a
query is immensely helpful.

---

## Dump TimescaleDB meta data [](dump-meta-data)

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

[slack]: https://slack.timescale.com/
[github]: https://github.com/timescale/timescaledb/issues
[update-db]: /update-timescaledb
[using explain]: https://www.postgresql.org/docs/current/static/using-explain.html
[track_io_timing]: https://www.postgresql.org/docs/current/static/runtime-config-statistics.html#GUC-TRACK-IO-TIMING
[downloaded separately]: https://raw.githubusercontent.com/timescale/timescaledb/master/scripts/dump_meta_data.sql
[support portal]: https://www.timescale.com/support
