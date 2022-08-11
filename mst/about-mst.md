---
title: About Managed Service for TimescaleDB
excerpt: Set up and manage your TimescaleDB services in Managed Service for TimescaleDB
product: mst
keywords: [services]
---

# About Managed Service for TimescaleDB

Managed service for TimescaleDB is a managed TimescaleDB service hosted in more
than 75 regions in AWS, Azure, or GCP. You can
[try Managed Service for TimescaleDB for free][sign-up], no credit card
required.

Powered by [TimescaleDB][timescale-features], you can create database instances
in the  cloud and automate many of your most common operational tasks. This
allows you to spend more time focusing on your time-series workloads and less
time worrying  about database management.

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

### Service configuration plans

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

## Databases

Each service can contain a one or more databases. To view existing databases, or
to create a new database, click the name of the service in the services list,
and navigate to the `Databases` tab.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/mst-databases.png" alt="Managed Service for TimescaleDB databases list"/>

## Billing

By default, all new Managed Service for TimescaleDB services require a credit
card, which is charged at the end of the month for all charges accrued over that
month. Each project is charged separately.

Managed Service for TimescaleDB uses hourly billing. This charge is
automatically calculated, based on the services you have been running in your
project. The price charged for your project includes:

*   Virtual machine
*   Networking
*   Backups
*   Setting up

<highlight type="note">
Managed Service for TiemscaleDB does not charge you for network traffic used by
your service. However, your application cloud service provider might charge you
for the network traffic going to or from your service.
</highlight>

Terminating or powering a service down stops the accumulation of new charges
immediately. However, the minimum hourly charge unit is one hour. For example,
if you launch a Managed Service for TimescaleDB service and terminate it after
40 minutes, you are charged for one full hour.

Migrating to different service plans levels does not incur extra charges. Note,
though, that some service plan levels are more costly per hour, and your new
service is charged at the new rate.

Migrating a service to another cloud region or different cloud provider does not
incur extra charges.

### Corporate billing

If you prefer to pay by invoice, or if you are unable to provide a credit card
for billing, you can switch your project to corporate billing instead. Under
this model, invoices are generated at the end of the month based on actual
usage, and are sent in PDF format by email to the billing email addresses you
configured in your dashboard.

Payment terms for corporate invoices are 10 days net, by bank transfer, to the
bank details provided on the invoice. By default, services are charged in US
Dollars (USD), but you can request your invoices be sent in either Euros (EUR)or
Pounds Sterling (GBP) at the invoice date's currency exchange rates.

To switch from credit card to corporate billing, make sure your billing profile
and email address is correct in project's billing settings, and send a message
to [our support team][timescale-support] asking to be changed to corporate
billing.

[timescale-features]: https://www.timescale.com/products/#Features
[getting-started]: /getting-started/:currentVersion:/
[mst-install]: /install/:currentVersion:/installation-mst/
[sign-up]: https://www.timescale.com/cloud-signup
[migrate-data-mst]: mst/:currentVersion:/migrate-to-mst/
[timescale-support]: https://www.timescale.com/support
