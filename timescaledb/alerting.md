# Alerting

There are a variety of different alerting solutions you can use in conjunction with TimescaleDB that are part of the PostgreSQL ecosystem. Regardless of whether you are creating custom alerts embedded in your applications, or using third-party alerting tools to monitor event data across your organization, there are a wide selection of tools available.

## Grafana [](grafana)

Grafana is a great way to visualize and explore time-series data and has a first-class integration with TimescaleDB. Beyond data visualization, Grafana also provides alerting functionality to keep you notified of anomalies. 

Within Grafana, you can [define alert rules][define alert rules] which are time-based thresholds for your dashboard data (e.g. “Average CPU usage greater than 80 percent for 5 minutes”). When those alert rules are triggered, Grafana will send a message via the chosen notification channel. Grafana provides integration with webhooks, email and more than a dozen external services including Slack and PagerDuty.

To get started, first download and install [Grafana][Grafana-install]. Next, add a new [PostgreSQL datasource][PostgreSQL datasource] that points to your TimescaleDB instance. This data source was built by TimescaleDB engineers, and it is designed to take advantage of the database's time-series capabilities. From there, proceed to your dashboard and set up alert rules as described above. 

<!-- -->
>:WARNING: Alerting is only available in Grafana v4.0 and above. 

## Other Alerting Tools [](alerting-tools)

TimescaleDB works with a variety of alerting tools within the PostgreSQL ecosystem. Users can use these tools to set up notifications about meaningful events that signify notable changes to the system.

Some popular alerting tools that work with TimescaleDB include:

- DataDog: get started [here][datadog-install]
- Nagios: get started [here][nagios-install]
- Zabbix: get started [here][zabbix-install]


[define alert rules]: https://grafana.com/docs/alerting/rules/
[Grafana-install]: https://grafana.com/get
[PostgreSQL datasource]: https://grafana.com/docs/features/datasources/postgres/
[alert rules]: https://grafana.com/docs/alerting/rules/
[datadog-install]: https://docs.datadoghq.com/integrations/postgres/
[nagios-install]: https://www.nagios.com/solutions/postgres-monitoring/
[zabbix-install]: https://www.zabbix.com/documentation/current/manual/quickstart/notification
