---
title: About services
excerpt: Manage your Tiger Cloud services in Console. Run daily admin operations, control access, set up security, compress data, run analytical queries, and more
products: [cloud]
keywords: [connect, services]
tags: [storage, resources, disk space]
cloud_ui:
    path:
        - [services, :serviceId, overview]
---

# $CONSOLE_LONG overview

When you log into [$CONSOLE][cloud-login], you see the $PROJECT_SHORT overview. 

![Check $SERVICE_LONG is running](https://assets.timescale.com/docs/images/tiger-on-azure/tiger-console-services-view.png)

The project view includes the following tabs:

- `Services`: see all $SERVICE_SHORTs created in your $PROJECT_SHORT and their statuses. See [Create a $SERVICE_LONG][create-service].
- `Security`:  create $VPCs and IP allowlists. See [Security][security].
- `Exporters`: export metrics and logs from your $SERVICE_SHORTs. See [Metrics and logging][metrics-logging]. 
- `Settings`: create client credentials, add AI model API keys, and request a SOC 2 report. See [Create client credentials][find-connection-info].
- `Users`: add and remove users in your $PROJECT_SHORT. See [Control user access to Tiger Cloud projects][members].
- `Billing`: check usage, change $PRICING_PLANs, and manage payment methods. See [Pricing plans and account management][pricing].
- `Data view`: write queries with autocomplete for any $SERVICE_SHORT, save them in folders, share them, and create charts/dashboards with the added power of AI. See [$DATA_MODE_CAP][run-queries-data-view].

To manage and configure a $SERVICE_LONG, click it. Each $SERVICE_SHORT is an optimized [$PG][postgres-link] instance extended with database engine innovations such as [$TIMESCALE_DB][timescaledb-link], managed for you by $CLOUD_LONG. If you need more than one database, [create a new $SERVICE_SHORT][create-service].

![Select a query to edit](https://assets.timescale.com/docs/images/tiger-on-azure/ops-mode-overview-tiger-console.png)

The individual $SERVICE_SHORT view includes the following tabs:

- `Overview`: get an overview of your $SERVICE_SHORT details, infrastructure, [connection info][connect-service], and [performance optimization tips][recommendations].
- `Actions`: connect and import data into your $SERVICE_SHORT. See [Import and sync][import-sync].
- `Explorer`: inspect objects and storage configuration for your $SERVICE_SHORT. See [$SERVICE_LONG explorer][service-explorer].
- `Monitoring`: get visibility into your $SERVICE_SHORT performance. See [Monitor your $SERVICE_LONGs][monitoring].
- `Connectors`: sync or stream directly, so data from another source is continuously updated in your $SERVICE_SHORT. See [Import and sync][import-sync].
- `SQL editor`: query your $SERVICE_SHORTs. See [$SQL_EDITOR][run-queries-sql-editor].
- `Operations`: fully manage your $SERVICE_SHORT: [configure compute and storage][change-resources], [set up replicas][replication], [back up][backup], [upgrade][upgrade], and more. 
- `AI`: create vector embeddings and manage AI extensions for your $SERVICE_SHORT. 


[cloud-login]: https://console.cloud.timescale.com/
[pg-roles-doc]: https://www.postgresql.org/docs/current/role-attributes.html
[create-service]: /getting-started/:currentVersion:/services/#create-a-service
[security]: /use-timescale/:currentVersion:/security/
[metrics-logging]: /use-timescale/:currentVersion:/metrics-logging/
[members]: /use-timescale/:currentVersion:/security/members/
[run-queries-data-view]: /getting-started/:currentVersion:/run-queries-from-console/#data-view
[run-queries-sql-editor]: /getting-started/:currentVersion:/run-queries-from-console/#sql-editor
[service-explorer]: /use-timescale/:currentVersion:/services/service-explorer/
[import-sync]: /migrate/:currentVersion:/
[monitoring]: /use-timescale/:currentVersion:/metrics-logging/monitoring/
[find-connection-info]: /integrations/:currentVersion:/find-connection-details/#create-client-credentials
[pricing]: /about/:currentVersion:/pricing-and-account-management/
[connect-service]: /getting-started/:currentVersion:/services/#connect-to-your-service
[recommendations]: /use-timescale/:currentVersion:/metrics-logging/monitoring/#recommendations
[change-resources]: /use-timescale/:currentVersion:/services//change-resources/
[replication]: /use-timescale/:currentVersion:/ha-replicas/
[backup]: /use-timescale/:currentVersion:/backup-restore/
[upgrade]: /use-timescale/:currentVersion:/upgrades/
[postgres-link]: /api/:currentVersion:/glossary/#postgresql
