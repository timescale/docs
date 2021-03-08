## Dropping chunks manually

As an example, if you have a hypertable definition of `conditions`
where you collect raw data into chunks of one day:

```sql
CREATE TABLE conditions(
    time TIMESTAMPTZ NOT NULL,
    device INTEGER,
    temperature FLOAT
);

SELECT * FROM create_hypertable('conditions', 'time',
       chunk_time_interval => INTERVAL '1 day');
```

If you collect a lot of data and realize that you never actually use
raw data older than 30 days, you might want to delete data older than
30 days from `conditions`.

However, deleting large swaths of data from tables can be costly and
slow if done row-by-row using the standard `DELETE` command. Instead,
TimescaleDB provides a function `drop_chunks` that quickly drop data
at the granularity of chunks without incurring the same overhead.

For example:

```sql
SELECT drop_chunks('conditions', INTERVAL '24 hours');
```

This will drop all chunks from the hypertable `conditions` that _only_
include data older than this duration, and will _not_ delete any
individual rows of data in chunks.

For example, if one chunk has data more than 36 hours old, a second
chunk has data between 12 and 36 hours old, and a third chunk has the
most recent 12 hours of data, only the first chunk is dropped when
executing `drop_chunks`. Thus, in this scenario,
the `conditions` hypertable will still have data stretching back 36 hours.

For more information on the `drop_chunks` function and related
parameters, please review the [API documentation][drop_chunks].
