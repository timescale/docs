## ALTER MATERIALIZED VIEW (Continuous Aggregate) <tag type="community">Community</tag>
`ALTER MATERIALIZED VIEW` statement can be used to modify some of the `WITH` clause [options](/continuous-aggregates/create_materialized_view/#parameters) for the continuous aggregate view.
`ALTER MATERIALIZED VIEW` statement also supports the following
[PostgreSQL clauses][postgres-alterview] on the
continuous aggregate view:

- `RENAME TO` clause to rename the continuous aggregate view;
- `SET SCHEMA` clause to set the new schema for the continuous aggregate view;
- `SET TABLESPACE` clause to move the materialization of the continuous
  aggregate view to the new tablespace;
- `OWNER TO` clause to set new owner for the continuous aggregate view.

``` sql
ALTER MATERIALIZED VIEW <view_name> SET ( timescaledb.<option> =  <value> [, ... ] )
```
### Parameters
|Name|Type|Description|
|---|---|---|
| `<view_name>` | TEXT | Name (optionally schema-qualified) of continuous aggregate view to be created.|

### Sample Usage

To disable real-time aggregates for a
continuous aggregate:

```sql
ALTER MATERIALIZED VIEW contagg_view SET (timescaledb.materialized_only = true);
```

The only option that currently can be modified with `ALTER
MATERIALIZED VIEW` is `materialized_only`. The other options
`continuous` and `create_group_indexes` can only be set when creating
the continuous aggregate.

[postgres-alterview]: https://www.postgresql.org/docs/current/sql-alterview.html
