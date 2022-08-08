---
title: Send Prometheus metrics to Promscale
excerpt: Send Prometheus metrics to Promscale
product: promscale
keywords: [Prometheus]
tags: [configure, metrics]
related_pages:
  - /promscale/:currentVersion:/installation/
---

# Send Prometheus metrics to Promscale
Promscale can be used as a remote storage for Prometheus and has native 
support for the Prometheus remote write and read protocols as well as full 
PromQL support.

## Configure Prometheus to read and write data from Promscale
You can configure Prometheus to use Promscale as a remote storage. Open the Prometheus configuration file and add or edit these lines:
```yaml
remote_write:
  - url: "http://<connector-address>:9201/write"
remote_read:
  - url: "http://<connector-address>:9201/read"
    read_recent: true
```

<highlight type="important">
We highly recommend that you set Prometheus to query data from Promscale for all
PromQL queries. To do this, set the `read_recent` parameter to `true`.
</highlight>


## Configure Prometheus for better performance with Promscale
This section contains information about configuring the Prometheus remote-write
settings to maximize performance from Promscale.

Remote-write performance is dependent on `queue_config`. Changing values in `queue_config` allows you to change the remote-write component for different scenarios. For most cases, these settings work well:
```yaml
remote_write:
  remote_timeout: 100s
  queue_config:
    capacity: 100000
    max_samples_per_send: 10000
    batch_send_deadline: 30s
    min_shards: 20
    max_shards: 20
    min_backoff: 100ms
    max_backoff: 10s
```

This section contains further explanation of each parameter.

For more information about Prometheus remote-write configuration, see the
[Prometheus documentation][prometheus-config].

### Remote timeout
Set with the `remote_timeout:` field in `remote_write`.

This parameter corresponds to the timeout value of HTTP `POST` requests, which
carry the samples batch to the remote storage. If Promscale is far from where
Prometheus is deployed, or you have a high cardinality of data being ingested,
you can set this to `remote_timeout: 100s`. However, higher values for
`remote_timeout` can be considered, based on the requirements.

### Capacity
Set with the `capacity:` field in `queue_config`.

This parameter sets the maximum number of samples that each queue in a
remote-write shard can hold. If you have higher throughput, set the capacity of
queues to at least `capacity: 100000`. Based on Prometheus recommendations this 
should be around 10 times `max_samples_per_send`.

### Maximum samples per send
Set with the `max_samples_per_send:` field in `queue_config`.

This parameter is the maximum number of samples that can fit in a single write
request to the remote storage system. Samples batch less than
`max_samples_per_send:` are sent only when `batch_send_deadline:` expires.
Promscale performs better with larger batches, so set the default to 
`max_samples_per_send: 10000`.

### Batch send deadline
Set with the `batch_send_deadline:` field in `queue_config`.

This parameter is the maximum time allowed for a samples batch to be in the
queue of Prometheus's shards. When this deadline expires, the samples batch is
sent to the remote storage, even if the `max_samples_per_send` is yet to be
full. You should set this value higher if you have a higher cardinality.
Ideally, it should be set to `batch_send_deadline: 30s`.

### Number of shards
Set with the `min_shards:` and `max_shards` fields in `queue_config`.

This parameter is the minimum and maximum number of shards that can be used
concurrently. Shards are the elements of remote-write component that push data
to remote storage. Multiple shards send data concurrently. The number of
concurrent shards sets the amount of parallel requests sent to the remote-write
endpoint. Promscale is optimized for concurrent inserts, so it will perform
better with more shards. Ideally, set `min_shards: 20` & `max_shards: 20`.
Shards start at the specified minimum, and increase their count to the specified
maximum if the write-endpoint is unable to keep up with the rate of samples
scraped by the Prometheus instance. However, increasing shards by large values
can affect memory usage.

### Maximum retry delay
Set with the `min_backoff` & `max_backoff` fields in `queue_config`.

This parameter is the minimum and maximum number of retries available for failed
write requests. The remote-write component implements backoff duration on
requests to the write-endpoint if they fail with a recoverable error. This means
that the write request is retried again after a pause of a set number of
seconds. This can be particularly useful if the remote-storage is subject to
rate limiting. You can set this to `min_backoff: 1s` and `max_backoff: 10s`.
However, you can set higher values for `*_backoffs:` based on the requirements.

[prometheus-config]: https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_write
