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

# About $SERVICE_LONGs

When you log into [$CONSOLE][cloud-login], you see the $PROJECT_SHORT overview. 

![Check $SERVICE_LONG is running](https://assets.timescale.com/docs/images/tiger-on-azure/tiger-console-services-view.png)

The project view includes the following tabs:

- `Services`: see all $SERVICE_SHORTs [created in your $PROJECT_SHORT][create-service] and their statuses.
- `Security`:  create $VPCs and IP allowlists. See [Security][security] for details.
- `Exporters`: export metrics and logs from your $SERVICE_SHORTs. See [Metrics and logging][metrics-logging] for details. 
- `Settings`: create client credentials, add AI model API keys, and request a SOC 2 report.
- `Users`: add and remove users in your $PROJECT_SHORT. See [Control user access to Tiger Cloud projects][members].
- `Billing`: check usage, change $PRICING_PLANs, and manage payment methods. 
- `Data view`: write queries with autocomplete, save them in folders, share them, and create charts/dashboards with the added power of AI. See [Run your queries from $CONSOLE][run-queries].

Click a $SERVICE_SHORT to manage and configure it. Each $SERVICE_SHORT hosts a single database managed for you by $CLOUD_LONG.
If you need more than one database, [create a new $SERVICE_SHORT][create-service].

![Select a query to edit](https://assets.timescale.com/docs/images/tiger-on-azure/ops-mode-overview-tiger-console.png)

The individual $SERVICE_SHORT view includes the following tabs:

- `Overview`: get an overview of your $SERVICE_SHORT details, infrastructure, connection info, and performance optimization tips.
- `Actions`: connect and import data into your $SERVICE_SHORT. See [Import and sync][import-sync].
- `Explorer`: inspect objects and storage configuration for your $SERVICE_SHORT. See [$SERVICE_LONG explorer][service-explorer] for details.
- `Monitoring`: get visibility into your $SERVICE_SHORT performance. See [Monitor your $SERVICE_LONGs][monitoring].
- `Connectors`: sync or stream directly, so data from another source is continuously updated in your $SERVICE_SHORT. See [Import and sync][import-sync].
- `SQL editor`: query your $SERVICE_SHORTs. See [Run your queries from $CONSOLE][run-queries].
- `Operations`: fully manage your $SERVICE_SHORT. This includes configuring compute and storage, setting up replicas, backups, upgrades, and more. 


[cloud-login]: https://console.cloud.timescale.com/
[pg-roles-doc]: https://www.postgresql.org/docs/current/role-attributes.html
[create-service]: /getting-started/:currentVersion:/services/#create-a-service
[security]: /use-timescale/:currentVersion:/security/
[metrics-logging]: /use-timescale/:currentVersion:/metrics-logging/
[members]: /use-timescale/:currentVersion:/security/members/
[run-queries]: /getting-started/:currentVersion:/run-queries-from-console/
[service-explorer]: /use-timescale/:currentVersion:/services/service-explorer/
[import-sync]: /migrate/:currentVersion:/
[monitoring]: /use-timescale/:currentVersion:/metrics-logging/monitoring/

