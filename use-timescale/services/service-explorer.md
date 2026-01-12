---
title: Service explorer
excerpt: Service explorer in Tiger Cloud provides a rich administrative dashboard for understanding the state of your services. Get insight into the performance and structure of your service
products: [cloud]
keywords: [services, hypertables, schemas, indexes, policies]
cloud_ui:
    path:
        - [services, :serviceId, explorer]
---

# $SERVICE_LONG explorer

$SERVICE_SHORT_CAP explorer in $CONSOLE provides a rich administrative dashboard for
understanding the state of your database instance. The explorer gives you
insight into the performance of your database, giving you greater confidence and
control over your data.

The explorer works like an operations center as you develop and run your
applications with $CLOUD_LONG. It gives you quick access to the key properties of
your database, like table sizes, schema definitions, and foreign key references,
as well as information specific to $CLOUD_LONG, like information on your hypertables
and continuous aggregates.

To see the explorer, select your $SERVICE_SHORT in $CONSOLE_SHORT and click `Explorer`.

## General information

In the `General information` section, you can see a high-level
summary of your $SERVICE_SHORT, including all your hypertables and
relational tables. It summarizes your overall compression ratios, and other
policy and continuous aggregate data. And, if you aren't already using key features like continuous aggregates, columnstore compression, or other automation policies and actions, it provides pointers to tutorials and documentation to help you get started.

![Service explorer][service-explorer]

## Tables

You can have a detailed look into all your tables, including information about table schemas, table indexes, and
foreign keys. For your hypertables, it shows details about chunks, continuous
aggregates, and policies such as data retention policies and data reordering.
You can also inspect individual hypertables, including their sizes, dimension
ranges, and columnstore compression status.

From this section, you can also set an automated policy to compress chunks into the columnstore. For more information,
see the [hypercore documentation][hypercore].

![Service explorer tables][service-explorer-tables]


For more information about hypertables, see the
[hypertables section][hypertables-section].

## Continuous aggregates

In the `Continuous aggregate` section, you can see all your continuous
aggregates, including top-level information such as their size, whether they are
configured for real-time aggregation, and their refresh periods.

![Service explorer caggs][service-explorer-caggs]

For more information about continuous aggregates, see the
[continuous aggregates section][caggs].

[caggs]: /use-timescale/:currentVersion:/continuous-aggregates/
[hypercore]: /use-timescale/:currentVersion:/hypercore/
[hypertables-section]: /use-timescale/:currentVersion:/hypertables/
[service-explorer-caggs]: https://assets.timescale.com/docs/images/tiger-on-azure/tiger-console-service-explorer-caggs.png
[service-explorer-tables]: https://assets.timescale.com/docs/images/tiger-on-azure/tiger-console-columstore-data-savings.png
[service-explorer]: https://assets.timescale.com/docs/images/tiger-on-azure/tiger-console-service-explorer.png
