---
api_name: cagg_migrate()
excerpt: Migrate a continuous aggregate from the old format to the new format introduced in TimescaleDB 2.7
topics: [continuous aggregates]
keywords: [continuous aggregates]
tags: [migrate]
api:
  license: community
  type: procedure
---

# cagg_migrate() <Tag type="community" content="Community" />

Migrate a continuous aggregate from the old format to  the new format introduced
in TimescaleDB 2.7.

```sql
CALL cagg_migrate (
    cagg REGCLASS,
    override BOOLEAN DEFAULT FALSE,
    drop_old BOOLEAN DEFAULT FALSE
);
```

TimescaleDB 2.7 introduced a new format for continuous aggregates that improves
performance. It also makes continuous aggregates compatible with more types of
SQL queries.

The new format, also called the finalized format, stores the continuous
aggregate data exactly as it appears in the final view. The old format, also
called the partial format, stores the data in a partially aggregated state.

Use this procedure to migrate continuous aggregates from the old format to the
new format.

For more information, see the [migration how-to guide][how-to-migrate].

<Highlight type="warning">
There are known issues with `cagg_migrate()` in version 2.8.0.
Upgrade to version 2.8.1 or above before using it.
</Highlight>

## Required arguments

|Name|Type|Description|
|-|-|-|
|`cagg`|`REGCLASS`|The continuous aggregate to migrate|

## Optional arguments

|Name|Type|Description|
|-|-|-|
|`override`|`BOOLEAN`|If false, the old continuous aggregate keeps its name. The new continuous aggregate is named `<OLD_CONTINUOUS_AGGREGATE_NAME>_new`. If true, the new continuous aggregate gets the old name. The old continuous aggregate is renamed `<OLD_CONTINUOUS_AGGREGATE_NAME>_old`. Defaults to `false`.|
|`drop_old`|`BOOLEAN`|If true, the old continuous aggregate is deleted. Must be used together with `override`. Defaults to `false`.|

[how-to-migrate]: /use-timescale/:currentVersion:/continuous-aggregates/migrate/
