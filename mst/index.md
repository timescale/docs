---
title: Managed Service for TimescaleDB
excerpt: A fully managed TimescaleDB service on AWS, Azure, or GCP, available in more than 75 regions
product: mst
---

# Managed Service for TimescaleDB
Managed Service for TimescaleDB provides a fully managed TimescaleDB service
hosted in more than 75 regions using AWS, Azure, or GCP. You can use this
service to create database instances, or services, in the cloud and automate
most of your most common operational tasks. This allows you to spend more time
focusing on your time-series workloads and less time worrying about database
management.

*   Find out [about services][create-a-service]
*   Create a [multi-node cluster][mst-multi-node]
*   View [service logs][viewing-service-logs]
*   Use [VPC peering][vpc-peering]
*   Understand [security for Timescale MST][security]
*   Manage [backup and restore][manage-backups]

Some important terms:
*   **Account:** Your Managed Service for TimescaleDB account. You can register
    for an account on the
    [Managed Service for TimescaleDB signup][sign-up] page.
*   **Project:** An empty project is created for you automatically when you sign up.
    Projects help you organize your services and billing settings. You can also
    use projects to manage user access to your services.
*   **Service:** A service is an instance that corresponds to a cloud service
    provider tier. You can access all your services from the `Services` tab
    within your projects.
*   **Database:** Databases are created within a service. You can view and create a
    database within a service by selecting one of your services, and then
    navigating to the `Databases` tab.
*   **Service plans:** A service plan defines the configuration and level of
    database management that is performed for a given TimescaleDB deployment.

## Hosted TimescaleDB
Built and operated by the TimescaleDB team, Managed Service for TimescaleDB
provides a flexible relational time-series database:
*   Select between more than 75 regions across AWS, GCP, or Azure
*   Choose from more than 2000 possible configurations, from 1&nbsp;CPUs and
    20&nbsp;GB disk to 72&nbsp;CPUs and 10&nbsp;TB disk.
*   Upgrade configuration or migrate between clouds with a single click, and
    near-zero downtime.
*   Operate worry-free with continuous backups and point-in-time recovery,
    highly-available pairs and auto-failover.

## Accelerated performance
Ingest high velocity data and perform fast SQL analysis across massive,
high-cardinality datasets.
*   Write millions of data points per second.
*   10 to 100 times faster queries than PostgreSQL, InfluxDB, and MongoDB.
*   Advanced columnar compression for 94 - 97% compression savings.
*   Built-in query optimizations and parallelization.

## Postgres for time-series
Purpose-built time-series analytical functions that build on PostgreSQL.
*   Advanced time-series functions, including downsampling and interpolation.
*   Real-time continuous aggregations for fast, up-to-date answers.
*   Unlimited metadata, JOIN relational and time-series data.
*   Data retention policies for both raw and aggregate data.

## Works with everything you know and use
Build data-driven apps, services, and systems faster using the programming
languages and tools you already know, proven PostgreSQL ecosystem, and pre-built
integrations and extensions.
*   Full SQL, no restrictions
*   Entire toolset available, including PostgreSQL extensions, ORMs, connectors,
    JDBC, and applications.
*   Connect applications securely with VPC Peering and IP whitelisting.
*   SOC2, HIPAA, ISO27001, CCPA, and GDPR compliance.

For more information on Managed Service for TimescaleDB's terms of service, visit the [Timescale website][tos].

[create-a-service]: /mst/:currentVersion:/create-a-service
[mst-multi-node]: /mst/:currentVersion:/mst-multi-node
[security]: /mst/:currentVersion:/security
[sign-up]: https://www.timescale.com/mst-signup
[tos]: https://www.timescale.com/legal/mst-terms-of-service
[viewing-service-logs]: /mst/:currentVersion:/viewing-service-logs
[vpc-peering]: /mst/:currentVersion:/vpc-peering
[manage-backups]: /mst/:currentVersion:/manage-backups
