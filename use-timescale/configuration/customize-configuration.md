---
title: Configure database parameters
excerpt: Customize the configuration of your TimescaleDB database
products: [cloud]
keywords: [configure, services, settings]
cloud_ui:
    path:
        - [services, :serviceID, operations, database_parameters]
    priority: 1
---

# Configure database parameters

Timescale allows you to customize many Timescale and PostgreSQL
configuration options for each Service individually. Most configuration values
for a service are initially set in accordance with best practices given the
compute and storage settings of the service. Any time you increase or decrease
the compute for a Service, the most essential values are set to reflect the size
of the new service.

<Highlight type="warning">
You can modify most parameters without restarting the Timescale service.
However, some changes do require a restart, resulting in some brief downtime
that is usually about 30&nbsp;seconds. An example of a change that needs a
restart is modifying the compute resources of a running service.
</Highlight>

## View service operation details

To modify configuration parameters, first select the Service that you want to
modify. This displays the `service details`, with these tabs across the top:
Overview, Explorer, Operations, Metrics, and Logs. Select `Operations`, then
`Database parameters`.

<img class="main-content__illustration"
src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-settings.png"
alt="View Timescale service settings"/>

### Modify basic parameters

Under the `Common parameters` tab, you can modify a limited set of the
parameters that are most often modified in a TimescaleDB or PostgreSQL instance.
To modify a configured value, hover over the value and click the revealed pencil
icon. This reveals an editable field to apply your change. Clicking anywhere
outside of that field saves the value to be applied.

<Highlight type="note">
The values for some of the parameters vary depending on the plan. For example,
the value for `max_connections` is exactly 25 in the smallest compute tier, but
ranges from 25 to 500 in higher compute tiers.
</Highlight>

<img class="main-content__illustration"
src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-settings-change.png"
alt="Change Timescale configuration parameters"/>

### Apply configuration changes

When you have modified the configuration parameters that you would like to
change, click `Apply changes`. For some changes, such as
`timescaledb.max_background_workers`, the service needs to be restarted. In this
case, the button reads `Apply changes and restart`.

A confirmation dialog is displayed which indicates whether a restart is
required. Click `Confirm` to apply the changes, and restart if necessary.

<img class="main-content__illustration"
src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-settings-confirm.png"
alt="Confirm Timescale configuration changes"/>
