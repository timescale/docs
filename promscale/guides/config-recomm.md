# Configuration recommendations
This section describes the configuration recommendations for Promscale.

## Database configuration

To set the most common parameters to optimal values based on your system, run
`timescaledb-tune`. It accounts for memory, CPU, and PostgreSQL version. For
more information, see [configuration][timescale-tune-configuration]. However,
there are a few other PostgreSQL parameters worth tuning:

* `checkpoint_timeout=15min` - when a lot of data is ingested, increase the
  checkpoint timeout to reduce the input/output pressure.
* `bgwriter_delay=10ms` - the background writer needs to be active to reduce
  delays.
* `bgwriter_lru_maxpages=100000` - increase the number of pages a background
  writer handles to make it more efficient.
* `max_wal_size` - set it to a high enough value so that the checkpoint is triggered
  by the timeout setting and not when the `maximum_wal_size` is reached.
* `synchronous_commit=off` - this does not cause data corruption or
  inconsistency. However, in case of a crash, some of the last data points may be
  lost. For a monitoring observability use case, it's a reasonable tradeoff to
  increase ingest performance. 

<highlight type="important"> 
Make sure that the maximum latency between the
Promscale connector and the database is no more than 100&nbsp;ms. 
</highlight>


[timescale-tune-configuration]: https://docs.timescale.com/timescaledb/latest/how-to-guides/configuration/timescaledb-tune/#timescaledb-tuning-tool