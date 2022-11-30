---
title: Promscale
excerpt: Promscale is the open source observability backend for metrics and traces powered by SQL, built on top of TimescaleDB
product: promscale
---

# Promscale
Promscale is a unified metric and trace observability backend for Prometheus,
Jaeger, and OpenTelemetry. It is built on PostgreSQL and TimescaleDB.

Promscale serves as a robust and 100% PromQL-compliant Prometheus remote
storage. Promscale is a certified Jaeger storage backend that is durable and scalable.

Unlike other observability backends, it has a simple and easy-to-manage
architecture with just two components: the Promscale Connector and the
Promscale database. The Promscale database consists of PostgreSQL with the 
TimescaleDB and Promscale extensions.

<highlight type="cloud" header="Promscale with Timescale Cloud" button="Get started for free"
to="https://console.cloud.timescale.com/signup?campaign=promscale&source=ps-docs-home">
The best way to use Promscale is with Timescale Cloud, a fully hosted and managed
database platform. Enjoy all the best features of Promscale without the
hassle of managing your database. Timescale Cloud provides automatic 
backups and failover, high
availability, flexible scaling, security and data compliance, VPC peering, and
much more. Get cost savings of up to 94% compared to managed Prometheus offerings from
AWS, GCP and Grafana.
</highlight>

For more information about using Promscale with Timescale Cloud, see the 
[Promscale installation guide][ptc-install] for details.

*   [Quick start Promscale][quick-start] to get started with Promscale in no time.
*   [Learn about Promscale][about-promscale] to understand how it works before
    you begin using it.
*   [Learn about Promscale benefits][promscale-benefits] to understand how it
    can be useful in your environment.
*   [Install Promscale][install-promscale] from source, or using Docker and Kubernetes.
*   [Learn about tobs][about-tobs] to understand how to install a complete
    observability stack on Kubernetes.
*   Configure Promscale for [scaling and high availability][scaling-ha].
*   [Send metrics and traces][send-data] to Promscale    
*   Use Promscale to [run queries][query-data].
*   Use Promscale with [visualization tools][visualize-data].

For more about Promscale, see our [developer documentation][promscale-gh-docs].

[ptc-install]: /promscale/:currentVersion:/installation/promscale-with-timescale-cloud/
[about-promscale]: /promscale/:currentVersion:/about-promscale
[about-tobs]: /promscale/:currentVersion:/tobs/
[install-promscale]: /promscale/:currentVersion:/installation
[promscale-benefits]: /promscale/:currentVersion:/promscale-benefits/
[promscale-gh-docs]: https://github.com/timescale/promscale/
[query-data]: /promscale/:currentVersion:/query-data/
[quick-start]: /promscale/:currentVersion:/quick-start/
[scaling-ha]: /promscale/:currentVersion:/scale-ha/
[send-data]: /promscale/:currentVersion:/send-data/
[visualize-data]: /promscale/:currentVersion:/visualize-data/
