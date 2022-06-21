# Resource recommendations
This section describes the compute and disk requirements that are 
recommended for Promscale, based on the ingest rate and retention.

**Disk size per day**: disk consumption per day based on the ingest rate.

**Uncompressed buffer**: disk consumed by uncompressed data before compression.

**Total disk size**: size of disk required to store the data based on the ingest rate and retention. 

<highlight type="note">
You can calculate the `total disk size` based on retention and ingest rates with this formula:

Total disk size = (Disk size per day based on the ingest rate * Retention in days) + 
Uncompressed buffer based on the ingest rate.
</highlight>

## Metrics
Resource recommendation for ingestion using Prometheus `remote-write`. 

### Prometheus remote write
For optimal performance of `remote_write` to Promscale, use this Prometheus
`remote_write` configuration:

```yaml
remote_write:
  remote_timeout: 100s
  queue_config:
    capapcity: 100000
    max_samples_per_second: 10000
    batch_send_deadline: 30s
    min_shards: 20
    max_shards: 20
    min_backoff: 100ms
    max_backoff: 10s
```

Compute recommendations for the Promscale connector and TimescaleDB are:

|Ingestion Rate|Connector CPU|Connector Memory|DB CPU|DB Memory|DB connections|
|-|-|-|-|-|-|
|10k samples/sec|0.5|250 MB|1|4 GB|1|
|50k samples/sec|2|700 MB|4|16 GB|2|
|100k samples/sec|4|2 GB|8|32 GB|4|
|200k samples/sec|8|4.5 GB|16|64 GB|8|

Disk recommendations for TimescaleDB are:

The default chunk interval is `8h`

|Ingest rate|Retention|Disk size per day|Uncompressed buffer|Total disk size|WAL size| 
|-|-|-|-|-|-|
|10k samples/sec|90 days|~2 GB|~21 GB|~200 GB|1.25 GB|
|50k samples/sec|90 days|~10 GB|~105 GB|~1 TB|-|
|100k samples/sec|90 days|~20 GB|~210 GB|~2 TB|-|
|200k samples/sec|90 days|~40 GB|~420 GB|~4 TB|-|

## Traces
Resource recommendation for ingestion through OTLP (OpenTelemetry Line Procotol) gRPC endpoint. 

### OpenTelemetry Line Protocol

We recommend using the OpenTelemetry collector for ingesting the spans to 
Promscale. Use this configuration with the OTLP exporter and batch processor 
to help with retries for failed writes, and to batch the write requests to Promscale:

```yaml
exporters:
  logging:
  otlp:
    endpoint: "<PROMSCALE_HOST>:<gRPC_PORT>"
    tls:
      insecure: true
    sending_queue:
      queue_size: 1000000
    timeout: 10s
processors:
  batch:
    send_batch_size: 4000
    send_batch_max_size: 4000
    timeout: 10s
```
Where: 
* `<PROMSCALE_HOST>`: hostname of Promscale
* `<gRPC_PORT>`: gRPC port of Promscale. The default port is 9202.  

Compute recommendations for the Promscale connector and TimescaleDB are:

|Ingestion Rate|Connector CPU|Connector Memory|DB CPU|DB Memory|DB connections|
|-|-|-|-|-|-|
|10k spans/sec = ~2.5 MB/sec|0.5|4 GB|2|4 GB|4|
|50k spans/sec = ~5 MB/sec|2|8 MB|4|8 GB|8|
|100k spans/sec = ~10 MB/sec|4|16 GB|8|16 GB|16|
|200k spans/sec = ~20 MB/sec|8|16 GB|16|16 GB|32|

Disk recommendations for TimescaleDB are:

The default chunk interval is `1h`

|Ingest rate|Retention|Disk size per day|Uncompressed buffer|Total disk size|WAL size| 
|-|-|-|-|-|-|
|10k spans/sec = ~2.5 MB/sec|30 days|~30 GB|~35 GB|~935 GB|20 GB|
|50k spans/sec = ~5 MB/sec|30 days|~60 GB|~175 GB|~2 TB|-|
|100k spans/sec= ~10 MB/sec|30 days|~150 GB|~350 GB|~5 TB|-|
|200k spans/sec= ~20 MB/sec|30 days|~300 GB|~700 GB|~10 TB|-|

## Database Configuration

To set the most common parameters to optimal values based on your system, run
`timescaledb-tune`. It accounts for memory, CPU, and PostgreSQL version. For
more information, see [configuration][timescale-tune-configuration]. However,
there are a few other PostgreSQL parameters worth tuning:

* `checkpoint_timeout=15min` - when a lot of data is ingested, increase the
  checkpoint timeout to reduce the input/output pressure.
* `bgwriter_delay=10ms` - the background writer needs to be active to reduce
  delays.
* `bgwriter_lru_maxpages=100000` - increase the number of pages a background
  writer handles to make it more efficient.
* `max_wal_size` - set it to a high enough value so that the checkpoint is triggered
  by the timeout setting and not when the `maximum_wal_size` is reached.
* `synchronous_commit=off` - this does not cause data corruption or
  inconsistency. However, in case of a crash, some of the last data points may be
  lost. For a monitoring observability use case, it's a reasonable tradeoff to
  increase ingest performance. 

<highlight type="important"> 
Make sure that the maximum latency between the
Promscale connector and the database is no more than 100&nbsp;ms. 
</highlight>

[timescale-tune-configuration]: timescaledb/:currentVersion:/how-to-guides/configuration/timescaledb-tune/
