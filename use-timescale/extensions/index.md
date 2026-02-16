---
title: Postgres extensions
excerpt: Tiger Cloud comes with a number of Tiger Data and Postgres extensions enabled by default. See all the extensions you can enable for your service
products: [cloud]
keywords: [services, settings, extensions]
tags: [extensions]
---

# $CLOUD_LONG $PG extensions 

The following $PG extensions are installed with each $SERVICE_LONG:

- [$COMPANY extensions][timescale-extensions]
- [$PG built-in extensions][built-ins]
- [Third-party extensions][third-party]

## $COMPANY extensions

| Extension                                   | Description                                | Enabled by default                                                    |
|---------------------------------------------|--------------------------------------------|-----------------------------------------------------------------------|
| [pgai][pgai]                                | Helper functions for AI workflows          | For [AI-focused][install] $SERVICE_SHORTs                            |
| [pg_textsearch][pg_textsearch]              | [BM25][bm25-wiki]-based full-text search   | Currently early access. For development and staging environments only |
| [pgvector][pgvector]                        | Vector similarity search for $PG           | For [AI-focused][install] $SERVICE_SHORTs                            |
| [pgvectorscale][pgvectorscale]              | Advanced indexing for vector data          | For [AI-focused][install] $SERVICE_SHORTs                            |
| [timescaledb_toolkit][toolkit]  | TimescaleDB Toolkit                        | For [Real-time analytics][install] $SERVICE_SHORTs                   |
| [timescaledb][timescaledb]                  | TimescaleDB                                | For all $SERVICE_SHORTs                                               |

## $PG built-in extensions

| Extension                                | Description                                                            | Enabled by default      |
|------------------------------------------|------------------------------------------------------------------------|-------------------------|
| [autoinc][autoinc]                       | Functions for autoincrementing fields                                  | -                       |
| [amcheck][amcheck]                       | Functions for verifying relation integrity                             | -                       | 
| [bloom][bloom]                           | Bloom access method - signature file-based index                       | -                       |
| [bool_plperl][bool-plper]                | Transform between bool and plperl                                      | -                       |
| [btree_gin][btree-gin]                   | Support for indexing common datatypes in GIN                           | -                       |
| [btree_gist][btree-gist]                 | Support for indexing common datatypes in GiST                          | -                       |
| [citext][citext]                         | Data type for case-insensitive character strings                       | -                       |
| [cube][cube]                             | Data type for multidimensional cubes                                   | -                       |
| [dict_int][dict-int]                     | Text search dictionary template for integers                           | -                       |
| [dict_xsyn][dict-xsyn]                   | Text search dictionary template for extended synonym processing        | -                       |
| [earthdistance][earthdistance]           | Calculate great-circle distances on the surface of the Earth           | -                       |
| [fuzzystrmatch][fuzzystrmatch]           | Determine similarities and distance between strings                    | -                       |
| [hstore][hstore]                         | Data type for storing sets of (key, value) pairs                       | -                       |
| [hstore_plperl][hstore]                  | Transform between hstore and plperl                                    | -                       |
| [insert_username][insert-username]       | Functions for tracking who changed a table                             | -                       |
| [intagg][intagg]                         | Integer aggregator and enumerator (obsolete)                           | -                       |
| [intarray][intarray]                     | Functions, operators, and index support for 1-D arrays of integers     | -                       |
| [isn][isn]                               | Data types for international product numbering standards               | -                       |
| [jsonb_plperl][jsonb-plperl]             | Transform between jsonb and plperl                                     | -                       |
| [lo][lo]                                 | Large object maintenance                                               | -                       |
| [ltree][ltree]                           | Data type for hierarchical tree-like structures                        | -                       |
| [moddatetime][moddatetime]               | Functions for tracking last modification time                          | -                       |
| [old_snapshot][old-snapshot]             | Utilities in support of `old_snapshot_threshold`                       | -                       |
| [pgcrypto][pgcrypto]                     | Cryptographic functions                                                | -                       |
| [pgrowlocks][pgrowlocks]                 | Show row-level locking information                                     | -                       |
| [pgstattuple][pgstattuple]               | Obtain tuple-level statistics                                          | -                       |
| [pg_freespacemap][pg-freespacemap]       | Examine the free space map (FSM)                                       | -                       |
| [pg_prewarm][pg-prewarm]                 | Prewarm relation data                                                  | -                       |
| [pg_stat_statements][pg-stat-statements] | Track execution statistics of all SQL statements executed              | For all $SERVICE_SHORTs |
| [pg_trgm][pg-trgm]                       | Text similarity measurement and index searching based on trigrams      | -                       |
| [pg_visibility][pg-visibility]           | Examine the visibility map (VM) and page-level visibility info         | -                       |
| [plperl][plperl]                         | PL/Perl procedural language                                            | -                       | 
| [plpgsql][plpgsql]                       | SQL procedural language                                                | For all $SERVICE_SHORTs |
| [postgres_fdw][foreign-data-wrappers]             | Foreign data wrappers                                                  | For all $SERVICE_SHORTs |
| [refint][refint]                         | Functions for implementing referential integrity (obsolete)            | -                       |
| [seg][seg]                               | Data type for representing line segments or floating-point intervals   | -                       |
| [sslinfo][sslinfo]                       | Information about SSL certificates                                     | -                       |
| [tablefunc][tablefunc]                   | Functions that manipulate whole tables, including crosstab             | -                       |
| [tcn][tcn]                               | Trigger change notifications                                           | -                       |
| [tsm_system_rows][tsm-system-rows]       | `TABLESAMPLE` method which accepts the number of rows as a limit       | -                       |
| [tsm_system_time][tsm-system-time]       | `TABLESAMPLE` method which accepts the time in milliseconds as a limit | -                       |
| [unaccent][unaccent]                     | Text search dictionary that removes accents                            | -                       |
| [uuid-ossp][uuid-ossp]                   | Generate universally unique identifiers (UUIDs)                        | -                       |

## Third-party extensions

| Extension                                        | Description                                                             | Enabled by default                                   |
|--------------------------------------------------|-------------------------------------------------------------------------|------------------------------------------------------|
| [h3][h3]                                         | H3 bindings for $PG                                                     | -                                                    |
| [pgaudit][pgaudit]                               | Detailed session and/or object audit logging                            | -                                                    |
| [pgpcre][pgpcre]                                 | Perl-compatible RegEx                                                   | -                                                    |
| [pg_cron][pgcron]                                | SQL commands that you can schedule and run directly inside the database | [Contact us][contact-us] to enable |
| [pg_repack][pgrepack]                            | Table reorganization in $PG with minimal locks                          | -                                                    | 
| [pgrouting][pgrouting]                           | Geospatial routing functionality                                        | -                                                    |
| [postgis][postgis]                               | PostGIS geometry and geography spatial types and functions              | -                                                    |
| [postgis_raster][postgis-raster]                 | PostGIS raster types and functions                                      | -                                                    |
| [postgis_sfcgal][postgis-sfcgal]                 | PostGIS SFCGAL functions                                                | -                                                    |
| [postgis_tiger_geocoder][postgis-tiger-geocoder] | PostGIS $CLOUD_LONG geocoder and reverse geocoder                       | -                                                    |
| [postgis_topology][postgis-topology]             | PostGIS topology spatial types and functions                            | -                                                    |
| [unit][unit]                                     | SI units for $PG                                                        | -                                                    |

[amcheck]: https://www.postgresql.org/docs/current/amcheck.html
[autoinc]: https://www.postgresql.org/docs/current/contrib-spi.html#CONTRIB-SPI-AUTOINC
[bloom]: https://www.postgresql.org/docs/current/bloom.html
[bm25-wiki]: https://en.wikipedia.org/wiki/Okapi_BM25
[bool-plper]: https://www.postgresql.org/docs/current/plperl-funcs.html
[btree-gin]: https://www.postgresql.org/docs/current/btree-gin.html
[btree-gist]: https://www.postgresql.org/docs/current/btree-gist.html
[built-ins]: /use-timescale/:currentVersion:/extensions/#postgres-built-in-extensions
[citext]: https://www.postgresql.org/docs/current/citext.html
[contact-us]: mailto:support@tigerdata.com
[cube]: https://www.postgresql.org/docs/current/cube.html
[dict-int]: https://www.postgresql.org/docs/current/dict-int.html
[dict-xsyn]: https://www.postgresql.org/docs/current/dict-xsyn.html
[earthdistance]: https://www.postgresql.org/docs/current/earthdistance.html
[foreign-data-wrappers]: /use-timescale/:currentVersion:/schema-management/foreign-data-wrappers/
[fuzzystrmatch]: https://www.postgresql.org/docs/current/fuzzystrmatch.html
[h3]: https://pgxn.org/dist/h3/
[hstore]: https://www.postgresql.org/docs/current/hstore.html
[insert-username]: https://www.postgresql.org/docs/current/contrib-spi.html#CONTRIB-SPI-INSERT-USERNAME
[install]: /getting-started/:currentVersion:/
[intagg]: https://www.postgresql.org/docs/current/intagg.html
[intarray]: https://www.postgresql.org/docs/current/intarray.html
[isn]: https://www.postgresql.org/docs/current/isn.html
[jsonb-plperl]: https://www.postgresql.org/docs/current/datatype-json.html#DATATYPE-JSON-TRANSFORMS
[lo]: https://www.postgresql.org/docs/current/lo.html
[ltree]: https://www.postgresql.org/docs/current/ltree.html
[moddatetime]: https://www.postgresql.org/docs/current/contrib-spi.html#CONTRIB-SPI-MODDATETIME
[old-snapshot]: https://www.postgresql.org/docs/16/oldsnapshot.html
[pg-freespacemap]: https://www.postgresql.org/docs/current/pgfreespacemap.html
[pg-prewarm]: https://www.postgresql.org/docs/current/pgprewarm.html
[pg-stat-statements]: https://www.postgresql.org/docs/current/pgstatstatements.html
[pg-trgm]: https://www.postgresql.org/docs/current/pgtrgm.html
[pg-visibility]: https://www.postgresql.org/docs/current/pgvisibility.html
[pg_textsearch]: /use-timescale/:currentVersion:/extensions/pg-textsearch/
[pgai]: /ai/:currentVersion:/
[pgaudit]: https://www.pgaudit.org/
[pgcron]: https://github.com/citusdata/pg_cron
[pgcrypto]: /use-timescale/:currentVersion:/extensions/pgcrypto/
[pgpcre]: https://github.com/petere/pgpcre
[pgrepack]: https://github.com/reorg/pg_repack
[pgrouting]: https://pgrouting.org/
[pgrowlocks]: https://www.postgresql.org/docs/current/pgrowlocks.html
[pgstattuple]: https://www.postgresql.org/docs/current/pgstattuple.html
[pgvector]: https://github.com/pgvector/pgvector
[pgvectorscale]: https://github.com/timescale/pgvectorscale
[plperl]: https://www.postgresql.org/docs/current/plperl.html
[plpgsql]: https://www.postgresql.org/docs/current/plpgsql.html
[postgis-raster]: https://postgis.net/docs/RT_reference.html
[postgis-sfcgal]: https://postgis.net/docs/reference_sfcgal.html
[postgis-tiger-geocoder]: https://postgis.net/docs/Extras.html#Tiger_Geocoder
[postgis-topology]: https://postgis.net/workshops/postgis-intro/topology.html
[postgis]: /use-timescale/:currentVersion:/extensions/postgis/
[refint]: https://www.postgresql.org/docs/current/contrib-spi.html
[seg]: https://www.postgresql.org/docs/current/seg.html
[sslinfo]: https://www.postgresql.org/docs/current/sslinfo.html
[tablefunc]: https://www.postgresql.org/docs/current/tablefunc.html
[tcn]: https://www.postgresql.org/docs/current/tcn.html
[third-party]: /use-timescale/:currentVersion:/extensions/#third-party-extensions
[timescale-extensions]: /use-timescale/:currentVersion:/extensions/#tiger-data-extensions
[timescaledb]: https://github.com/timescale/timescaledb
[toolkit]: https://github.com/timescale/timescaledb-toolkit
[tsm-system-rows]: https://www.postgresql.org/docs/current/tsm-system-rows.html
[tsm-system-time]: https://www.postgresql.org/docs/current/tsm-system-time.html
[unaccent]: https://www.postgresql.org/docs/current/unaccent.html
[unit]: https://github.com/df7cb/postgresql-unit
[uuid-ossp]: https://www.postgresql.org/docs/current/uuid-ossp.html
