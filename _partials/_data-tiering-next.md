Data tiering works by periodically and asynchronously moving older chunks to S3
storage. There, it's stored in the Apache Parquet format, which is a compressed
columnar format well-suited for S3. Data remains accessible both during and
after migration.

When you run regular SQL queries, a behind-the-scenes process transparently
pulls data from wherever it's located: disk storage, object storage, or both.
Various SQL optimizations limit what needs to be read from S3:

*   Chunk exclusion avoids processing chunks that fall outside the query's time
    window
*   The database uses metadata about row groups and columnar offsets, so only
    part of an object needs to be read from S3

The result is transparent queries across standard PostgreSQL storage and S3
storage, so your queries fetch the same data as before, with minimal added
latency.
