Postgres builds the index on the fly during ingestion. That means that to build a new entry on the index, 
a significant portion of the index needs to be traversed during every row insertion. When the index does not fit
into memory, it is constantly flushed to disk and read back, which wastes IO resources which would otherwise
been used for writing the heap/WAL data to disk. 

The default chunk interval is 7 days. However, best practice is to set `chunk_interval` so that prior to processing,
the indexes for chunks currently being ingested into fit within 25% of main memory. For example, on a system with 64 
GB of memory, if index growth is approximately 2 GB per day, a 1-week chunk interval is appropriate. If index growth is 
around 10 GB per day, use a 1-day interval.

You set `chunk_interval` when you [create a $HYPERTABLE][hypertable-create-table], or by calling 
[`set_chunk_time_interval`][chunk_interval] on an  existing hypertable.



[best-practices]: /use-timescale/:currentVersion:/hypertables/#best-practices-for-time-partitioning
[chunk_interval]: /api/:currentVersion:/hypertable/set_chunk_time_interval/
[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
