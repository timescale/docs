# Compress data in Promscale
Telemetry data is stored in Promscale using [TimescaleDB's hypertables][hypertables] 
that are compressed regularly using [TimescaleDB's compression capabilities][tsdb-compression].

A maintenance job periodically compresses data in hypertables. The maintenance job is 
automatically scheduled in TimescaleDB version 2.0 and higher using the job scheduling 
function provided by the database. If you are using a prior version of TimecaleDB you 
will have to use cron or a similar tool to schedule the maintenance task.
See the [installation instructions][promscale-install] for your platform for more details.

When evaluating the efficiency of compression, keep in mind that the current chunk in a
hypertable where new data is being stored is not compressed to ensure good write performance. 
Additionally, previous chunks are kept uncompressed for at least an hour after they have been
closed (and a new chunk has been created) to handle the case of late arrival of data. By default
the chunk interval is configured to 8 hours which means that a new chunk will be created for a
hypertable every 8 hours. The default chunk size can be configured with the 
`set_default_chunk_interval` SQL function:

````
SELECT set_default_chunk_interval(INTERVAL '1h');

````

The new chunk interval will only be applied to new chunks created after the setting was changed. 
It will not affect chunks that were created before the setting was changed.


You can retrieve the default chunk interval by running:

````
SELECT get_default_chunk_interval();

````



[hypertables]: timescaledb/:currentVersion:/overview/core-concepts/hypertables-and-chunks/
[tsdb-compression]:timescaledb/:currentVersion:/overview/core-concepts/compression/
[promscale-install]: /installation/


