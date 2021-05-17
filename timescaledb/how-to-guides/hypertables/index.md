# Hypertables

Hypertables in TimescaleDB are designed to be easy to manage and to behave
predictably to users familiar with standard PostgreSQL tables. Along those lines,
SQL commands to create, alter, or delete (hyper)tables in TimescaleDB are
identical to those in PostgreSQL.  Even though hypertables are comprised of many
interlinked "chunk" tables, commands made to the hypertable automatically propagate
changes down to all of the chunks belonging to that hypertable.
