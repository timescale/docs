## UPDATE commands [](update)

Update data in a hypertable with the standard [`UPDATE`][postgres-update] SQL
command.

```sql
UPDATE conditions SET temperature = 70.2, humidity = 50.0
  WHERE time = '2017-07-28 11:42:42.846621+00' AND location = 'office';
```

An update command can touch many rows at once, i.e., the following
modifies all rows found in a 10-minute block of data.

```sql
UPDATE conditions SET temperature = temperature + 0.1
  WHERE time >= '2017-07-28 11:40' AND time < '2017-07-28 11:50';
```

<highlight type="warning">
TimescaleDB achieves much higher insert performance compared to
 vanilla PostgreSQL when inserts are localized to the most recent time
 interval (or two).  If your workload is heavily based on `UPDATE`s to old
 time intervals instead, you may observe significantly lower write
 throughput.
</highlight>

[postgres-update]: https://www.postgresql.org/docs/current/static/sql-update.html
