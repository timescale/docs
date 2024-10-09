---
api_name: timescaledb_information.continuous_aggregates
excerpt: Get metadata and settings information for continuous aggregates
topics: [information, continuous aggregates]
keywords: [continuous aggregates]
tags: [information, schemas, metadata, definition]
api:
  license: community
  type: view
---

# timescaledb_information.continuous_aggregates

Get metadata and settings information for continuous aggregates.

### Available columns

|Name|Type|Description|
|---|---|---|
|`hypertable_schema` | TEXT | Schema of the hypertable from the continuous aggregate view|
|`hypertable_name` | TEXT | Name of the hypertable from the continuous aggregate view|
|`view_schema` | TEXT | Schema for continuous aggregate view |
|`view_name` | TEXT | User supplied name for continuous aggregate view |
|`view_owner` | TEXT | Owner of the continuous aggregate view|
|`materialized_only` | BOOLEAN | Return only materialized data when querying the continuous aggregate view|
|`compression_enabled` | BOOLEAN | Is compression enabled for the continuous aggregate view?|
|`materialization_hypertable_schema` | TEXT | Schema of the underlying materialization table|
|`materialization_hypertable_name` | TEXT | Name of the underlying materialization table|
|`view_definition` | TEXT | `SELECT` query for continuous aggregate view|
|`finalized`| BOOLEAN | Whether the continuous aggregate stores data in finalized or partial form. Since TimescaleDB 2.7, the default is finalized. |

### Sample usage

```sql
SELECT * FROM timescaledb_information.continuous_aggregates;

-[ RECORD 1 ]---------------------+-------------------------------------------------
hypertable_schema                 | public
hypertable_name                   | foo
view_schema                       | public 
view_name                         | contagg_view
view_owner                        | postgres
materialized_only                 | f
compression_enabled               | f
materialization_hypertable_schema | _timescaledb_internal
materialization_hypertable_name   | _materialized_hypertable_2
view_definition                   |  SELECT foo.a,                                  +
                                  |     COUNT(foo.b) AS countb                      +
                                  |    FROM foo                                     +
                                  |   GROUP BY (time_bucket('1 day', foo.a)), foo.a;
finalized                         | t

```
