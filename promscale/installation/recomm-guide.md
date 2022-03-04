# Resource recommendation guide

The resource recommendation guide is to help you understand the compute and disk requirements for Promscale based on your ingest rate and retention. 

## Metrics

### Prometheus remote write

Below are **compute recommendations** for the Promscale connector and TimescaleDB:

| Ingestion Rate          | Connector CPU      | Connector Memory   | DB CPU | DB Memory| DB connections |
| --------                | -------- | -------- | -------|----------|----------------|
| 10k samples/sec      |     0.5     |      250 MB    |    1    |    4 GB      |          1      |
| 50k samples/sec      |     2     |     700 MB     |    4    |     16 GB     |       2         |
| 100k samples/sec   |    4      |     2 GB     |          8     |       32 GB         |  4|
| 200k samples/sec   |     8     |     4.5 GB     |     16   |      64 GB    |        8        |
| 500k samples/sec   |    32      |     9 GB     |     32   |     128 GB    |        64        |

Below are **disk recommendations** for the TimescaleDB:

Default to chunk interval `8h`

| Ingest rate       | Retention  | Disk size per day | Uncompressed buffer| Total disk size | WAL size | 
| --------          | --------   |------------|------|-------|---------------|-----------------|
| 10k samples/sec      |     90 days     |    ~2 GB      |  ~21 GB  | ~200 GB   |     1.25 GB              |
|  50k samples/sec      |  90 days        |    ~10 GB      | ~105 GB | ~1 TB      |              -          |
| 100k samples/sec   |     90 days    |    ~20 GB      |  ~210 GB  | ~2 TB    |     -     |
| 200k samples/sec   |     90 days     |      ~40 GB    |  ~420 GB  | ~4 TB   |      -    |
| 500k samples/sec   |      90 days    |      ~100 GB    |   ~1.05 TB  | ~10 TB   |     -     |

**Disk size per day**: per day disk consumption per based on the ingest rate.

**Uncompressed buffer**: disk consumed by uncompressed data prior to compression.

**Total disk size**: total disk required to store the data based on the ingest rate and retention. 

You can calculate the **total disk size** based on your rentention and ingest rate using below formula

**Total disk size** = (Disk size per day based on your ingest rate * Retention in days) + Uncompressed buffer.

