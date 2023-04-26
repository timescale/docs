---
title: Read scaling
excerpt: Understand how read scaling works in Timescale
product: cloud
keywords: [replicas, scaling]
tags: [replicas, scaling, ha]
---

# Read scaling

Read replicas are read-only copies of a database that allow you to safely scale
beyond the limits of your service. You can create as many read replicas as you
need. Read replicas can power your read-intensive application, business
intelligence tool, or both. Each read replica appears as its own service. The
replica uses a unique connection string that is different from the parent and
any HA replicas.

Queries on read replicas have minimal impact on the performance of the
parent, or primary, service, making them ideal for creating isolated
instances with up-to-date production data for analysis or scaling out
reads.

<Highlight type="important">
Using a separate read replica for read-only access provides both security and
resource isolation. This means that users with read-only permissions can't access the main
database directly. If you need to restrict the access of a read-only user but do not
want to isolate the resource, you can create a read-only role in your database
instead. For more information, see the
[security](/use-timescale/latest/security/read-only-role/) section.
</Highlight>

## Analytics

Read replicas can create an isolated environment for a business analyst to run
heavy analytical queries, rather than running them on a production instance, and
risk impacting performance. The read replica can be short-lived and deleted when
the analysis is complete, or long-running to power a business intelligence (BI)
tool.

When creating a read replica for analytics, it is recommended that you also
create a new read-only user for the person using the replica. Users must
be created on the primary, they are then propagated to the read replica.
Read replicas are read-only and have their own connection string. Since
credentials are the same for both, having a read-only user creates an
additional layer of safety in case you accidentally use the
wrong connection string to connect.

Read replicas can also have a different configuration to the primary.
Analytics environments can benefit from higher CPU for heavy queries, or
lower CPU to power long-running dashboards to save on costs.

## Read replicas

Read replicas can be used to serve reads for an application. This removes load
from the primary, and allows the primary to improve ingest performance. Doing
this can be particularly useful in environments where read traffic is very spiky
and risks impacting ingest performance, or where reads should always be lower
priority than writes.

One consideration for using this approach is that read replicas use
asynchronous replication. This can cause slight lag on the parent service,
which is acceptable in certain circumstances. Allowable lag can be
reduced significantly by adjusting the `max_standby_streaming_delay`,
and `max_standby_archive_delay` parameters. That said, it is not
recommended that you use this approach where changes must be immediately
represented, such as for user credentials.

## Create a read replica

<Procedure>

### Creating a read replica

1.  [Log in to your Timescale account][cloud-login] and click the service
    you want to replicate.
1.  Navigate to the `Operations` tab, and select `Read scaling`.
1.  Click `Add read replica`. Select the configuration you want for your read
    replica and click `Add read replica`.
1.  To see the read replicas for a service, click the service name, navigate to
    the `Operations` tab, and select `Read scaling`. Read replicas are also
    shown in the `Services` section.
1.  You can see connection information for the read replica in the same way as a
    regular service.

</Procedure>

## High availability replicas

HA replicas automatically come with a read-only endpoint that can be used to
serve read queries. Queries against this endpoint can impact the performance of
the primary, unlike read replicas. Primaries hold any WAL that would impact a
query currently being executed on an HA replica, potentially causing performance
degradation. By default, the query timeout on HA replicas is low, around 30
seconds, which can help mitigate this risk. This approach is likely allowable
for simple read queries, but heavier read queries risk timing out or causing
performance degradation on the primary. For more information, see the
[high availability][ha] section.

[cloud-login]: https://console.cloud.timescale.com
[ha]: /use-timescale/:currentVersion:/ha-replicas/high-availability/
[read-only-role]:
