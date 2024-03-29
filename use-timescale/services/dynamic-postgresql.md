---
title: Dynamic PostgreSQL
excerpt: How Dynamic PostgreSQL works
products: [cloud]
keywords: [services, create, postgresql, dynamic]
cloud_ui:
    path:
        - [services]
        - [create_services]
---

# Dynamic PostgreSQL

Dynamic PostgreSQL is a managed PostgreSQL offering on Timescale that is built 
for your production workloads. Dynamic PostgreSQL is 100% PostgreSQL with no 
alterations to the core database. It comes with Timescale's dynamic compute and 
usage-based storage, giving you the scalability of a serverless database with 
the performance and cost-effectiveness of a statically allocated DBaaS.

## Dynamic compute

Dynamic compute means you choose a compute range with a 
minimum and maximum instead of a single static compute option. Your database always has the minimum compute 
allocated to it. As your load increases and your application demands more of 
your database, your database can use up to the maximum of your range with zero 
delay.

With dynamic compute, your database always has the effective memory 
corresponding to the maximum of the compute range. For example, in a 4 - 8 CPU
configuration, your database has 32 GB of effective memory. 

In this model, you only pay for your minimum compute, and are metered for any 
usage above your minimum.

<Highlight type="note">
Dynamic PostgreSQL is currently using early access pricing, 
where any metered usage above the minimum is free.
</Highlight>

## Usage-based storage

Dynamic PostgreSQL comes with Timescale's usage-based storage. With usage-based 
storage, you only pay for the storage saved on disk, rather than the amount of disk space allocated. 
Usage-based storage is billed hourly per gigabyte of data.

## Who is Dynamic PostgreSQL for?

Dynamic PostgreSQL is designed for continuous production workloads. There are 
four main types of database workloads: uniform, variable, bursty, and 
intermittent.

Uniform workloads have a constant CPU usage. Dynamic PostgreSQL serves these 
workloads efficiently if the usage is provisioned within the compute range. 
This allows you to only pay for the compute you use, rather than 
overprovisioning.

Variable and bursty workloads have some kind of seasonality or spikiness. 
Dynamic PostgreSQL is great for these workloads as it allows you to scale 
seamlessly and only pay for the usage fluctuation above your minimum.

Intermittent workloads are workloads that happen only occasionally, don't need 
in-memory caching, and can tolerate a cold start. Serverless databases are 
generally a better fit for these workloads.

## Billing

With Dynamic PostgreSQL, your bill has 2 components: 
*   Your storage costs, billed in GB/hours
*   Your compute costs, which is your base compute plus any fractional 
    CPU usage above your base, up to your max, in CPU/hours


