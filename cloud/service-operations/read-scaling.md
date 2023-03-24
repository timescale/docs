---
title: Backup and restore
excerpt: Understand how backups and restores work in Timescale Cloud
product: cloud
keywords: [backups, restore]
tags: [recovery, failures]
---

# Read scaling
Read replicas are read-only copies of a database that allow you to scale
beyond the limits of your service safely. You can create as many read
replicas as you need. Read replicas can power your read-intensive
application, BI tool, or both. Each read replica will appear as its own
service and have a unique address (connection string) that is different
from the parent and any HA replicas.

Queries on read replicas have minimal impact on the performance of the
parent (primary) service, making them ideal for creating isolated
instances with up-to-date production data for analyses or scaling out
reads.

## Analytics
Read replicas can create an isolated environment for a business analyst
to run heavy analytical queries, rather than running them on a
production instance, and risk impacting performance. The read replica
can be short-lived and deleted once the analysis is complete or
long-running to power a business intelligence (BI) tool. 

When creating a read replica for analytics, it is recommended to also
create a new read-only user for the person using the replica. Users must
be created in the primary and are then propagated to the read replica.
Read replicas are read-only and have their own connection string. Since
credentials are the same for both, having a read-only user creates an
additional layer of safety in case the wrong connection string is
accidentally used to connect.

Read replicas can also be a different configuration than the primary.
Analytics environments may benefit from higher CPU for heavy queries or
lower CPU to power long-running dashboards to save on costs.


## Read scaling
Read replicas can be used to serve reads for an application. This
removes load from the primary, allowing the primary to improve ingest
performance. Doing so may be particularly useful in environments where
read traffic is very spiky (and risks impacting ingest performance) or
where reads should always be lower priority than writes.

One consideration for using this approach is that read replicas use
asynchronous replication and thus may slightly lag the parent service,
which is acceptable in certain circumstances. Allowable lag can be
reduced significantly by adjusting the `max_standby_streaming_delay`,
and `max_standby_archive_delay` parameters. That said, it would not be
recommended to use this approach where changes must be immediately
represented, e.g., for user credentials. 

## Create a read replica

<Procedure>

### Creating a read replica

1.  [Log in to your Timescale Cloud account][cloud-login] and click
  the service you want to replicate.
1.  Navigate to the `Operations` tab, and select `Read scaling`.
1.  Click `Add read replica`. Select the configuration you want for
your read replica and click `Add read replica`.
1.  You can see the read replicas for each service by clicking on the
service name, navigating to the `Operations` tab, and selecting `Read
scaling`. Read replicas are also shown in the main `Services` section.
1.  You can see connection information for the read replica like you
would a normal service. 

</Procedure>

## HA replicas
HA replicas automatically come with a read-only endpoint that can be
used to serve read queries. Queries against this endpoint can impact the
performance of the primary, unlike read replicas. Primaries will hold
any WAL that would impact a query currently being executed on an HA
replica, potentially causing performance degradation. By default, the
query timeout on HA replicas is low (30s), which can help mitigate this
risk. This approach is likely allowable for simple read queries, but
heavier read queries risk timing out or causing performance degradation
on the primary. For more information, see the [high availability][ha]
docs.

[cloud-login]: https://console.cloud.timescale.com
[ha]: /cloud/:currentVersion:/service-operations/replicas