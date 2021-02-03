# Why Use TimescaleDB over NoSQL?

Compared to general NoSQL databases (e.g., MongoDB, Cassandra) or even
more specialized time-oriented ones (e.g., InfluxDB, KairosDB),
TimescaleDB provides both qualitative and quantitative differences:

- **Normal SQL**: TimescaleDB gives you the power of standard SQL
  queries on time-series data, even at scale.  Most (all?) NoSQL
  databases require learning either a new query language or using
  something that's at best "SQL-ish" (which still breaks compatibility
  with existing tools).
- **Operational simplicity**:  With TimescaleDB, you only need to manage one
  database for your relational and time-series data.  Otherwise, users
  often need to silo data into two databases: a "normal" relational
  one, and a second time-series one.
- **JOINs** can be performed across relational and time-series data.
- **Query performance** is faster for a varied set
  of queries.  More complex queries are often slow or full table scans
  on NoSQL databases, while some databases can't even support many
  natural queries.
- **Manage like PostgreSQL** and inherit its support for varied datatypes and
  indexes (B-tree, hash, range, BRIN, GiST, GIN).
- **Native support for geospatial data**: Data stored in TimescaleDB
  can leverage PostGIS's geometric datatypes, indexes, and queries.
- **Third-party tools**: TimescaleDB supports anything that speaks
  SQL, including BI tools like Tableau.
