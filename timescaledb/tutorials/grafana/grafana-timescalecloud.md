---
title: Connect TimescaleDB and Grafana
excerpt: Connect Timescale Cloud to Grafana to visualize your data
keywords: [Grafana, visualizations, analytics]
---

import CloudTrial from 'versionContent/_partials/_cloudtrial.mdx';

# Connect TimescaleDB and Grafana

Grafana ships with built-in Prometheus, PostgreSQL, Jaeger, and other data
source plugins that allow you to query and visualize data from a compatible
database. To add a data source in Grafana you must be signed as a user with
organization administration role privileges.

To connect Grafana with TimescaleDB on Timescale Cloud, start by installing Grafana.
For more information about installing Grafana, see the [Grafana installation documentation][grafana-install].

Alternatively, to connect your Grafana service on MST with your TimescaleDB service
on Timescale Cloud, create a [Grafana][install-grafana] service on
[MST][mst-login]. You can try it for free for 30 days.

This section shows you how to connect TimescaleDB on Timescale Cloud
as a data source in [Grafana][grafana-homepage].

## Configure TimescaleDB as a data source

To configure TimescaleDB as a data source you need to create a service,
and then configure TimescaleDB as the data source in Grafana.

<procedure>

### Creating a TimescaleDB service

1.  Sign in to the [Timescale Cloud portal][tsc-portal].
1.  Click `Create service`.
1.  You can choose to build your service with or without demo data. 
1.  Click `Download the cheatsheet`. This `.sql` file contains the credentials
    that you require to configure TimescaleDB as a data source on Grafana.

<CloudTrial />

</procedure>

<procedure>

### Configuring TimescaleDB as data source

To configure TimescaleDB service on Timescale Cloud with your Grafana
installation, log in to Grafana and proceed to step 5 in this procedure.

1.  In the [MST account][mst-login] `Services` view, click the name of your new
    Grafana service.
1.  On the service details page, take a note of the `User` and `Password` field for
    your service.
1.  Click the link in the `Service URI` field to open Grafana.
1.  Log in to Grafana with your service credentials.
1.  Navigate to `Configuration` → `Data sources`. The data sources page lists
    previously configured data sources for the Grafana instance.
1.  Click `Add data source` to see a list of all supported data sources.
1.  Type `PostgreSQL` in the search field and click `Select`.
1.  Configure the data source:
    *   In the `Name` field, type name that you would like for dataset on TimescaleDB.
    *   In the `PostgreSQL Connection` section, type the  `Database`, `User`,
        and `Password` fields using the `.sql` file that you downloaded when
        creating the TimescaleDB service. 
    *   In the `Host` type `<HOST>:<PORT>` from the `.sql` file that you downloaded.
    *   Set `TLS/SSL Mode` as `require`.
    *   In `PostgreSQL details` enable `TimescaleDB`
1.  Click `Save & test` button. If the connection is successful
    `Database Connection OK` appears. 

</procedure>

When you have configured TimescaleDB as a data source in Grafana, you can create panels that are populated with data using SQL.

[grafana-homepage]: https://grafana.com/
[tsc-portal]: https://console.cloud.timescale.com/
[install-grafana]: /timescaledb/:currentVersion:/tutorials/grafana/installation/#create-a-new-service-for-grafana
[mst-login]: https://portal.managed.timescale.com
[grafana-install]: https://grafana.com/docs/grafana/latest/installation/
