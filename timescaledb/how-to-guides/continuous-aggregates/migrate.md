---
title: Migrate a continuous aggregate to the new form
excerpt: Migrate old continuous aggregates to the new form introduced in TimescaleDB 2.7
keywords: [continuous aggregates]
---

# Migrate a continuous aggregate to the new form

In TimescaleDB 2.7 and above, continuous aggregates use a new format that
improves performance and makes them compatible with more SQL queries. Continuous
aggregates created in older versions of TimescaleDB, or created in a new version
with the option `timescaledb.finalized` set to `false`, use the old format.

To migrate a continuous aggregate from the old format to the new format, you can
use the provided procedure. Connect to your database and run:

```sql
CALL cagg_migrate('<CONTINUOUS_AGGREGATE_NAME>');
```
