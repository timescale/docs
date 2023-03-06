---
title: Materialized hypertables
excerpt: Work with the materialized hypertables that underly continuous aggregates
keywords: [continuous aggregates]
tags: [materialized views]
---

# Materialized hypertables

Continuous aggregates take raw data from the original hypertable, aggregate it,
and store the intermediate state in a materialization hypertable. You can modify
this materialized hypertable in the same way as any other hypertable.

## Discover the name of a materialized hypertable

To change a materialized hypertable, you need to use its fully qualified
name. To find the correct name, use the
[timescaledb_information.continuous_aggregates view][api-continuous-aggregates-info]).
You can then use the name to modify it in the same way as any other hypertable.

<Procedure>

### Discovering the name of a materialized hypertable

1.  At the `psql`prompt, query `timescaledb_information.continuous_aggregates`:

    ```sql
    SELECT view_name, format('%I.%I', materialization_hypertable_schema,
            materialization_hypertable_name) AS materialization_hypertable
        FROM timescaledb_information.continuous_aggregates;
    ```

1.  Locate the name of the hypertable you want to adjust in the results of the
    query. The results look like this:

    ```
             view_name         |            materialization_hypertable
    ---------------------------+---------------------------------------------------
    conditions_summary_hourly | _timescaledb_internal._materialized_hypertable_30
    conditions_summary_daily  | _timescaledb_internal._materialized_hypertable_31
    (2 rows)
    ```

</Procedure>

[api-continuous-aggregates-info]: /api/:currentVersion:/informational-views/continuous_aggregates/
