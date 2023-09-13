### Vastly improve query performance

As the amount of data in your database grows, query speed tends to get slower.
Timescale hypertables can dramatically improve the performance of large tables.
Hypertables work just like standard PostgreSQL tables, but they are broken down
into chunks, and automatically partitioned by time. This gives you improved
insert and query performance, plus access to an entire suite of useful tools.
Because you work with hypertables in the same way as standard PostgreSQL tables,
you don't need to re-architect your application, or learn any new languages.

### Automatically refresh materialized views with continuous aggregates

Time-series data grows very quickly, and as the data grows, analyzing it gets
slower and uses more resources. Timescale solves the slow-down with continuous
aggregates. Based on PostgreSQL materialized views, continuous aggregates are
incrementally and continuously updated, to make them lightning fast.
Materialized views need to be refreshed and recalculated from scratch every time
they are run, but continuous aggregates are incrementally updated in the
background, so they do not require a lot of resources to keep up to date.
Additionally, you can query your continuous aggregates even if the underlying
data is compressed and archived.

### Achieve 90%+ compression

It is common for databases to provide compression that saves space, but doesn't
improve query performance for data that spans long time intervals. Timescale
includes native compression for your hypertables that improves query performance
and dramatically reduces data volume. Timescale compression uses native columnar
compression and best-in-class algorithms that are automatically chosen based on
your data, which saves space and improves performance. Timescale subscribers
usually see compression ratios greater than 90% and, because you only pay for
the storage space that you actually use, that means that you save money from the
moment you start.

### Lower costs with data tiering to S3

When you are working with time-series and event data, storage costs can easily
spiral out of control. With Timescale, you never have to worry about hidden
costs for your storage because you only pay for what you actually use. You don't
need to allocate a fixed storage volume or worry about managing your disk size
and, if you compress or delete data, you immediately reduce the size of your
bill. Timescale also allows you to change how your data is stored with data
tiering to S3, with no limits to how much data you tier. This lets you choose a
cheaper storage option for historical data, with no hidden costs like extra
charges for querying or reading tiered data. When you have enabled data tiering,
your data is automatically archived as it ages, so there is no need to manually
perform archive operations. Best of all, your historical data is not siloed, so
your active and tiered data can be queried directly from within the same
database.

### Timescale works for you end-to-end

Converting your PostgreSQL tables to hypertables instantly improves query and
insert performance, and gives you immediate access to continuous aggregates and
compression. Continuous aggregates continuously and incrementally materialize
your aggregate queries, giving you updated insights as soon as new data arrives.
Compression immediately improves database performance and, with usage-based
storage, also saves you money. Pair all this with data tiering to automatically
archive older data, saving money, but retaining access when you need it. Want to
know more? Keep reading, and remember our world-class support team is here to
help you if you need it, every step of the way.
