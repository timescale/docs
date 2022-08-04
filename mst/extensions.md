---
title: Supported PostgreSQL extensions in Managed Service for TimescaleDB
excerpt: Learn how to add an extension and see a list of available extensions
product: mst
tags: [extensions]
---

# Supported PostgreSQL extensions

Managed Service for TimescaleDB supports many PostgreSQL extensions. See
[available extensions](#available-extensions) for a full list.

## Add an extension

You can add a supported extension to your database from the command line.

<highlight type="important">
Some extensions have dependencies. When adding these, make sure to create them
in the proper order.
</highlight>

<highlight type="important">
Some extensions require disconnecting and reconnecting the client connection
before they are fully available.
</highlight>

<procedure>

### Adding an extension

1.  Connect to your database as the `tsdbadmin` user.
1.  Run `CREATE EXTENSION IF NOT EXISTS <extension_name>`.

</procedure>

## Available extensions

The following extensions are available on Managed Service for TimescaleDB:

<!-- vale Vale.Spelling = NO -->

*   address_standardizer
*   address_standardizer_data_us
*   aiven_extras (logical replication support)
*   bloom
*   btree_gin
*   btree_gist
*   chkpass
*   citext
*   cube
*   dblink
*   dict_int
*   earthdistance
*   fuzzystrmatch
*   hstore
*   intagg
*   intarray
*   isn
*   ltree
*   pg_buffercache
*   pg_cron
*   pg_partman (PostgreSQL 10 and older)
*   pg_prometheus (PostgreSQL 10 and newer)
*   pg_repack (PostgreSQL 10 and newer)
*   pg_stat_statements
*   pg_trgm
*   pgcrypto
*   pgrouting
*   pgrowlocks
*   pgstattuple
*   plcoffee
*   plls
*   plperl
*   plv8  (PostgreSQL 10 and older)
*   postgis
*   postgis_address_standardizer
*   postgis_sfcgal
*   postgis_tiger_geocoder
*   postgis_topology
*   postgis_legacy ([See more information](#post-gis-legacy-support))
*   postgres_fdw
*   rum
*   sslinfo
*   tablefunc
*   tsearch2
*   tsm_system_rows
*   unaccent
*   unit
*   uuid-ossp
*   wal2json

<!-- vale Vale.Spelling = YES -->

<span id="post-gis-legacy-support"></span>

<highlight type="note">
The `postgis_legacy` extension is not packaged or supported as an extension by
the PostGIS project. Timescale provides the extension package for Managed
Service for TimescaleDB.
</highlight>

## Request an extension

You can request an extension not on the list by contacting Support. In your
request, specify the database service and user database where you want to use
the extension.

Untrusted language extensions are not supported. This restriction preserves our
ability to offer the highest possible service level. An example of an untrusted
language extension is `plpythonu`.

<highlight type="note">
You can contact Support directly from Managed Service for TimescaleDB. Click the
life-preserver icon in the upper-right corner of your dashboard.
</highlight>
