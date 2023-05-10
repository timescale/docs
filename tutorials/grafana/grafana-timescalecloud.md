---
title: Connect TimescaleDB and Grafana
excerpt: Connect Timescale to Grafana to visualize your data
products: [cloud, mst]
keywords: [Grafana, visualizations, analytics]
---

import CloudTrial from 'versionContent/_partials/_cloudtrial.mdx';

# Connect TimescaleDB and Grafana

Grafana ships with built-in Prometheus, PostgreSQL, Jaeger, and other data
source plugins that allow you to query and visualize data from a compatible
database. To add a data source in Grafana you must be signed as a user with
organization administration role privileges.

To connect Grafana with TimescaleDB on Timescale, start by installing Grafana.
For more information about installing Grafana, see the
[Grafana documentation][grafana-install].

Alternatively, to connect your Grafana service on MST with your TimescaleDB
service on Timescale, create a [Grafana][install-grafana] service on
[Managed Service for TimescaleDB][mst-login].
You can try it for free for 30 days.

This section shows you how to connect TimescaleDB on Timescale
as a data source in [Grafana][grafana-homepage].

## Configure TimescaleDB as a data source

To configure TimescaleDB as a data source you need to create a service,
and then configure TimescaleDB as the data source in Grafana.

<Procedure>

### Creating a TimescaleDB service

1.  Sign in to the [Timescale portal][tsc-portal].
2.  Click `Create service`.
3.  You can choose to build your service with or without demo data.
4.  Click `Download the cheatsheet`. This `.sql` file contains the credentials
    that you require to configure TimescaleDB as a data source on Grafana.

<CloudTrial />

</Procedure>

<Procedure>

### Configuring TimescaleDB as data source

To configure TimescaleDB service on Timescale with your Grafana
installation, log in to Grafana and proceed to step 5 in this procedure.

1.  In the [MST account][mst-login] `Services` view, click the name of your new
    Grafana service.
2.  On the service details page, take a note of the `User` and `Password` field for
    your service.
3.  Click the link in the `Service URI` field to open Grafana.
4.  Log in to Grafana with your service credentials.
5.  Navigate to `Configuration` → `Data sources`. The data sources page lists
    previously configured data sources for the Grafana instance.
6.  Click `Add data source` to see a list of all supported data sources.
7.  Type `PostgreSQL` in the search field and click `Select`.
8.  Configure the data source:
    *   In the `Name` field, type name that you would like for dataset on TimescaleDB.
    *   In the `PostgreSQL Connection` section, type the  `Database`, `User`,
        and `Password` fields using the `.sql` file that you downloaded when
        creating the TimescaleDB service.
    *   In the `Host` type `<HOST>:<PORT>` from the `.sql` file that you downloaded.
    *   Set `TLS/SSL Mode` as `require`.
    *   In `PostgreSQL details` enable `TimescaleDB`
9.  Click `Save & test` button. If the connection is successful
    `Database Connection OK` appears.

</Procedure>

When you have configured TimescaleDB as a data source in Grafana, you can create panels that are populated with data using SQL.

[grafana-homepage]: https://grafana.com/
[tsc-portal]: https://console.cloud.timescale.com/
[install-grafana]: /tutorials/:currentVersion:/grafana/installation/#create-a-new-service-for-grafana
[mst-login]: https://portal.managed.timescale.com
[grafana-install]: https://grafana.com/docs/grafana/latest/installation/
