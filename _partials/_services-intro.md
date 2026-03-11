import FreeBeta from "versionContent/_partials/_free-plan-beta.mdx";

A $SERVICE_LONG is a single optimized $PG instance extended with innovations in the database engine and cloud
infrastructure to deliver speed without sacrifice. A $SERVICE_LONG is 10-1000x faster at scale! It
is ideal for applications requiring strong data consistency, complex relationships, and advanced querying capabilities.
Get ACID compliance, extensive SQL support, JSON handling, and extensibility through custom functions, data types, and
extensions.

Each $SERVICE_SHORT is associated with a project in $CLOUD_LONG. Each project can have multiple $SERVICE_SHORTs. Each user is a [member of one or more projects][projects].

You create free and standard $SERVICE_SHORTs in $CONSOLE_LONG. A standard $SERVICE_SHORT comes with the full range of features according to your $PRICING_PLAN. A free $SERVICE_SHORT comes at zero cost and gives you limited features and resources. 

![$CLOUD_LONG pricing plans][cloud_long-pricing-plans]

To the $PG you know and love, $CLOUD_LONG adds the following capabilities:

- **Standard $SERVICE_SHORTs**:

    - _Real-time analytics_: store and query [time-series data][what-is-time-series] at scale for
      real-time analytics and other use cases. Get faster time-based queries with $HYPERTABLEs, $CAGGs, and columnar storage. Save money by compressing data into the $COLUMNSTORE, moving cold data to low-cost bottomless storage in Amazon S3 or Azure Blob storage, and deleting old data with automated policies.
    - _AI-focused_: build AI applications from start to scale. Get fast and accurate similarity search
      with the pgvector and pgvectorscale extensions.
    - _Hybrid applications_: get a full set of tools to develop applications that combine time-based data and AI.

  All standard $SERVICE_LONGs include the tooling you expect for production and developer environments: [live migration][migrate-live],
  [automatic backups and PITR][automatic-backups], [high availability][high-availability], [$READ_REPLICAs][readreplica], [data forking][operations-forking], [connection pooling][connection-pooling], [tiered storage][data-tiering],
  [usage-based storage][how-plans-work], secure in-$CONSOLE [SQL editing][in-console-editors], $SERVICE_SHORT [metrics][metrics]
  and [insights][insights],&nbsp;[streamlined maintenance][maintain-upgrade],&nbsp;and much more. $CLOUD_LONG continuously monitors your $SERVICE_SHORTs and prevents common $PG out-of-memory crashes.

- **Free $SERVICE_SHORTs**:

  _$PG with $TIMESCALE_DB and vector extensions_

  Free $SERVICE_SHORTs come with pre-configured CPU and memory, are hosted in `us-east-1` region, and offer limited resources with a basic feature scope. This excludes connection pooling, replication, data tiering, exporters, metrics, VPC, and other features. Free $SERVICE_SHORTs are perfect for schema explorations, syntax validations, and other small-scale testing. Once you reach the resource limit, a free $SERVICE_SHORT enters a read-only state. You can [convert your free $SERVICE_SHORT][convert-to-free] to a standard one at any time.

   <FreeBeta />

You can [manage, pause, or delete][service-management] your $SERVICE_SHORT at any time from $CONSOLE.

[automatic-backups]: /use-timescale/:currentVersion:/backup-restore/
[cloud_long-pricing-plans]: https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-pricing.svg
[connection-pooling]: /use-timescale/:currentVersion:/services/connection-pooling
[convert-to-free]: /use-timescale/:currentVersion:/services/service-management/#convert-a-free-service-to-a-standard-one
[data-tiering]: /use-timescale/:currentVersion:/data-tiering/
[high-availability]: /use-timescale/:currentVersion:/ha-replicas/high-availability/
[how-plans-work]: /about/:currentVersion:/pricing-and-account-management/#how-your-bill-is-calculated
[in-console-editors]: /getting-started/:currentVersion:/run-queries-from-console/
[insights]: /use-timescale/:currentVersion:/metrics-logging/monitoring/#insights
[maintain-upgrade]: /use-timescale/:currentVersion:/upgrades/
[metrics]: /use-timescale/:currentVersion:/metrics-logging/monitoring/#metrics
[migrate-live]: /migrate/:currentVersion:/live-migration/
[operations-forking]: /use-timescale/:currentVersion:/services/service-management/#fork-a-service
[pricing-plans]: /about/:currentVersion:/pricing-and-account-management/
[projects]: /use-timescale/:currentVersion:/security/members/
[readreplica]: /use-timescale/:currentVersion:/ha-replicas/read-scaling/
[service-management]: /use-timescale/:currentVersion:/services/
[what-is-time-series]: https://www.tigerdata.com/blog/time-series-database-an-explainer#what-is-a-time-series-database
