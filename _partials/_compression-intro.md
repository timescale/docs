Compressing your time-series data allows you to reduce your chunk size by more
than 90%. This saves on storage costs, and keeps your queries operating at
lightning speed.

When you enable compression, the data in your hypertable is compressed chunk by
chunk. When the chunk is compressed, the data is converted to a hybrid
row-columnar format. Multiple records are grouped into a single row. The columns
of this row hold an array-like structure that stores all the data. This means
that instead of using lots of rows to store the data, it stores the same data in
a single row. Because a single row takes up less disk space than many rows, it
decreases the amount of disk space required, and can also speed up some queries.
