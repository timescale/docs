
import Deprecated2210 from "versionContent/_partials/_deprecated_2_21_0.mdx";

Please refer to the [Grand Unified Configuration (GUC) parameters](gucs) for a complete list.

## Policies

### `timescaledb.max_background_workers (int)`

Max background worker processes allocated to $TIMESCALE_DB. Set to at least 1 +
the number of databases loaded with the $TIMESCALE_DB extension in a $PG instance. Default value is 16.

## $SERVICE_LONG tuning

### `timescaledb.disable_load (bool)`
Disable the loading of the actual extension

## Removed features

### `timescaledb.default_hypercore_use_access_method`

The default value for `hypercore_use_access_method` for functions that have this parameter. This function is in `user` context, meaning that any user can set it for the session. The default value is `false`.

<Deprecated2210 /> This feature was sunsetted in TimescaleDB `v2.22.0`.

[enabling-data-tiering]: /use-timescale/:currentVersion:/data-tiering/enabling-data-tiering/
[pg-dump-and-restore]: /migrate/:currentVersion:/pg-dump-and-restore/
[migrate-entire]: /self-hosted/:currentVersion:/migration/entire-database/
[gucs]: /api/:currentVersion:/configuration/gucs/
