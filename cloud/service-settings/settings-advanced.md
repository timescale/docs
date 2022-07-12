---
title: Service settings - Advanced parameters
excerpt: Configure advanced parameters for your Timescale Cloud service
product: cloud
keywords: [services, settings, extensions]
tags: [schemas]
---

# Service settings - advanced parameters
It is also possible to configure a wide variety of service database parameters
by toggling `Show advanced parameters` in the upper-right corner of the
`Settings` tab.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-settings-advanced.png" alt="View Timescale Cloud advanced configuration parameters"/>

Once toggled, a scrollable (and searchable) list of configurable parameters is
displayed.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-settings-search.png" alt="Search Timescale Cloud configuration parameters"/>

As with the basic database configuration parameters, any changes are highlighted
and the `Apply changes` (or `Restart and apply changes`) button is available to
click, prompting you to confirm any changes before the Service is modified.

## Multiple databases
To create more than one Timescale Cloud database, you need to create a new
service for each database. Timescale Cloud does not support multiple
databases within the same service. Having a separate service for each database
affords each database its own isolated resources.

Another option is to use
[schemas](https://www.postgresql.org/docs/current/ddl-schemas.html).
Schemas provide a way to organize tables into logical groups. A single
database can contain multiple schemas, which in turn contain tables.
The main difference between isolating with databases versus schemas
is that a user can access objects in any of the schemas in the database
they are connected to, so long as they have the corresponding privileges.
Schemas can help isolate smaller use cases that do not warrant their
own service.

## PostgreSQL extensions
You can use PostgreSQL extensions with Timescale Cloud. If you run
`pg_available_extensions` at the command prompt, the returned list of extensions
is inaccurate. To see the allowed extensions, use this command instead:
```sql
SELECT pae.* FROM current_setting('extwlist.extensions') AS cs(e) CROSS JOIN regexp_split_to_table(e, ',') AS ext(allowed) JOIN pg_available_extensions AS pae ON (allowed=name) ORDER BY 1;
```
These are the currently supported extensions:

|Extension|Description|
|---|---|
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
|pgrouting|pgRouting Extension|
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
