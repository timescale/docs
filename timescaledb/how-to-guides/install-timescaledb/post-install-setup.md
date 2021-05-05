# Setup

Ok, you have [installed][] TimescaleDB, and now you are ready to work with some
data.  The first thing to do is to create a new empty database or convert an
existing PostgreSQL database to use TimescaleDB.

<highlight type="tip">
If you are planning on doing any performance testing on TimescaleDB, we
strongly recommend that you [configure](/timescaledb/latest/how-to-guides/configuration/) TimescaleDB properly.
</highlight>

<img class="main-content__illustration" style="margin: 0 5% 0 10%;" src="https://assets.iobeam.com/images/docs/illustration-setup.svg" alt="setup illustration"/>

First connect to the PostgreSQL instance:

```bash
# Connect to PostgreSQL, using a superuser named 'postgres'
psql -U postgres -h localhost
```

Now create a new empty database (skip this if you already have a database):

```sql
-- Create the database, let's call it 'tutorial'
CREATE database tutorial;
```

<highlight type="warning">
Starting in v0.12.0, TimescaleDB enables [telemetry reporting](/api/latest/administration-functions/get_telemetry_report/)
by default. You can opt-out by following the instructions detailed
in our [telemetry documentation](/timescaledb/latest/how-to-guides/configuration/telemetry/). However, please do note that telemetry is
anonymous, and by keeping it on, you help us [improve our product](https://www.timescale.com/blog/why-introduced-telemetry-in-timescaledb-2ed11014d95d/).
</highlight>

Lastly add TimescaleDB:

```sql
-- Connect to the database
\c tutorial

-- Extend the database with TimescaleDB
CREATE EXTENSION IF NOT EXISTS timescaledb;
```

<highlight type="tip">
If you want to install a version that is not the most
recent available on your system you can specify the version like so:
`CREATE EXTENSION timescaledb VERSION '2.1.0';`
</highlight>

_That's it!_  Connecting to the new database is as simple as:

```bash
psql -U postgres -h localhost -d tutorial
```

---

Now that you have a new TimescaleDB database setup, start by inserting or
creating data to learn more about the features and superpowers we add to time-series
data:

1. **[Start from scratch][start-scratch]**: You don't currently have
any data, and just want to create an empty hypertable for inserting
data.
1. **[Migrate from PostgreSQL][migrate-postgres]**: You are currently
storing time-series data in a PostgreSQL database, and want to move this data
to a TimescaleDB hypertable.

---

[installed]: /how-to-guides/install-timescaledb/
[configure]: /administration/configuration/
[telemetry reporting]: /api/:currentVersion:/administration-functions/get_telemetry_report/
[telemetry documentation]: /administration/telemetry
[improve our product]: https://www.timescale.com/blog/why-introduced-telemetry-in-timescaledb-2ed11014d95d/
[start-scratch]: /how-to-guides/hypertables/create/
[migrate-postgres]: /how-to-guides/migrate-data/
