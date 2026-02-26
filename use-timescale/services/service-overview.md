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

You use $CONSOLE_LONG to manage your $SERVICE_SHORTs and data in a convenient, centralized manner. When you [log into $CONSOLE][cloud-login], you see `Services` and other $PROJECT_SHORT management tabs: 

![Check $SERVICE_LONG is running][check-service-is-running]

- `Services`: create a new [$SERVICE_SHORT][create-service] in your $PROJECT_SHORT, and view the existing $SERVICE_SHORTs and their statuses. Each $SERVICE_SHORT is an optimized [$PG][postgres-link] instance extended with database engine innovations such as [$TIMESCALE_DB][timescaledb-link], managed for you by $CLOUD_LONG.
- `Security`:  create [$VPCs][vpc] and [IP allowlists][ip-allowlist]. 
- `Exporters`: [export metrics and logs][metrics-logging] from your $SERVICE_SHORTs. 
- `Activity`: [check your $SERVICE_SHORTs][activity-log] and $PROJECT_SHORT activity. 
- `Settings`: [create client credentials][find-connection-info], add AI model API keys, and request a SOC 2 report. 
- `Users`: [add and remove users][members] in your $PROJECT_SHORT. 
- `Billing`: [check usage][check-usage], [change $PRICING_PLANs][pricing], and manage payment methods.

When you select a $SERVICE_LONG in the `Services` tab, you land in the $OPS_MODE. In this view, you manage your $SERVICE_SHORTs. You see `Overview` and other related tabs:

![Select a service to edit][select-service-to-edit]

- `Overview`: get an overview of your $SERVICE_SHORT details, infrastructure, [connection info][connect-service], and [performance optimization tips][recommendations].
- `Actions`: [connect and import data][import-sync] into your $SERVICE_SHORT.
- `Explorer`: [inspect objects and storage configuration][service-explorer] for your $SERVICE_SHORT. 
- `Monitoring`: [get visibility][monitoring] into your $SERVICE_SHORT performance.
- `Connectors`: [sync or stream][import-sync] directly in your $SERVICE_SHORT, so data from another source is continuously updated.
- `Operations`: fully manage your $SERVICE_SHORT: [configure compute and storage][change-resources], [set up replicas][replication], [back up][backup], [upgrade][upgrade], and more. 
- `AI`: create vector embeddings and [manage AI extensions][manage-extensions] for your $SERVICE_SHORT. 

Use the toggle at the top to switch to $DATA_MODE. In this view, you can [write queries with autocomplete][run-queries-data-view] for any $SERVICE_SHORT, save them in folders, share them, and create charts/dashboards with the added power of AI.

To query your $SERVICE_SHORT from any tab, click `SQL Editor` at the bottom. The floating window expands and is ready for work. Click the window icon in its top right to change the editor position on the screen. 

[cloud-login]: https://console.cloud.timescale.com/
[pg-roles-doc]: https://www.postgresql.org/docs/current/role-attributes.html
[create-service]: /getting-started/:currentVersion:/services
[metrics-logging]: /use-timescale/:currentVersion:/metrics-logging/
[members]: /use-timescale/:currentVersion:/security/members/
[run-queries-data-view]: /getting-started/:currentVersion:/run-queries-from-console/#data-view
[run-queries-sql-editor]: /getting-started/:currentVersion:/run-queries-from-console/#sql-editor
[service-explorer]: /use-timescale/:currentVersion:/services/service-explorer/
[import-sync]: /migrate/:currentVersion:/
[monitoring]: /use-timescale/:currentVersion:/metrics-logging/monitoring/
[find-connection-info]: /integrations/:currentVersion:/find-connection-details/#create-client-credentials
[pricing]: /about/:currentVersion:/pricing-and-account-management/#upgrade-or-downgrade-your-pricing-plans-at-any-time
[check-service-is-running]: https://assets.timescale.com/docs/images/tiger-on-azure/tiger-console-services-view.png
[check-usage]: /about/:currentVersion:/pricing-and-account-management/#monitor-usage-and-costs
[connect-service]: /getting-started/:currentVersion:/services/#connect-to-your-service
[recommendations]: /use-timescale/:currentVersion:/metrics-logging/monitoring/#recommendations
[change-resources]: /use-timescale/:currentVersion:/services//change-resources/
[replication]: /use-timescale/:currentVersion:/ha-replicas/
[backup]: /use-timescale/:currentVersion:/backup-restore/
[upgrade]: /use-timescale/:currentVersion:/upgrades/
[postgres-link]: /api/:currentVersion:/glossary/#postgresql
[select-service-to-edit]: https://assets.timescale.com/docs/images/tiger-on-azure/ops-mode-overview-tiger-console.png
[timescaledb-link]: /api/:currentVersion:/glossary/#timescaledb
[vpc]: /use-timescale/:currentVersion:/security/vpc/
[ip-allowlist]: /use-timescale/:currentVersion:/security/ip-allow-list/
[manage-extensions]: /use-timescale/:currentVersion:/extensions/
[activity-log]: /about/:currentVersion:/changelog#activity-log
