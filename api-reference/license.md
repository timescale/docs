## timescaledb.license 

View or set currently used TimescaleDB license.

It is possible to limit access to features by license by changing the `timescaledb.license`
settings parameter in the server configuration file or on the server command line. For instance,
by setting `timescaledb.license` to `apache`, it is only possible to use TimescaleDB features
that are implemented under the Apache 2 license. The default value is `timescale`, however, which
allows access to all features.

### Sample Usage 

View current license.

```sql
SHOW timescaledb.license;
 timescaledb.license
---------------------
 timescale
(1 row)

```