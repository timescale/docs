# Promscale multi-tenancy for Prometheus
Promscale supports multi-tenancy for Prometheus. It uses different Prometheus
servers that correspond to different tenants, which all write data to the same
set of Promscale servers. Each Prometheus server indicates to the tenant that it
is writing by using custom headers or external labels.

When Promscale executes a PromQL query it can return data for all tenants, or
restrict its answers to a particular tenant or set of tenants. This allows a
tenant to be given access to a particular Promscale PromQL endpoint for querying
its own data, while ensuring that it cannot access other tenant's data.

Multi-tenancy features:
*   Configure multi-tenancy using headers or external labels
*   Cross-tenant queries in PromQL and SQL
*   Allow data with no tenant information to be written or queried when
    multi-tenant mode is enabled
*   Restrict the set of valid tenants that a Promscale instance can ingest or
    query
*   Authorize tenants using `bearer_tokens`

## Configure Promscale for multi-tenancy
By default, Promscale ingests data without using multi-tenancy. To enable it,
start Promscale with the `-multi-tenancy` flag. This allows Promscale to ingest
data from all tenants. To restrict the list of tenants for Promscale ingestion and querying,
list the tenant names with
`-multi-tenancy-valid-tenants=<tenant_names_seperated_by_commas>`.

By default, when multi-tenancy is enabled, data is rejected if it does not include a tenant name. To accept data without tenant information,
set the `-multi-tenancy-allow-non-tenants` flag.

<highlight type="note">
When you set a CLI flag on a Promscale instance, remember to set it on all of
your other Promscale instances as well, if you need them to have the same
functionality.
</highlight>

This example ingests data from `tenant-A` and `tenant-B` Prometheus instances.
It also allows data to be ingested from non-tenant instances of Prometheus:
```bash
-multi-tenancy \
-multi-tenancy-valid-tenants=tenant-A,tenant-B \
-multi-tenancy-allow-non-tenants
```

To ingest all incoming tenant data regardless of tenant validation from
Prometheus instances, along with non-tenant Prometheus instances:
```bash
-multi-tenancy -multi-tenancy-allow-non-tenants
```

<highlight type="note">
The `-multi-tenancy-valid-tenants` flag defaults to `allow-all`.
</highlight>

## Configure Prometheus for writing multi-tenant data
Promscale accepts tenant information from `headers` or `external_labels`. It
keeps the tenant name as a `__tenant__: <tenant_name>` label pair, which it attaches to
the series ingested in the write request.

### Headers
You can supply the tenant name in a header by using it as the value of the `TENANT` key.
For example:
```bash
TENANT: tenant-A
```

Alternatively, you can specify the header in the Prometheus remote-write
configuration file, like this:
```yaml
remote_write:
  - url: http://localhost:9201/write
    headers:
      TENANT: A
```

### External labels
Promscale reserves `__tenant__` as a label key for storing the tenant name of
incoming series. You can push data directly with this label like this:
```yaml
global:
  external_labels:
    __tenant__: A
```

## Query multi-tenant data
Data from tenants is kept with a `__tenant__` label key, so you can use this key
to query tenant data. Only tenants that are authorized under the
`-multi-tenancy-valid-tenants` flag can be queried. Additionally, data without a
tenant label can be queried only if you apply
`-multi-tenancy-allow-non-tenants`.

If your query needs to be evaluated across multiple tenants, you can use
`metric_name{__tenant__=~"tenant-A|tenant-B"}`.

In this example, Promscale contains data from `tenant-A`, `tenant-B` and
`tenant-C`. If Promscale is configured with
`-multi-tenancy-valid-tenants=tenant-A,tenant-B` you can perform these
PromQL queries:
*   `metric_name{__tenant__=tenant-A}` returns `metric_name` from `tenant-A` only.
*   `metric_name{__tenant__=tenant-C}` returns no data.
*   `metric_name{__tenant__=~tenant-A|tenant-B}` returns `metric_name` from
    `tenant-A` and `tenant-B`.
*   `metric_name{__tenant__=~tenant-A|tenant-C}` returns `metric_name` from
    `tenant-A` but not from `tenant-C`. This is because the Promscale instance
    is configured to return data from only `tenant-A` and `tenant-B`.
*   `metric_name` returns `metric_name` from only `tenant-A` and `tenant-B`.

If the same database also contains samples without any tenant label, and
`-multi-tenancy-allow-non-tenants` is applied, you can perform these PromQL
queries:
*   `metric_name{__tenant__=tenant-A}` returns `metric_name` from `tenant-A`.
*   `metric_name{__tenant__=tenant-A|}` returns `metric_name` from non-tenants
    and `tenant-A`.
*   `metric_name` returns `metric_name` from non-tenants, `tenant-A` and
    `tenant-B`.
*   `metric_name{__tenant__=""}` returns `metric_name` from non-tenants only.

<highlight type="note">
If you are querying multiple Promscale instances, you can configure individual
instances to selectively authorize any valid tenant for queries, based on your
requirements.
</highlight>

## Limitations

Currently, the `labels` API (/api/v1/labels) returns data for all labels across
all tenants even if you have configured `-multi-tenancy-valid-tenants`. Thus,
when writing PromQL queries in Grafana, matching label names and values across
all tenants are returned by the autocomplete feature. However, other data such
as series and samples are returned only if they belong to the configured
tenants.

[This Github issue][labels-issue] tracks resolution for this problem and is
currently in our backlog. Leave a comment in the issue if you are interested in
this improvement.
