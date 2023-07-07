---
title: Telegraf
excerpt: Ingest data into Timescale using the Telegraf plugin
products: [cloud, mst, self_hosted]
keywords: [ingest, Telegraf]
tags: [insert]
---

import GrafanaConnect from "versionContent/_partials/_grafana-connect.mdx";

# Telegraf

Telegraf collects metrics from a wide array of inputs and writes them to a wide
array of outputs. It is plugin-driven for both collection and output of data so
it is extendable. It is written in Go, which means that it is a compiled
and standalone binary that can be run on any system with no need for
external dependencies, or package management tools.

Telegraf is an open source tool. It contains over 200 plugins for gathering and
writing different types of data, written by people who work with that data.

## Before you begin

Before you start, make sure you have:

*   [Installed Telegraf][install-telegraf] on the system where you want to collect
    metrics.
*   Created a [Timescale service][create-service].
*   Gathered the connection details for [your service][connect-timescaledb].
*   Installed [Grafana][grafana].

## Ingest metrics using the Telegraf plugin

<Procedure>

### Generating a configuration file

1.  Check the version of Telegraf that you installed:

    ```bash
    telegraf --version
    ```

1.  Generate a sample configuration file for Telegraf using:

    ```bash
    telegraf --input-filter=cpu --output-filter=postgresql config > telegraf.conf
    ```

    The sample configuration file enables a CPU input plugin that samples
    various metrics about CPU usage, and the PostgreSQL output plugin. The file
    also includes all available input, output, processor, and aggregator
    plugins. These are commented out by default. You can enable them as
    required.

1.  Test the sample configuration file `telegraf.conf` that you generated:

    ```bash
    telegraf --config telegraf.conf --test
    ```

    An output similar to this appears:

    ```bash
    2022-11-28T12:53:44Z I! Starting Telegraf 1.24.3
    2022-11-28T12:53:44Z I! Available plugins: 208 inputs, 9 aggregators, 26 processors, 20 parsers, 57 outputs
    2022-11-28T12:53:44Z I! Loaded inputs: cpu
    2022-11-28T12:53:44Z I! Loaded aggregators:
    2022-11-28T12:53:44Z I! Loaded processors:
    2022-11-28T12:53:44Z W! Outputs are not used in testing mode!
    2022-11-28T12:53:44Z I! Tags enabled: host=localhost
    > cpu,cpu=cpu0,host=localhost usage_guest=0,usage_guest_nice=0,usage_idle=90.00000000087311,usage_iowait=0,usage_irq=0,usage_nice=0,usage_softirq=0,usage_steal=0,usage_system=6.000000000040018,usage_user=3.999999999996362 1669640025000000000
    > cpu,cpu=cpu1,host=localhost usage_guest=0,usage_guest_nice=0,usage_idle=92.15686274495818,usage_iowait=0,usage_irq=0,usage_nice=0,usage_softirq=0,usage_steal=0,usage_system=5.882352941192206,usage_user=1.9607843136712912 1669640025000000000
    > cpu,cpu=cpu2,host=localhost usage_guest=0,usage_guest_nice=0,usage_idle=91.99999999982538,usage_iowait=0,usage_irq=0,usage_nice=0,usage_softirq=0,usage_steal=0,usage_system=3.999999999996362,usage_user=3.999999999996362 1669640025000000000
    ```

</Procedure>

<Procedure>

### Configuring the PostgreSQL output plugin

1.  Open the `telegraf.conf` file in your preferred text editor and set the
    `connection` parameter in the `[[outputs.postgresql]]` section to
    the`<SERVICE URL>` of the Timescale service that you created:

    ```bash
    connection = "<SERVICE URL>"
    ```

1.  Create a hypertable by adding the `table_template` parameter in the config
    file to execute when creating a new table. You can add this parameter in the
    section that begins with the comment `## Templated statements to execute
    when creating a new table.` After you add the `table_template` parameter, the
    section in the configuration file looks like this:

    ```bash
    ## Templated statements to execute when creating a new table.
    # create_templates = [
    #   '''CREATE TABLE {{ .table }} ({{ .columns }})''',
    # ]
    #  table_template=`CREATE TABLE IF NOT EXISTS {TABLE}({COLUMNS}); SELECT create_hypertable({TABLELITERAL},'time',chunk_time_interval := INTERVAL '1 week',if_not_exists := true);`

    ```

</Procedure>

<Procedure>

### Viewing the metrics collected by Telegraf

1.  Run Telegraf to collect the metrics:

    ```bash
    telegraf --config telegraf.conf
    ```

    The output uses loaded inputs `cpu`and outputs `postgresql` along with
    `global tags`, and the intervals with which the agent collects the data from
    the inputs, and flushes to the outputs.

    An output similar to this appears:

    ```bash
    2022-12-05T12:32:00Z I! Starting Telegraf 1.24.3
    2022-12-05T12:32:00Z I! Available plugins: 208 inputs, 9 aggregators, 26 processors, 20 parsers, 57 outputs
    2022-12-05T12:32:00Z I! Loaded inputs: cpu
    2022-12-05T12:32:00Z I! Loaded aggregators:
    2022-12-05T12:32:00Z I! Loaded processors:
    2022-12-05T12:32:00Z I! Loaded outputs: postgresql
    2022-12-05T12:32:00Z I! Tags enabled: host=test
    2022-12-05T12:32:00Z I! [agent] Config: Interval:10s, Quiet:false, Hostname:"test", Flush Interval:10s
    ```

1.  Stop running Telegraf to collect the metrics after approximately 15 to 20
    seconds.

1.  Connect to Timescale and provide the `<PASSWORD>` for `tsdbadmin`:

    ```bash
    psql <SERVICE URL>
    Password for user tsdbadmin: <PASSWORD>
    ```

1.  View the metrics collected in the `cpu` table in `tsdb`:

    ```sql
    SELECT*FROM cpu;
    ```

    An output similar to this appears:

    ```sql
    time         |    cpu    |               host               | usage_guest | usage_guest_nice |    usage_idle     | usage_iowait | usage_irq | usage_nice | usage_softirq | usage_steal |    usage_system     |     usage_user
    ---------------------+-----------+----------------------------------+-------------+------------------+-------------------+--------------+-----------+------------+---------------+-------------+---------------------+---------------------
    2022-12-05 12:25:20 | cpu0      | hostname |           0 |                0 | 83.08605341237833 |            0 |         0 |          0 |             0 |           0 |   6.824925815961274 |  10.089020771444481
    2022-12-05 12:25:20 | cpu1      | hostname |           0 |                0 | 84.27299703278959 |            0 |         0 |          0 |             0 |           0 |   5.934718100814769 |   9.792284866395647
    2022-12-05 12:25:20 | cpu2      | hostname |           0 |                0 | 87.53709198848934 |            0 |         0 |          0 |             0 |           0 |   4.747774480755411 |   7.715133531241037
    2022-12-05 12:25:20 | cpu3      | hostname|           0 |                0 | 86.68639053296472 |            0 |         0 |          0 |             0 |           0 |    4.43786982253345 |   8.875739645039992
    2022-12-05 12:25:20 | cpu4      | hostname |           0 |                0 | 96.15384615371369 |            0 |         0 |          0 |             0 |           0 |  1.1834319526667423 |  2.6627218934917614
    ```

1.  To view the average usage per CPU core, use:

    ```sql
    SELECT cpu, avg(usage_user) FROM cpu GROUP BY cpu;
    ```

    An output similar to this appears:

    ```sql
        cpu    |         avg
     -----------+---------------------
      cpu7      | 0.36239363864003277
      cpu-total |  2.7778985775548013
      cpu4      |  1.9990184779524285
      cpu2      |   4.083993994915682
      cpu0      |   5.281711648540422
      cpu1      |  4.9013756546309155
      cpu6      |  0.6719913538159535
      cpu5      |  1.0512637475474937
      cpu3      |   3.871919066617788
    ```

</Procedure>

For more information about the options that you can configure in Telegraf,
see the [PostgreQL output plugin][output-plugin].

<GrafanaConnect />

When you have configured Timescale as a data source in Grafana, you can create
panels that are populated with data using SQL.

[output-plugin]: https://github.com/influxdata/telegraf/blob/release-1.24/plugins/outputs/postgresql/README.md
[install-telegraf]: https://docs.influxdata.com/telegraf/v1.21/introduction/installation/
[create-service]: /getting-started/latest/
[connect-timescaledb]: /use-timescale/:currentVersion:/integrations/query-admin/about-connecting/
[grafana]: /use-timescale/:currentVersion:/integrations/observability-alerting/grafana/installation/
