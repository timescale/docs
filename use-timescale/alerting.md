---
title: Alerting
excerpt: Setting up database alerting can help monitor performance, data integrity, resource usage, and more. Tiger Cloud and TimescaleDB integrate with a variety of alerting tools within the PostgreSQL ecosystem
products: [cloud, self_hosted]
keywords: [alert, integration, Grafana, Datadog, Nagios, Zabbix]
---

# Alerting

Early issue detecting and prevention, ensuring high availability, and performance optimization are only a few of the reasons why alerting plays a major role for modern applications, databases, and services.

There are a variety of different alerting solutions you can use in conjunction
with $COMPANY products that are part of the PostgreSQL ecosystem. Regardless of
whether you are creating custom alerts embedded in your applications, or using
third-party alerting tools to monitor event data across your organization, there
is a wide range of tools available.

## Grafana

Grafana is a great way to visualize your analytical queries, and it has a
first-class integration with $COMPANY products. Beyond data visualization, Grafana
also provides alerting functionality to keep you notified of anomalies.

Within Grafana, you can [define alert rules][define alert rules] which are
time-based thresholds for your dashboard data (for example, "Average CPU usage
greater than 80 percent for 5 minutes"). When those alert rules are triggered,
Grafana sends a message via the chosen notification channel. Grafana provides
integration with webhooks, email and more than a dozen external services
including Slack and PagerDuty. See the [Grafana integration guide][grafana-integration] for details. 

<Highlight type="warning">

Alerting is only available in Grafana v4.0 and later.

</Highlight>

## Other alerting tools

$COMPANY products work with a variety of alerting tools within the PostgreSQL ecosystem, including:

*   [DataDog][datadog-install]
*   [Nagios][nagios-install]
*   [Zabbix][zabbix-install]

See the [integration guides][integration-docs] for details. 

[Grafana-install]: https://grafana.com/get
[PostgreSQL datasource]: https://grafana.com/docs/features/datasources/postgres/
[datadog-install]: https://docs.datadoghq.com/integrations/postgres/
[define alert rules]: https://grafana.com/docs/alerting/rules/
[nagios-install]: https://www.nagios.com/solutions/postgresql-monitoring/
[zabbix-install]: https://www.zabbix.com/documentation/current/en/manual/appendix/install/timescaledb
[grafana-integration]: /integrations/:currentVersion:/grafana/
[integration-docs]: /integrations/:currentVersion:/#observability-and-alerting
