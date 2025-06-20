$CLOUD_LONG is the modern $PG data platform for all your applications. It enhances $PG to handle time series, events, 
real-time analytics, and vector search—all in a single database alongside transactional workloads.

You get one system that handles live data ingestion, late and out-of-order updates, and low latency queries, with the performance, reliability, and scalability your app needs. Ideal for IoT, crypto, finance, SaaS, and a myriad other domains, $CLOUD_LONG allows you to build data-heavy, mission-critical apps while retaining the familiarity and reliability of $PG.

A $SERVICE_LONG is a single optimized instance of $TIGER_POSTGRES. It is ideal for applications requiring strong data
consistency, complex relationships, and advanced querying capabilities. Get ACID compliance, extensive SQL support,
JSON handling, and extensibility through custom functions, data types, and extensions. To the $PG you know and love, $TIGER_POSTGRES adds the following capabilities:

- **Real-time analytics**: store and query [time-series data][what-is-time-series] at scale for 
   real-time analytics and other use cases. Get faster time-based queries with $HYPERTABLEs, $CAGGs, and columnar storage. Save money by compressing data into the $COLUMNSTORE, moving cold data to low-cost bottomless storage in Amazon S3, and deleting old data with automated policies. 
- **AI-focused**: build AI applications from start to scale. Get fast and accurate similarity search 
   with the pgvector and pgvectorscale extensions. Create vector embeddings and perform LLM reasoning on your data with 
   the pgai extension.
- **Hybrid applications**: get a full set of tools to develop applications that combine time-based data and AI.

$CLOUD_LONG continuously monitors your $SERVICE_SHORTs and prevents common $PG out-of-memory crashes.

All $SERVICE_LONGs include the tooling you expect for production and developer environments: [live migration][live-migration], 
[automatic backups and PITR][automatic-backups], [high availability][high-availability], [$READ_REPLICAs][readreplica], [data forking][operations-forking], [connection pooling][connection-pooling], [tiered storage][data-tiering], 
[usage-based storage][how-plans-work], secure in-$CONSOLE [SQL editing][in-console-editors], $SERVICE_SHORT [metrics][metrics] 
and [insights][insights],&nbsp;[streamlined maintenance][maintain-upgrade],&nbsp;and much more.

[what-is-time-series]: https://www.timescale.com/blog/time-series-database-an-explainer#what-is-a-time-series-database
[create-service]: /getting-started/:currentVersion:/services/
[live-migration]: /migrate/:currentVersion:/live-migration/
[automatic-backups]: /use-timescale/:currentVersion:/backup-restore/
[high-availability]: /use-timescale/:currentVersion:/ha-replicas/high-availability/
[readreplica]: /use-timescale/:currentVersion:/ha-replicas/read-scaling/
[operations-forking]: /use-timescale/:currentVersion:/services/service-management/#fork-a-service
[connection-pooling]: /use-timescale/:currentVersion:/services/connection-pooling
[data-tiering]: /use-timescale/:currentVersion:/data-tiering/
[how-plans-work]: /about/:currentVersion:/pricing-and-account-management/#how-plans-work
[in-console-editors]: /getting-started/:currentVersion:/run-queries-from-console/
[metrics]: /use-timescale/:currentVersion:/metrics-logging/monitoring/#metrics
[insights]: /use-timescale/:currentVersion:/metrics-logging/monitoring/#insights
[maintain-upgrade]: /use-timescale/:currentVersion:/upgrades/

