---
title: Delete data
excerpt: How to delete data from Timescale
products: [cloud, mst, self_hosted]
keywords: [delete, hypertables]
---

# Delete data

You can delete data from a hypertable using a standard
[`DELETE`][postgres-delete] SQL command. If you want to delete old data once it
reaches a certain age, you can also drop entire chunks or set up a data
retention policy.

## Delete data with DELETE command

To delete data from a table, use the syntax `DELETE FROM ...`. In this example,
data is deleted from the table `conditions`, if the row's `temperature` or
`humidity` is below a certain level:

```sql
DELETE FROM conditions WHERE temperature < 35 OR humidity < 60;
```

<Highlight type="important">
If you delete a lot of data, run
[`VACUUM`](https://www.postgresql.org/docs/current/static/sql-vacuum.html) or
`VACUUM FULL` to reclaim storage from the deleted or obsolete rows.
</Highlight>

## Delete data by dropping chunks

Timescale allows you to delete data by age, by dropping chunks from a
hypertable. You can do so either manually or by data retention policy.

To learn more, see the [data retention section][data-retention].

[data-retention]: /use-timescale/:currentVersion:/data-retention/
[postgres-delete]: https://www.postgresql.org/docs/current/static/sql-delete.html
