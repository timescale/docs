---
title: Update data
excerpt: Update data in a hypertable
products: [cloud, mst, self_hosted]
keywords: [updates, hypertables]
---

# Update data

Update data in a hypertable with a standard [`UPDATE`][postgres-update] SQL
command.

## Update a single row

Update a single row with the syntax `UPDATE ... SET ... WHERE`. For example, to
update a row in the `conditions` hypertable with new `temperature` and
`humidity` values, run the following. The `WHERE` clause specifies the row to be
updated.

```sql
UPDATE conditions
  SET temperature = 70.2, humidity = 50.0
  WHERE time = '2017-07-28 11:42:42.846621+00'
    AND location = 'office';
```

## Update multiple rows at once

You can also update multiple rows at once, by using a `WHERE` clause that
filters for more than one row. For example, run the following to update
all `temperature` values within the given 10-minute span:

```sql
UPDATE conditions
  SET temperature = temperature + 0.1
  WHERE time >= '2017-07-28 11:40'
    AND time < '2017-07-28 11:50';
```

[postgres-update]: https://www.postgresql.org/docs/current/static/sql-update.html
