
import Deprecated2210 from "versionContent/_partials/_deprecated_2_21_0.mdx";

Please refer to the [Grand Unified Configuration (GUC) parameters][gucs] for a complete list.

## Policies

### `timescaledb.max_background_workers (int)`

Max background worker processes allocated to $TIMESCALE_DB. Set to at least 1 +
the number of databases loaded with the $TIMESCALE_DB extension in a $PG instance. Default value is 16.

## $SERVICE_LONG tuning

### `timescaledb.disable_load (bool)`
Disable the loading of the actual extension

[gucs]: /api/:currentVersion:/configuration/gucs/
