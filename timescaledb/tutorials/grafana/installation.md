---
title: Set up TimescaleDB and Grafana
excerpt: Use Grafana to visualize your data on Managed Service for TimescaleDB
products: [mst]
keywords: [Grafana, visualization, analytics]
---

# Set up TimescaleDB and Grafana

This tutorial uses Managed Service for TimescaleDB (MST) to set up your database, and
to set up Grafana. You can [create a free account][mst-login] to try it out.

## Create a new service for Grafana

You need to sign in to your MST account to create a
new service to run Grafana.

<Procedure>

### Creating a new service for Grafana

1.  [Log in to your Managed Service for TimescaleDB account][mst-login]. By default, you start in the
    `Services` view, showing any services you currently have in your project.
1.  Click `Create a new service`.
1.  In the `Select your service` section, click `TimescaleDB Grafana - Metrics
    dashboard`:
    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/mst-selectservice-grafana.png" alt="Select the Grafana service"/>
1.  In the `Select your cloud service provider` and `Select your cloud service
    region` sections, choose the provider and region that you prefer, or accept
    the default values.
1.  In the `Select your service plan` section, click `Dashboard-1`.
1.  In the `Provide your service name` section, type a name for your new
    service. In this example, we've used `grafana-tutorial`.
    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/mst-nameservice-grafana.png" alt="Name the Grafana service"/>
1.  When you are happy with your selections, click `Create Service` to go back  
    to the `Services` view while your service is created. The status indicator
    says `Rebuilding` while the service is created. It is ready for you to use
    when the indicator is green and says `Running`. This usually takes a couple
    of minutes, but different clouds can vary. You can click the service name in
    the list to see more information and make changes.
    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/mst-buildservice-grafana.png" alt="Building the Grafana service"/>

</Procedure>

## Log in to your MST Grafana service

When your service is built, you can log and set up your data services.

### Logging in to your MST Grafana service

1.  In the [MST account][mst-login] `Services` view, click the name of your new
    Grafana service.
1.  On the service details page, take a note of the user name and password for
    your service, and click the link in the `Service URI` field to open Grafana:
    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/mst-buildservice-grafana.png" alt="Building the Grafana service"/>
1.  Log in to Grafana with your service credentials.

## Connect Grafana to your TimescaleDB instance

Now you have your Grafana service up and running, you can configure Grafana to
connect to your TimescaleDB instance.

### Connecting Grafana to your TimescaleDB instance

1.  In Grafana, click `Configuration → Data Sources` in the left menu bar.
1.  Click `Add Data Source` and choose the `PostgreSQL` option in the SQL group:
    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/grafana-add-postgresql.png" alt="Adding PostgreSQL to Grafana"/>
1.  On the data sources configuration page, complete these details:
    *   In the `Name` field, type a name for the data source. In this example,
        we used `tsdb-grafana-tutorial`.
    *   In the `Host` field, type the Service URI for your service, add a colon
        at the end, and then type the port number. In this example, we used
        `grafana-tutorial-internal-90d0.a.timescaledb.io:443`
    *   In the `Database` field, type the name of your Grafana service. In this
        example, we used `grafana-tutorial`.
    *   In the `User` field, type the user name for your Grafana service.
    *   In the `Password` field, type the password for your Grafana service.
    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/grafana-configure-postgresql.png" alt="Configure the PostgreSQL data source"/>
1.  In the `PostgreSQL details` section, in the `TimescaleDB` field, toggle the
    switch on:
    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/grafana-configure-tsdb.png" alt="Configure PostgreSQL to use TimescaleDB"/>
1.  Click `Save & Test`. You can confirm your data source is working by clicking
    `Back`, and checking that your service is listed correctly.

[mst-login]: https://portal.managed.timescale.com
