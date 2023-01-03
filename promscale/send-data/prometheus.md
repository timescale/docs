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
    max_samples_per_send: 10000
```

This section contains further explanation of each parameter.

For more information about Prometheus remote-write configuration, see the
[Prometheus documentation][prometheus-config].

### Remote timeout
Set with the `remote_timeout` field in `remote_write`.

This parameter corresponds to the timeout value of HTTP `POST` requests, which
carry the samples batch to the remote storage. If Promscale is far from where
Prometheus is deployed, or you have a high cardinality of data being ingested,
you can set this to `remote_timeout: 100s`. However, higher values for
`remote_timeout` can be considered, based on the requirements.

### Maximum samples per send
Set with the `max_samples_per_send` field in `queue_config`.

This parameter is the maximum number of samples that can fit in a single write
request to the remote storage system. Samples batch less than
`max_samples_per_send` are sent only when `batch_send_deadline` expires.
Promscale performs better with larger batches, so set the default to 
`max_samples_per_send: 10000`.

[prometheus-config]: https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_write
