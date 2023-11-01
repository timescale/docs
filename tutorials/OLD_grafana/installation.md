---
title: Set up TimescaleDB and Grafana
excerpt: Use Grafana to visualize your data on Managed Service for TimescaleDB
products: [cloud, mst, self_hosted]
keywords: [Grafana, visualization, analytics]
---

import GrafanaConnect from "versionContent/_partials/_grafana-connect.mdx";

# Set up TimescaleDB and Grafana

This tutorial uses Managed Service for TimescaleDB to set up your database, and
to set up Grafana.

## Create a new service for Grafana

You need to sign in to your Managed Service for Timescale account to create a
new service to run Grafana.

<Procedure>

### Creating a new service for Grafana

1.  Log in to your Managed Service for TimescaleDB account, and click `Create a new service`.
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

## Log in to your Grafana service

When your service is built, you can log and set up your data services.

### Logging in to your MST Grafana service

1.  In the Managed Service for TimescaleDB `Services` view, click the name of
    your new Grafana service.
1.  On the service details page, take a note of the user name and password for
    your service, and click the link in the `Service URI` field to open Grafana:
    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/mst-buildservice-grafana.png" alt="Building the Grafana service"/>
1.  Log in to Grafana with your service credentials.

<GrafanaConnect />

<!---
I appreciate that this doesn't really fit here well at the moment, but I'm coming back to this tutorial next, and will rewrite it properly then. I promise! --LKB 2023-02-28
-->
