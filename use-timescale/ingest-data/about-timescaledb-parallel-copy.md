---
title: Install and use timescaledb-parallel-copy
excerpt: Speed up bulk inserts of data with an open-source tool
products: [cloud, mst, self_hosted]
keywords: [timescaledb-parallel-copy, copy]
---

# About timescaledb-parallel-copy

To speed up bulk inserts of data, Timescale provides an open source [parallel
importer][github-tscopy] program called `timescaledb-parallel-copy`. The program
parallelizes migration by using several workers to run multiple `COPY` functions
concurrently.

PostgreSQL's native `COPY` function is transactional and single-threaded, and is not
suitable for ingesting large amounts of data. If the file is at least
chronologically ordered with respect to the time dimension of the hypertable,
`timescaledb-parallel-copy` improves performance by parallelizing this
operation. This enables you to take full advantage of your hardware resources.

`timescaledb-parallel-copy` ingests data efficiently by preserving the order
of the rows. The `round-robin` approach to share inserts between parallel
workers ensures that the database switches between chunks less often. This
improves memory management and keeps operations on the disk as sequential as
possible.

## Before you begin

*   Install [Go runtime][go-install] version 1.13 or later.
*   Create a [service][create-service] on Timescale.
*   Gather the connection details for [your database][connect-timescaledb].
*   Create a [hypertable][create-hypertable] database to
    insert the data. Ensure that you use a schema that matches the data in your
    `.csv` file.

<Procedure>

### Importing data using timescaledb-parallel-copy

1.  Install `timescaledb-parallel-copy` from the github repository:

    ```bash
    go install github.com/timescale/timescaledb-parallel-copy/cmd/timescaledb-parallel-copy@latest
    ```

1.  Check the version of `timescaledb-parallel-copy`:

    ```bash
    timescaledb-parallel-copy --version
    ```

1.  Change to the directory that contains the `.csv` files to import.

1.  To import data into `tsdb` database on cloud. Set `<NUM_WORKERS>` to twice
    the number of CPUs in your database. For example, if you have 4 CPUs,
    `<NUM_WORKERS>` should be `8`.

    ```bash
    timescaledb-parallel-copy \
    --connection "host=<CLOUD_HOST> \
    user=tsdbadmin password=<CLOUD_PASSWORD> \
    port=<CLOUD_PORT> \
    sslmode=require" \
    --db-name tsdb \
    --table <TABLE_NAME> \
    --file <FILE_NAME>.csv \
    --workers <NUM_WORKERS> \
    --reporting-period 30s
    ```

    <Highlight type="note">
    To import data into a `tsdb` database on a localhost the
    *connection* parameter would be `"host=localhost user=postgres
    sslmode=disable"`
     </Highlight>

</Procedure>

[github-tscopy]: https://github.com/timescale/timescaledb-parallel-copy
[go-install]: https://go.dev/doc/install
[create-service]: /getting-started/latest/
[connect-timescaledb]: /use-timescale/latest/connecting/about-connecting/
[create-hypertable]: /use-timescale/latest/hypertables/create/
