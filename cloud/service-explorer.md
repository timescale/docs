---
title: Service explorer
excerpt: Get insight into the performance and structure of your database
product: cloud
keywords: [services, hypertables, schemas, indexes, policies]
---

# Service explorer

Timescale Cloud Service Explorer provides a rich administrative dashboard for
understanding the state of your database instance. The Explorer gives you
insight into the performance of your database, giving you greater confidence and
control over your data.

The Explorer works like an operations center as you develop and run your
applications on TimescaleDB. It gives you quick access to the key properties of
your database, like table sizes, schema definitions, and foreign key references,
as well TimescaleDB specific information, like information on your hypertables
and continuous aggregates.

You can see the Explorer in your Timescale Cloud account by navigating to
the `Services` section, clicking the service you want to explore, and selecting
the `Explorer` tab.

## General information

In the `General information` section of the Explorer, you can see a high-level
summary of your TimescaleDB database, including all your hypertables and
relational tables. It summarizes your overall compression ratios, and other
policy and continuous aggregate data. And, if you aren't already using key
features like TimescaleDB's native compression, continuous aggregates, or other
automation policies and actions, it provides pointers to tutorials and
documentation to help you get started.

<img class="main-content__illustration"
src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-explorer.png"
alt="Timescale Cloud Explorer, General Information section"/>

## Tables

In the `Tables` section of the Explorer, you can see a detailed look into all
your tables, including information about table schemas, table indexes, and
foreign keys. For your hypertables, it shows details about chunks, continuous
aggregates, and policies such as data retention policies and data reordering.
You can also inspect individual hypertables, including their sizes, dimension
ranges, and compression status.

You can also set a compression policy from this section. For more information, see the 
[Setting a compression policy from Timescale Cloud console][set-compression] section.

<img class="main-content__illustration"
src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-explorer-tables.png"
alt="Timescale Cloud Explorer, Tables section"/>

For more information about hypertables, see our
[hypertables section][hypertables].

## Setting a compression policy from Timescale Cloud console

You can set a [compression policy][compression] on a hypertable directly from
Timescale Cloud console.

<procedure>

### Set a compression policy from Timescale Cloud console

1.  Inside the Timescale Cloud Service Explorer, select a hypertable.
1.  Select the `Policies` tab.
1.  In the `Compression policy` section, click `Create compression policy`. A
    suggested policy interval is pre-selected for you, but you can change this
    in the next step.

    <img class="main-content__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-explorer-compression-policy.png"
    alt='A screenshot of the compression policy section, showing the "Create
    compression policy" button and a default policy interval of 14 days.' />

1.  A modal appears with options for different compression policy intervals.
    Select your desired interval, and click `Save changes`.
1.  Your new compression policy appears in the list of policies. You can expand
    each row to see the policy details and change your configuration.

    <highlight type="note">
    Compression begins immediately if you already have data older than the
    selected interval. The order of compression is from oldest to newest chunks.
    </highlight>

</procedure>

## Continuous aggregates

In the `Continuous aggregate` section, you can see all your continuous
aggregates, including top-level information such as their size, whether they are
configured for real-time aggregation, and their refresh periods.

<img class="main-content__illustration"
src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-explorer-caggs.png"
alt="Timescale Cloud Explorer, Continuous aggregates section"/>

For more information about continuous aggregates, see our
[continuous aggregates section][caggs].

[caggs]: /timescaledb/:currentVersion:/how-to-guides/continuous-aggregates/
[compression]: /timescaledb/:currentVersion:/how-to-guides/compression/
[hypertables]: /timescaledb/:currentVersion:/how-to-guides/hypertables/
[set-compression]: #setting-a-compression-policy-from-timescale-cloud-console
