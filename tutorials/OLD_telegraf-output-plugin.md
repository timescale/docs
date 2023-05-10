---
title: Collecting metrics with the PostgreSQL and TimescaleDB output plugin for Telegraf
excerpt: Collect metrics with Telegraf (deprecated)
products: [cloud, mst, self_hosted]
keywords: [metrics, monitor, Telegraf]
---

# Collecting metrics with the PostgreSQL and TimescaleDB output plugin for Telegraf

<Highlight type="deprecation">
This section describes a feature that is deprecated on TimescaleDB. We strongly
recommend that you do not use this feature in a production environment. For some
suggestions of workarounds, see this
[Timescale Forum post](https://www.timescale.com/forum/t/telegraf-plugin/118).
If you need more information, please
[contact the support team](https://www.timescale.com/support).
</Highlight>

Telegraf collects metrics from a wide array of inputs and writes them to a wide
array of outputs. It is plugin-driven for both collection and output of data so
it is extendable. It is written in Go, which means that it is a compiled
and standalone binary that can be run on any system with no need for
external dependencies, or package management tools required.

Telegraf is an open source tool. It contains over 200 plugins for gathering and
writing different types of data written by people who work with that data.
Timescale have built downloadable binaries of Telegraf with the plugin included.
This tutorial runs through a couple of examples on how to use the PostgreSQL and
TimescaleDB output plugin for Telegraf.

## Installation

Before you start, you need [TimescaleDB installed][getting-started] and a means to connect to it.

### Setting up Telegraf

Telegraf is written in Go, and the current build process of the tool is
configured to produce one standalone binary. Because of this all the code for
the different plugins must be part of that binary. Timescale have an unofficial
build of Telegraf version 1.13.0 with the plugin added, that you can download
from:

<!--- These links no longer work, deleted. LKB 2023-05-10

*   Linux amd64: <Tag type="download">[deb]()</Tag> <Tag type="download">[rpm]()</Tag> <Tag type="download">[binary]()</Tag>
*   Windows amd64: <Tag type="download">[binary/exe]()</Tag>
*   MacOS amd64: <Tag type="download">[binary]()</Tag>

-->

Timescale also provide you with builds for:

*   Windows i386
*   Linux (i386, armhf, armel, arm64, static_amd64, s390x, mipsel)
*   FreeBSD (amd64, i386)

You can get in contact using the Timescale [community Slack][public-slack]

Once you download the binary and extract it to a suitable location (or install
the packages) you can test out the build. You might need to make the file
executable by running `chmod +x telegraf`. Check the version of the
installed Telegraf using this command:

```bash
telegraf --version
```

If the installation is successful, it shows `Telegraf 1.13.0-with-pg`.

## Telegraf configuration

When Telegraf is started, you need to specify a configuration file. The
configuration file sets up:

*   Telegraf agent
*   Collection interval
*   Jitter
*   Buffer and batch size and so on
*   Global tags added to all collected metrics from all inputs
*   Enabled outputs, processors, aggregators, inputs (and their respective configuration)

A sample config file with PostgreSQL included as a plugin can be generated with
this command:

```bash
telegraf --input-filter=cpu --output-filter=postgresql config > telegraf.conf
```

This command generates a configuration file that enables a CPU input plugin that
samples various metrics about CPU usage, and the PostgreSQL output plugin. The
file also includes all available input, output, processor, and aggregator
plugins, commented out, so you can enable them as required.

### Testing out the configuration file

To test your configuration, you can output a single collection to `STDOUT`, like this:

```bash
telegraf --config telegraf.conf --test
```

This command selects the generated configuration file that enables only the CPU input plugin. The output should look something like this:

```bash
> cpu,cpu=cpu0,host=local usage_guest=0,usage_idle=78.431372,usage_iowait=0,usage_irq=0,usage_softirq=0,usage_steal=0,usage_system=11.764705,usage_user=9.803921 1558613882000000000
> cpu,cpu=cpu1,host=local usage_guest=0,usage_idle=92.156862,usage_iowait=0,usage_irq=0,usage_softirq=0,usage_steal=0,usage_system=3.921568,usage_user=3.921568 1558613882000000000
> cpu,cpu=cpu-total,host=local usage_guest=0,usage_idle=87.623762,usage_iowait=0,usage_irq=0,usage_softirq=0,usage_steal=0,usage_system=6.435643,usage_user=5.940594 1558613882000000000
```

A line is outputted for each core of the CPU and the total. Values are presented in `key=value` pairs with the timestamp last in the row.
When writing to STDOUT you can distinguish between *tags*, which are indexed fields (`cpu`, `host`) and value *fields* (like `usage_quest` or `usage_user`) by a blank space (in this example the space after `host=local`).
The distinction exists because different configuration options are available for the different fields.

### Configuring the PostgreSQL output plugin

The `telegraf.conf` file you generated has a section (around line 80) headed with

```txt
################################################
#                OUTPUT PLUGINS                #
################################################
```

Below this header, the default configuration for the PostgreSQL output plugin is
shown. It looks like this:

```txt
[[outputs.postgresql]]
  ## specify address via a url matching:
  ##   postgres://[pqgotest[:password]]@localhost[/dbname]\
  ##       ?sslmode=[disable|verify-ca|verify-full]
  ## or a simple string:
  ##   host=localhost user=pqotest password=... sslmode=... dbname=app_production
  ##
  ## All connection parameters are optional. Also supported are PG environment vars
  ## e.g. PGPASSWORD, PGHOST, PGUSER, PGDATABASE
  ## all supported vars here: https://www.postgresql.org/docs/current/libpq-envars.html
  ##
  ## Without the dbname parameter, the driver will default to a database
  ## with the same name as the user. This dbname is just for instantiating a
  ## connection with the server and doesn't restrict the databases we are trying
  ## to grab metrics for.
  ##
  connection = "host=localhost user=postgres sslmode=verify-full"

  ## Store tags as foreign keys in the metrics table. Default is false.
  # tags_as_foreignkeys = false

  ## Template to use for generating tables
  ## Available Variables:
  ##   {TABLE} - tablename as identifier
  ##   {TABLELITERAL} - tablename as string literal
  ##   {COLUMNS} - column definitions
  ##   {KEY_COLUMNS} - comma-separated list of key columns (time + tags)
  ## Default template
  # table_template = "CREATE TABLE IF NOT EXISTS {TABLE}({COLUMNS})"
  ## Example for timescaledb
  # table_template = "CREATE TABLE {TABLE}({COLUMNS}); SELECT create_hypertable({TABLELITERAL},'time');"

  ## Schema to create the tables into
  # schema = "public"

  ## Use jsonb datatype for tags
  # tags_as_jsonb = false
  ## Use jsonb datatype for fields
  # fields_as_jsonb = false
```

From the configuration, you can see a few important things:

*   The top line enables the plugin, the plugin specific configuration is
    indented after this line.
*   There is currently only one parameter configured, `connection`. The others
    are commented out.
*   Possible parameters are commented out with a single `#`.
    (`tags_as_foreignkeys`, `table_template`, `schema`, `tags_as_jsonb`,
    `fields_as_jsonb`).
*   Explanations of the parameters are commented out with `##`.

The commented out parameters also show their default values.

In the first example you'll set the connection parameter to a proper connection string to establish a connection to an instance of TimescaleDB or PostgreSQL.
All the other parameters have their default values.

### Creating hypertables

The plugin allows you to configure several parameters. The `table_template`
parameter defines the SQL to be run when a new measurement is recorded by
Telegraf and the required table doesn't exist in the output database. By
default, the `table_template` used is `CREATE TABLE IF NOT EXISTS
{TABLE}({COLUMNS})` where `{TABLE}` and `{COLUMNS}` are placeholders for the
name of the table and the column definitions.

You can update `table_template` in the configuration for TimescaleDB with this
command:

```sql
  table_template=`CREATE TABLE IF NOT EXISTS {TABLE}({COLUMNS}); SELECT create_hypertable({TABLELITERAL},'time',chunk_time_interval := INTERVAL '1 week',if_not_exists := true);`
```

This way when a new table is created it is converted into a hypertable, with
each chunk holding 1 week intervals. Nothing else is needed to use the plugin
with TimescaleDB.

## Running Telegraf

When you run Telegraf you only need to specify the configuration file to use. In this example, the output uses loaded inputs (`cpu`) and outputs (`postgresql`) along with global tags, and the intervals with which the agent collects the data from the inputs, and flush to the outputs. You can stop Telegraf running after ~10-15 seconds:

```bash
telegraf --config telegraf.conf
2019-05-23T13:48:09Z I! Starting Telegraf 1.13.0-with-pg
2019-05-23T13:48:09Z I! Loaded inputs: cpu
2019-05-23T13:48:09Z I! Loaded outputs: postgresql
2019-05-23T13:48:09Z I! Tags enabled: host=local
2019-05-23T13:48:09Z I! [agent] Config: Interval:10s, Quiet:false, Hostname:"local", Flush Interval:10s
```

Now you can connect to the PostgreSQL instance and inspect the data:

```bash
psql -U postgres -h localhost
```

The CPU input plugin has one measurement, called `cpu`, and it's stored in a
table of the same name (by default in the public schema). So with the SQL query
`SELECT * FROM cpu`, depending on how long you left Telegraf running, you see
the table populated with some values. You can find the average usage per CPU
core with `SELECT cpu, avg(usage_user) FROM cpu GROUP BY cpu`. The output should
look like this:

```sql
    cpu    |       avg
-----------+------------------
 cpu-total | 8.46385703620795
 cpu0      | 12.4343351351033
 cpu1      | 4.88380203380203
 cpu2      | 12.2718724052057
 cpu3      | 4.26716970050303
```

### Adding new tags or fields

Your Telegraf configuration can change at any moment. An input plugin can be
reconfigured to produce different data, or you might decide to index your data
with different tags. The SQL plugin can dynamically update the created tables
with new columns as they appear. The previous configuration used had no global
tags specified other than the `host` tag. Now you can add a new global tag in
the configuration by opening the file in any text editor and updating the
`[global_tags]` section (around line 18) with:

```txt
[global_tags]
  location="New York"
```

This way all metrics collected with the instance of Telegraf running with this
config is tagged with `location="New York"`. If you run Telegraf again,
collecting the metrics in TimescaleDB, using this command:

```bash
telegraf --config telegraf.conf
```

After a while you can check on the `cpu` table in the database, like this:

```sql
psql> \dS cpu
\dS cpu;
Table "public.cpu"
      Column      |           Type
------------------+--------------------------
 time             | timestamp with time zone
 cpu              | text
 host             | text
 usage_steal      | double precision
 usage_iowait     | double precision
 usage_guest      | double precision
 usage_idle       | double precision
 usage_softirq    | double precision
 usage_system     | double precision
 usage_user       | double precision
 usage_irq        | double precision
 location         | text
 ```

 You can see the `location` column is added and it contains `New York` for all
 rows.

### Creating a separate metadata table for tags

The plugin allows you to select the tag sets inserted in a separate table and
then referenced using foreign keys in the measurement table. Having the tags in
a separate table saves space for high cardinality tag sets, and allows certain
queries to be written more efficiently. To enable this change, you need to
uncomment the `tags_as_foreignkeys` parameter in the plugin config (around line
103 in `telegraf.conf`) and set it to true:

```txt
## Store tags as foreign keys in the metrics table. Default is false.
tags_as_foreignkeys = true
```

To better visualize the result you can drop the existing `cpu` table from the
database:

```sql
psql> DROP TABLE cpu;
```

Now you can start Telegraf again, this time with the configuration changed to
write the tags in a separate table:

```bash
telegraf --config telegraf.conf
```

You can turn it off after 20-30 seconds, and check on the `cpu` table in the
database:

```sql
psql> \dS cpu
\dS cpu
Table "public.cpu"
      Column      |           Type
------------------+--------------------------
 time             | timestamp with time zone
 tag_id           | integer
 usage_irq        | double precision
 usage_softirq    | double precision
 usage_system     | double precision
 usage_iowait     | double precision
 usage_guest      | double precision
 usage_user       | double precision
 usage_idle       | double precision
 usage_steal      | double precision
```

Now the `cpu`, `host` and `location` columns are not there, instead there's a `tag_id` column. The tag sets are stored in a separate table called `cpu_tag`:

```sql
 psql> SELECT * FROM cpu_tag;
 tag_id |  host |    cpu    |  location
--------+-------+-----------+----------
      1 | local | cpu-total | New York
      2 | local | cpu0      | New York
      3 | local | cpu1      | New York
```

### JSONB column for Tags and Fields

The tags and fields can be stored as JSONB columns in the database. You need to uncomment the `tags_as_jsonb` or `fields_as_jsonb` parameters in `telegraf.conf` (around line 120) and set them to `true`. In this example, the fields are stored as separate columns, but the tags are stored as JSON:

```txt
## Use jsonb datatype for tags
tags_as_jsonb = true
## Use jsonb datatype for fields
fields_as_jsonb = false
```

To better visualize the result, drop the existing `cpu_tag` table from the database:

```sql
psql> DROP TABLE cpu_tag;
```

Start Telegraf again, and turn it off after 20-30 seconds. Then check the `cpu_tag` table:

```bash
telegraf --config telegraf.conf
```

```sql
 psql> SELECT * FROM cpu_tag;
 tag_id |                                       tags
--------+-----------------------------------------------------------------------------------
      1 | {"cpu": "cpu-total", "host": "local", "location": "New York"}
      2 | {"cpu": "cpu0", "host": "local", "location": "New York"}
      3 | {"cpu": "cpu1", "host": "local", "location": "New York"}
```

Instead of having three text columns, now you have one JSONB column.

## Next steps

When you have started inserting data in TimescaleDB, you can begin to familiarize yourself with the [API reference][api].

Additionally, there are several other [tutorials][] available for you to explore
as you become accustomed to working with TimescaleDB.

[api]: /api/:currentVersion:/
[getting-started]: /getting-started/latest/
[public-slack]: https://slack.timescale.com/
[tutorials]: /tutorials/:currentVersion:/
