Research has shown that when data is newly ingested, the queries are more likely
to be shallow in time, and wide in columns. Generally, they are debugging
queries, or queries that cover the whole system, rather than specific, analytic
queries. An example of the kind of query more likely for new data is "show the
current CPU usage, disk usage, energy consumption, and I/O for a particular
server". When this is the case, the uncompressed data has better query
performance, so the native PostgreSQL row-based format is the best option.

However, as data ages, queries are likely to change. They become more
analytical, and involve fewer columns. An example of the kind of query run on
older data is "calculate the average disk usage over the last month." This type
of query runs much faster on compressed, columnar data.

To take advantage of this and increase your query efficiency, you want to run
queries on new data that is uncompressed, and on older data that is compressed.
Setting the right compression policy interval means that recent data is ingested
in an uncompressed, row format for efficient shallow and wide queries, and then
automatically converted to a compressed, columnar format after it ages and is
more likely to be queried using deep and narrow queries. Therefore, one
consideration for choosing the age at which to compress the data is when your
query patterns change from shallow and wide to deep and narrow.
