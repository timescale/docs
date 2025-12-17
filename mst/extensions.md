---
title: Supported Postgres extensions in Managed Service for TimescaleDB
excerpt: Add an extension and see a list of available extensions in Managed Service for TimescaleDB
products: [mst]
tags: [extensions]
---

# Supported $PG extensions

$MST_LONG supports many $PG extensions. See
[available extensions][available-extensions-link] for a full list.

## Add an extension

You can add a supported extension to your database from the command line.

<Highlight type="important">
Some extensions have dependencies. When adding these, make sure to create them
in the proper order.
</Highlight>

<Highlight type="important">
Some extensions require disconnecting and reconnecting the client connection
before they are fully available.
</Highlight>

<Procedure>

### Adding an extension

1.  Connect to your database as the `tsdbadmin` user.
1.  Run `CREATE EXTENSION IF NOT EXISTS <extension_name>`.

</Procedure>

## Available extensions

These extensions are available on $MST_LONG:

<!-- vale Vale.Spelling = NO -->

- address_standardizer
- address_standardizer_data_us
- aiven_extras
- amcheck
- anon
- autoinc
- bloom
- bool_plperl
- btree_gin
- btree_gist
- citext
- cube
- dblink
- dict_int
- dict_xsyn
- earthdistance
- file_fdw
- fuzzystrmatch
- h3
- h3_postgis
- hll
- hstore
- hstore_plperl
- insert_username
- intagg
- intarray
- isn
- jsonb_plperl
- lo
- ltree
- moddatetime
- pageinspect
- pg_buffercache
- pg_cron
- pg_freespacemap
- pg_prewarm
- pg_repack
- pg_similarity
- pg_stat_monitor
- pg_stat_statements
- pg_surgery
- pg_trgm
- pg_visibility
- pg_walinspect
- pgaudit
- pgcrypto
- pgrouting
- pgrowlocks
- pgstattuple
- plperl
- plpgsql
- postgis
- postgis_raster
- postgis_sfcgal
- postgis_tiger_geocoder
- postgis_topology
- postgres_fdw
- refint
- rum
- seg
- sslinfo
- tablefunc
- tcn
- timescaledb
- tsm_system_rows
- tsm_system_time
- unaccent
- unit
- uuid-ossp
- vector
- vectorscale
- xml2
- timescaledb_toolkit

<!-- vale Vale.Spelling = YES -->

<Highlight type="note">
The `postgis_legacy` extension is not packaged or supported as an extension by
the PostGIS project. $COMPANY provides the extension package for $MST_LONG.
</Highlight>

## Request an extension

You can request an extension not on the list by contacting Support. In your
request, specify the database service and user database where you want to use
the extension.

Untrusted language extensions are not supported. This restriction preserves our
ability to offer the highest possible service level. An example of an untrusted
language extension is `plpythonu`.

<Highlight type="note">
You can contact Support directly from $MST_LONG. Click the
life-preserver icon in the upper-right corner of your dashboard.
</Highlight>

[available-extensions-link]: /mst/:currentVersion:/extensions/#available-extensions
