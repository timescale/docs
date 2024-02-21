---
title: Set up TimescaleDB for Managed Service and Grafana
excerpt: Use Grafana to visualize your data on Managed Service for TimescaleDB
products: [cloud, mst, self_hosted]
keywords: [Grafana, visualization, analytics]
---


# Set up TimescaleDB for Managed Service and Grafana 

Follow this tutorial to get started with Managed Service for TimescaleDB. Read on
to learn how to set up your first database, and get connected with Grafana. 

## Create a new service for Grafana

Sign in to your [Managed Service for Timescale][mst-timescale] account to create a
new service to run Grafana.

<Procedure>

### Creating a new service for Grafana

1.  Log in to your Managed Service for TimescaleDB account, and click `Create a new service`.
1.  In the `Select your service` section, click `Grafana - Data visualization and analytics program`.
    dashboard`:
    <img class="main-content__illustration" src="https://drive.google.com/drive/folders/1fg5kF1ktcww9uTUDK-ntoxs_EbN4UYKP" alt="Select the Grafana service"/>
1.  In the `Select your cloud service provider` and `Select your cloud service
    region` sections, choose the provider and region that you prefer, or accept
    the default values.
1.  In the `Select your service plan` section, `Dashboard-1` is already selected.
1.  In the `Provide your service name` section, type a name for your new
    service. In this example, we've used `grafana-tutorial`. The service's name
    cannot be changed after this.
    <img class="https://drive.google.com/drive/folders/1fg5kF1ktcww9uTUDK-ntoxs_EbN4UYKP" alt="Name the Grafana service"/>
1.  When you are done with your selections, click `Create Service` to go back
    to the `Services` view while your service is being created. The status indicator
    says `Rebuilding` while the service is created.
    <img class="main-content__illustration" src="https://drive.google.com/drive/folders/1fg5kF1ktcww9uTUDK-ntoxs_EbN4UYKP" alt="Building the Grafana service"/>
1. The service is ready for you to use when the indicator is green and says `Running`.
   This typically takes a couple of minutes, but different clouds can vary. You can click the
   service name in the list to see more information and make any necessary changes.

</Procedure>

## Log in to your Grafana service

When your service is ready, you can log into Grafana and configure your data service for your organization's needs.

### Logging in to your MST Grafana service

1.  In the Managed Service for TimescaleDB `Services` view, click the name of
    your new Grafana service.
1.  On the service details page, take note of the user name and password for
    your service, and click the link in the `Service URI` field to open Grafana.
    <img class="main-content__illustration" src="https://drive.google.com/drive/folders/1fg5kF1ktcww9uTUDK-ntoxs_EbN4UYKP" alt="Open Grafana"/>
1.  Log in to Grafana with your service credentials and click the `Tutorials` button near the top
    right of the screen to find further configuration resources. Select the
    [Grafana Fundamentals][grafana-fundamentals] tutorial as a quick and easy place to start.

[mst-timescale]: https://portal.managed.timescale.com/login
[grafana-fundamentals]: https://grafana.com/tutorials/grafana-fundamentals/
