# Resource recommendations
This section describes the compute and disk requirements that are recommended for Promscale, based on the ingest rate and retention. 

## Metrics
Resource recommendation for ingestion through Prometheus remote-write. 

### Prometheus remote write
Compute recommendations for the Promscale connector and TimescaleDB are:

| Ingestion Rate          | Connector CPU      | Connector Memory   | DB CPU | DB Memory| DB connections |
| --------                | -------- | -------- | -------|----------|----------------|
| 10k samples/sec      |     0.5     |      250 MB    |    1    |    4 GB      |          1      |
| 50k samples/sec      |     2     |     700 MB     |    4    |     16 GB     |       2         |
| 100k samples/sec   |    4      |     2 GB     |          8     |       32 GB         |  4|
| 200k samples/sec   |     8     |     4.5 GB     |     16   |      64 GB    |        8        |

Disk recommendations for TimescaleDB are:

The default chunk interval is `8h`

| Ingest rate       | Retention  | Disk size per day | Uncompressed buffer| Total disk size | WAL size | 
| --------          | --------   |------------|------|-------|---------------|-----------------|
| 10k samples/sec      |     90 days     |    ~2 GB      |  ~21 GB  | ~200 GB   |     1.25 GB              |
|  50k samples/sec      |  90 days        |    ~10 GB      | ~105 GB | ~1 TB      |              -          |
| 100k samples/sec   |     90 days    |    ~20 GB      |  ~210 GB  | ~2 TB    |     -     |
| 200k samples/sec   |     90 days     |      ~40 GB    |  ~420 GB  | ~4 TB   |      -    |

**Disk size per day**: disk consumption per day based on the ingest rate.

**Uncompressed buffer**: disk consumed by uncompressed data before compression.

**Total disk size**: size of disk required to store the data based on the ingest rate and retention. 

<highlight type="tip">
You can calculate the `total disk size` based on rentention and ingest rate using the following formula:

Total disk size = (Disk size per day based on the ingest rate * Retention in days) + 
Uncompressed buffer based on the ingest rate.
</highlight>