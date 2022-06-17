# Data model

As a relational database supporting full SQL, TimescaleDB supports flexible data
models that can be optimized for different use cases. This makes TimescaleDB
somewhat different from most other time-series databases, which typically use
"narrow-table" models.

Specifically, TimescaleDB can support both wide-table and narrow-table models.
Here, we discuss the different performance trade-offs and implications of these
two models using an Internet of Things (IoT) example.

Imagine a distributed group of 1,000 IoT devices designed to collect
environmental data at various intervals. This data could include:

- **Identifiers:** `device_id`, `timestamp`
- **Metadata:** `location_id`, `dev_type`, `firmware_version`, `customer_id`
- **Device metrics:** `cpu_1m_avg`, `free_mem`, `used_mem`, `net_rssi`, `net_loss`, `battery`
- **Sensor metrics:** `temperature`, `humidity`, `pressure`, `CO`, `NO2`, `PM10`

For example, your incoming data may look like this:

timestamp | device_id | cpu_1m_avg | free_mem | temperature | location_id | dev_type
---:|---:|---:|---:|---:|---:|---:
2017-01-01 01:02:00 | abc123 |  80 | 500&nbsp;MB | 72 | 335 | field
2017-01-01 01:02:23 | def456 |  90 | 400&nbsp;MB | 64 | 335 | roof
2017-01-01 01:02:30 | ghi789 | 120 |   0&nbsp;MB | 56 |  77 | roof
2017-01-01 01:03:12 | abc123 |  80 | 500&nbsp;MB | 72 | 335 | field
2017-01-01 01:03:35 | def456 |  95 | 350&nbsp;MB | 64 | 335 | roof
2017-01-01 01:03:42 | ghi789 | 100 | 100&nbsp;MB | 56 |  77 | roof


Now you can look at various ways to model this data:

- [Wide data model][wide-data-model]
- [Narrow data model][narrow-data-model]

[wide-data-model]: /overview/data-model-flexibility/wide-data-model/
[narrow-data-model]: /overview/data-model-flexibility/narrow-data-model/
