---
title: Migrate a continuous aggregate to the new form
excerpt: Migrate old continuous aggregates to the new form introduced in TimescaleDB 2.7
keywords: [continuous aggregates]
---

import CaggMigratePermissions from 'versionContent/_partials/_caggs-migrate-permissions.mdx';

# Migrate a continuous aggregate to the new form

In TimescaleDB 2.7 and above, continuous aggregates use a new format that
improves performance and makes them compatible with more SQL queries. Continuous
aggregates created in older versions of TimescaleDB, or created in a new version
with the option `timescaledb.finalized` set to `false`, use the old format.

To migrate a continuous aggregate from the old format to the new format, you can
use this procedure. It automatically copies over your data and policies. You can
continue to use the continuous aggregate while the migration is happening.

Connect to your database and run:

```sql
CALL cagg_migrate('<CONTINUOUS_AGGREGATE_NAME>');
```

<highlight type="warning">
There are known issues with `cagg_migrate()` in 2.8.0.
Please upgrade to at least 2.8.1 before using it.
</highlight>

## Configure continuous aggregate migration

The migration procedure provides two boolean configuration parameters,
`override` and `drop_old`. By default, the name of your new continuous
aggregate is the name of your old continuous aggregate, with the suffix `_new`.

Set `override` to true to rename your new continuous aggregate with the
original name. The old continuous aggregate is renamed with the suffix `_old`.

To both rename and drop the old continuous aggregate entirely, set both
parameters to true. Note that `drop_old` must be used together with
`override`.

## Check on continuous aggregate migration status

To check the progress of the continuous aggregate migration, query the migration
planning table:

```sql
SELECT * FROM _timescaledb_catalog.continuous_agg_migrate_plan_step;
```

## Troubleshooting

### Permissions error when migrating a continuous aggregate

<CaggMigratePermissions />
