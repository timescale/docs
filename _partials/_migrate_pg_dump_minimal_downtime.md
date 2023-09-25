For minimal downtime, the `pg_dump` and `psql` commands should be run from a
machine with a low-latency, high-throughput link to the database that they are
connected to. As Timescale instances run in the Amazon cloud, use an AWS EC2
instance in the same region as your Timescale instance.
