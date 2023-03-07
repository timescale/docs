When you enable compression, the data in your hypertable is compressed chunk by
chunk. When the chunk is compressed, the data is converted to a hybrid
row-columnar format. Multiple records are grouped into a single row. The columns
of this row hold an array-like structure that stores all the data. This means
that instead of using lots of rows to store the data, it stores the same data in
a single row. Because a single row takes up less disk space than many rows, it
decreases the amount of disk space required, and can also speed up some queries.

As a simplified example, you might have a table that looks like this to start with:

|time|device_id|cpu|energy_consumption|
|-|-|-|-|
|12:00:02|1|88.2|0.8|
|12:00:02|2|300.5|0.9|
|12:00:01|1|88.6|0.85|
|12:00:01|2|299.1|0.95|

When compression is applied, the data is converted to a single row containing an
array, like this:

|time|device_id|cpu|energy_consumption|
|-|-|-|-|
|[12:00:02, 12:00:02, 12:00:01, 12:00:1]|[1, 2, 1, 2]|[88.2, 300.5, 88.6, 299.1]|[0.8, 0.9, 0.85, 0.95]|
