---
title: Alerting
excerpt: Setting up database alerting can help monitor performance, data integrity, resource usage, and more. Tiger Cloud integrates with a variety of alerting tools within the PostgreSQL ecosystem
products: [cloud, self_hosted]
keywords: [alert, integration, Grafana, Datadog, Nagios, Zabbix]
---

# Alerting

Early issue detecting and prevention, ensuring high availability, and performance optimization are only a few of the reasons why alerting plays a major role for modern applications, databases, and services.

There are a variety of different alerting solutions you can use in conjunction
with $CLOUD_LONG that are part of the $PG ecosystem. Regardless of
whether you are creating custom alerts embedded in your applications, or using
third-party alerting tools to monitor event data across your organization, there
are a wide selection of tools available.

## Grafana

Grafana is a great way to visualize your analytical queries, and it has a
first-class integration with $COMPANY products. Beyond data visualization, Grafana
also provides alerting functionality to keep you notified of anomalies.

Within Grafana, you can [define alert rules][define alert rules] which are
time-based thresholds for your dashboard data (for example, "Average CPU usage
greater than 80 percent for 5 minutes"). When those alert rules are triggered,
Grafana sends a message via the chosen notification channel. Grafana provides
integration with webhooks, email and more than a dozen external services
including Slack and PagerDuty.

To get started, first download and install [Grafana][Grafana-install]. Next, add
a new [$PG data source][PostgreSQL datasource] that points to your
$SERVICE_LONG. This data source was built by $COMPANY engineers, and
it is designed to take advantage of the database's time-series capabilities.
From there, proceed to your dashboard and set up alert rules as described above.

<Highlight type="warning">

Alerting is only available in Grafana v4.0 and later.

</Highlight>

## Other alerting tools

$CLOUD_LONG works with a variety of alerting tools within the $PG
ecosystem. Users can use these tools to set up notifications about meaningful
events that signify notable changes to the system.

Some popular alerting tools that work with $CLOUD_LONG include:

*   [DataDog][datadog-install]
*   [Nagios][nagios-install]
*   [Zabbix][zabbix-install]

See the [integration guides][integration-docs] for details.

[Grafana-install]: https://grafana.com/get/
[PostgreSQL datasource]: https://grafana.com/docs/grafana/latest/features/datasources/postgres/
[datadog-install]: https://docs.datadoghq.com/integrations/postgres/
[define alert rules]: https://grafana.com/docs/grafana/latest/alerting/rules/
[nagios-install]: https://www.nagios.com/solutions/postgresql-monitoring/
[zabbix-install]: https://www.zabbix.com/documentation/current/en/manual/appendix/install/timescaledb
[grafana-integration]: /integrations/:currentVersion:/grafana/
[integration-docs]: /integrations/:currentVersion:/#observability-and-alerting
