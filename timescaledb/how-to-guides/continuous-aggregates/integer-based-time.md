## Continuous Aggregates using Integer-Based Time 

Usually, continuous aggregates are defined on a
[date/time-type][postgres-date-time]
column, but it is also possible to create your own custom scheme for
handling aggregation for tables that are using an integer time
column. This can be useful if you have tables that use other measures
of time that can be represented as integer values, such as nanosecond
epochs, minutes since founding date, or whatever is suitable for your
application.

As an example, suppose that you have a table with CPU and disk usage
for some devices where time is measured in
[microfortnights][fff-system] (a microfortnight is a little more than
a second). Since you are using an integer-valued column as time, you
need to provide the chunk time interval when creating the
hypertable. In this case, let each chunk consist of a millifortnight
(a 1000 microfortnights, which is about 20 minutes).

```sql
CREATE TABLE devices(
  time BIGINT,        -- Time in microfortnights since epoch
  cpu_usage INTEGER,  -- Total CPU usage
  disk_usage INTEGER, -- Total disk usage
  PRIMARY KEY (time)
);

SELECT create_hypertable('devices', 'time',
                         chunk_time_interval => 1000);
```

To define a continuous aggregate on a hypertable that is using an
integer time dimension, it is necessary to have a function to get the
current time in whatever representation that you are using and set it
for the hypertable using
[`set_integer_now_func`][api-set-integer-now-func]. The function can
be defined as a normal PostgreSQL function, but needs to be
[`STABLE`][pg-func-stable], take no arguments, and return an integer
value of the same type as the time column in the table. In our case,
this should suffice:

```sql
CREATE FUNCTION current_microfortnight() RETURNS BIGINT
LANGUAGE SQL STABLE AS $$
	SELECT CAST(1209600 * EXTRACT(EPOCH FROM CURRENT_TIME) / 1000000 AS BIGINT)
$$;

SELECT set_integer_now_func('devices', 'current_microfortnight');
```

Once the replacement for current time has been set up, you can define
a continuous aggregate for the `devices` table.

```sql
CREATE MATERIALIZED VIEW devices_summary
WITH (timescaledb.continuous) AS
SELECT time_bucket('500', time) AS bucket,
       avg(cpu_usage) AS avg_cpu,
       avg(disk_usage) AS avg_disk
     FROM devices
     GROUP BY bucket;
```

You can now insert some rows to check if the aggregation works as
expected.

```sql
CREATE EXTENSION tablefunc;

INSERT INTO devices(time, cpu_usage, disk_usage)
SELECT time,
       normal_rand(1,70,10) AS cpu_usage,
	   normal_rand(1,2,1) * (row_number() over()) AS disk_usage
  FROM generate_series(1,10000) AS time;
```

<highlight type="tip">
You can use the `tablefunc` extension to generate a normal
distribution and use the `row_number` function to turn it into a
cumulative sequence.
</highlight>

You can now check that the view contains the correct data.

```sql
postgres=# SELECT * FROM devices_summary ORDER BY bucket LIMIT 10;
 bucket |       avg_cpu       |       avg_disk
--------+---------------------+----------------------
      0 | 63.0000000000000000 |   6.0000000000000000
      5 | 69.8000000000000000 |   9.6000000000000000
     10 | 70.8000000000000000 |  24.0000000000000000
     15 | 75.8000000000000000 |  37.6000000000000000
     20 | 71.6000000000000000 |  26.8000000000000000
     25 | 67.6000000000000000 |  56.0000000000000000
     30 | 68.8000000000000000 |  90.2000000000000000
     35 | 71.6000000000000000 |  88.8000000000000000
     40 | 66.4000000000000000 |  81.2000000000000000
     45 | 68.2000000000000000 | 106.0000000000000000
(10 rows)
```



[fff-system]: https://en.wikipedia.org/wiki/FFF_system
[pg-func-stable]: https://www.postgresql.org/docs/current/static/sql-createfunction.html
[api-set-integer-now-func]: /api-reference/{currentVersion}/hypertables-and-chunks/set_integer_now_func
[postgres-date-time]: https://www.postgresql.org/docs/current/datatype-datetime.html
