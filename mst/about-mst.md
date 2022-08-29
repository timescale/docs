---
title: About Managed Service for TimescaleDB
excerpt: Set up and manage your TimescaleDB services in Managed Service for TimescaleDB
product: mst
keywords: [services]
---

# About Managed Service for TimescaleDB

Managed service for TimescaleDB is a managed TimescaleDB service hosted in more
than 75 regions in Amazon Web Services, Microsoft Azure, or Google Cloud. You
can [try Managed Service for TimescaleDB for free][sign-up], no credit card
required.

Powered by [TimescaleDB][timescale-features], you can create database instances
in the  cloud and automate many of your most common operational tasks. This
allows you to spend more time focusing on your time-series workloads and less
time worrying about database management.

Your Managed Service for TimescaleDB account has three main components:
projects, services, and databases.

Before you begin, make sure you have
[signed up to Managed Service for TimescaleDB][sign-up] and created your account.

## Projects

When you sign up for Managed Service for TimescaleDB, an empty project is
created for you automatically. Projects are the highest organization level, and
they contain all your services and databases. You can use projects to organize
groups of services. Each project can also have its own billing settings.

To create a new project, click the project name in the navigation menu, and
click `Create a new project`.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/mst-empty-project.png" alt="Managed Service for TimescaleDB new empty project"/>

## Services

Each project contains one or more services. You can have multiple services under
each project, and each service corresponds to a cloud service provider tier. You
can access all your services from the `Services` tab within your projects.

For more information about getting your first service up and running, see the
[Managed Service for Timescale installation section][mst-install].

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/mst-services.png" alt="Managed Service for TimescaleDB services list"/>

<highlight type="important">
When you have created, and named, a new Managed Service for TimescaleDB service,
you cannot rename it. If you need to have your service running under a different
name, you need to create a new service, and manually migrate the data. For more
information about migrating data, see
[migrating your data](https://docs.timescale.com/mst/latest/migrate-to-mst/).
</highlight>

For information about billing on Managed Service for TimescaleDB, see the
[billing section][mst-billing].

## Databases

Each service can contain one or more databases. To view existing databases, or
to create a new database, click the name of the service in the services list,
and navigate to the `Databases` tab.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/mst-databases.png" alt="Managed Service for TimescaleDB databases list"/>

## Service level agreement

Managed Service for TimescaleDB is provided through a partnership with Aiven.
This provides you with a service commitment to deliver 99.99% availability. For
more information, see the
[Aiven Service Level Agreement policy][aiven-sla].

## Service configuration plans

When you create a new service, you need to select a configuration plan. The plan
determines the number of VMs the service runs in, the high availability
configuration, the number of CPU cores, and size of RAM and storage volumes.

The plans are:

*   Basic Plans: include 2 days of backups and automatic backup and restore if
    your instance fails.
*   Dev Plans: include 1 day of backups and automatic backup and restore if your
    instance fails.
*   Pro Plans: include 3 days of backups and automatic failover to a hot standby
    if your instance fails.

The Basic and Dev plans are serviced by a single virtual machine (VM) node. This
means that if the node fails, the service is unavailable until a new VM is
built. This can result in data loss, if some of the latest changes to the data
weren't backed up before the failure. Sometimes, it can also take a long time to
return the service back to normal operation, because a new VM needs to be
created and restored from backups before the service can resume. The time to
recover depends on the amount of data you have to restore.

The Pro plans are much more resilient to failures. A single node failure causes
no data loss, and the possible downtime is minimal. If an acting TimescaleDB
master node fails, an up-to-date replica node is automatically promoted to
become the new master. This means there is only a small outage while
applications reconnect to the database and access the new master.

You can upgrade your plan while the service is running. The service is
reconfigured to run on larger VMs in the background and when the reconfiguration
is complete, the DNS names are pointed to the new hosts. This can cause a short
disruption to your service while DNS changes are propagated.

Within each configuration plan option, there are several plan types available:

*   `IO-Optimized` and `Compute-Optimized` These configurations are optimized
    for input/output (I/O) performance, using SSD storage media.
*   `Storage-Optimized`: These configurations usually have larger amounts of
    overall storage, using HDD storage media.
*   `Dev-Only`: These configurations are typically smaller footprints, and lower
    cost, designed for development and testing scenarios.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/mst-service-plans.png" alt="Managed Service for TimescaleDB selecting a service configuration plan"/>

## Connection limits

Managed Service for TimescaleDB limits the maximum number of connections to each
service. The maximum number of allowed connections depends on your service plan.
To see the current connection limit for your service, navigate to the service
`Overview` tab and locate the `Connection Limit` section.

If you have a lot of clients or client threads connecting to your database, use
connection pooling to limit the number of connections. For more information
about connection pooling, see the
[connection pooling section][connection-pooling].

<highlight type="note">
If you have a high number of connections to your database, your service might
run more slowly, and could run out of memory. Remain aware of how many open
connections your have to your database at any given time.
</highlight>

If you require a higher maximum number of connections, but cannot use connection
pooling, contact the
[Timescale support team][timescale-support].

## Service termination protection

You can protect your services from accidentally being terminated, by enabling
service termination protection. When termination protection is enabled, you
cannot power down the service from the web console, the REST API, or with a
command-line client. To power down a protected service, you need to turn off
termination protection first. Termination protection does not interrupt service
migrations or upgrades.

To enable service termination protection, navigate to the service `Overview`
tab. Locate the `Termination protection` section, and toggle to enable
protection.

<highlight type="important">
If you run out of free sign-up credit, and have not entered a valid credit card
for payment, your service is powered down, even if you have enabled termination
protection.
</highlight>

## Idle connections

Managed Service for TimescaleDB uses the default keep alive settings for TCP
connections. The default settings are:

*   `tcp_keepalives_idle`: 7200
*   `tcp_keepalive_count`: 9
*   `tcp_keepalives_interval`: 75

If you have long idle database connection sessions, you might need to adjust
these settings to ensure that your TCP connection remains stable. If you
experience a broken TCP connection, when you reconnect make sure that your
client resolves the DNS address correctly, as the underlying address changes
during automatic failover.

For more information about adjusting keep alive settings, see the
[PostgreSQL documentation][pg-keepalive].

## Long running queries

Managed Service for TimescaleDB does not cancel database queries. If you
have created a query that is taking a very long time, or that has hung, it could
lock resources on your service, and could prevent database administration tasks
from being performed.

You can find out if you have any long-running queries by navigating to the
service `Current Queries` tab. You can also cancel long running queries from
this tab.

Alternatively, you can use your connection client to view running queries with
this command:

```sql
SELECT * FROM pg_stat_activity
    WHERE state <> 'idle';
```

Cancel long-running queries using this command, with the PID of the query you
want to cancel:

```sql
SELECT pg_terminate_backend(<PID>);
```

If you want to automatically cancel any query that runs over a specified length
of time, you can use this command:

```sql
SET statement_timeout = <milliseconds>
```

[timescale-features]: https://www.timescale.com/products/#features
[mst-install]: /install/:currentVersion:/installation-mst/
[sign-up]: https://www.timescale.com/cloud-signup
[timescale-support]: https://www.timescale.com/support
[aiven-sla]: https://aiven.io/sla
[pg-keepalive]: http://www.postgresql.org/docs/9.5/static/libpq-connect.html#LIBPQ-KEEPALIVES
[connection-pooling]: /mst/:currentVersion:/connection-pools/
[mst-billing]: mst/:currentVersion:/billing
