---
title: Service settings - PostgreSQL extensions
excerpt: Use PostgreSQL extensions with your Timescale Cloud service
products: [cloud]
keywords: [services, settings, extensions]
tags: [extensions]
---

# PostgreSQL extensions

You can use PostgreSQL extensions with Timescale Cloud. If you run
`pg_available_extensions` at the command prompt, the returned list of extensions
is inaccurate.

These are the currently supported extensions:

<!-- vale Vale.Spelling = NO -->

|Extension|Description|
|-|-|
|bloom|Bloom access method - signature file based index|
|btree_gin|Support for indexing common datatypes in GIN|
|btree_gist|Support for indexing common datatypes in GiST|
|citext|Data type for case-insensitive character strings|
|cube|Data type for multidimensional cubes|
|dict_int|Text search dictionary template for integers|
|dict_xsyn|Text search dictionary template for extended synonym processing|
|fuzzystrmatch|Determine similarities and distance between strings|
|hstore|Data type for storing sets of (key, value) pairs|
|intarray|Functions, operators, and index support for 1-D arrays of integers|
|isn|Data types for international product numbering standards|
|lo|Large Object maintenance|
|ltree|Data type for hierarchical tree-like structures|
|pg_stat_statements|Track execution statistics of all SQL statements executed|
|pg_trgm|Text similarity measurement and index searching based on trigrams|
|pgcrypto|Cryptographic functions|
|pgpcre|Perl-compatible RegEx|
|pgrouting|pgRouting Extension|
|pgvector|Vector similarity search for PostgreSQL|
|postgis|PostGIS geometry and geography spatial types and functions|
|postgis_raster|PostGIS raster types and functions|
|postgis_sfcgal|PostGIS SFCGAL functions|
|postgis_tiger_geocoder|PostGIS tiger geocoder and reverse geocoder|
|postgis_topology|PostGIS topology spatial types and functions|
|promscale|Promscale support functions|
|seg|data type for representing line segments or floating-point intervals|
|tablefunc|Functions that manipulate whole tables, including crosstab|
|tcn|Triggered change notifications|
|timescaledb_toolkit|TimescaleDB Toolkit|
|timescaledb|Enables scalable inserts and complex queries for time-series data|
|tsm_system_rows|TABLESAMPLE method which accepts number of rows as a limit|
|tsm_system_time|TABLESAMPLE method which accepts time in milliseconds as a limit|
|unaccent|Text search dictionary that removes accents|
|uuid-ossp|Generate universally unique identifiers (UUIDs)|

<!-- vale Vale.Spelling = YES -->
