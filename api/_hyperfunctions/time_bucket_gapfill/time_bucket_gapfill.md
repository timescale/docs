---
api_name: time_bucket_gapfill()
excerpt: Bucket rows by time interval while filling gaps in data
topics: [hyperfunctions]
api:
  license: community
  type: function
  version:
    stable: 1.2.0
hyperfunction:
  family: gapfilling
  type: bucket
  bucket_function: time_bucket_gapfill()
api_details:
  summary: >
    Group data into buckets based on time interval, while filling in gaps of missing data.
    If you don't provide a gapfilling algorithm, such as `locf` or `interpolate`, gaps are left as `NULL` in the returned data.
  signatures:
    - language: sql
      code: |
        time_bucket_gapfill(
          bucket_width INTERVAL | INTEGER,
          time TIMESTAMPTZ | INTEGER,
          [, timezone TEXT]
          [, start TIMESTAMPTZ | INTEGER]
          [, finish TIMESTAMPTZ | INTEGER]
        ) RETURNS TIMESTAMPTZ
  parameters:
    required:
      - name: bucket_width
        type: INTERVAL | INTEGER
        description: >
          A PostgreSQL time interval to specify the length of each bucket.
          For example, use `1 day` to get daily buckets.
          Use `INTEGER` only if your time column is integer-based.
      - name: time
        type: TIMESTAMPTZ | INTEGER
        description: The timestamp on which to base the bucket
    optional:
      - name: timezone
        type: TEXT
        description: >
          The timezone to use for bucketing. For example, `Europe/Berlin`.
          Available in TimescaleDB 2.9 or later. Does not work for integer-based time.
          If you have an untyped `start` or `finish` argument and a `timezone` argument, you might run into a problem where you are not passing your arguments for the parameter that you expect.
          To solve this, either name your arguments or explicitly type cast them.
      - name: start
        type: TIMESTAMPTZ | INTEGER
        description: >
          The start of the period to gapfill.
          Values before `start` are passed through, but no gapfilling is performed.
          Use `INTEGER` only if your time column is integer-based.
          Best practice is to use the `WHERE` clause. Specifying `start` is legacy.
          The `WHERE` is more performant, because the query planner can filter out chunks by constraint exclusion.
      - name: finish
        type: TIMESTAMPTZ | INTEGER
        description: >
          The end of the period to gapfill.
          Values after `finish` are passed through, but no gapfilling is performed.
          Use `INTEGER` only if your time column is integer-based.
          Best practice is to use the `WHERE` clause. Specifying `finish` is legacy.
          The `WHERE` is more performant, because the query planner can filter out chunks by constraint exclusion.
    returns:
      - column: time_bucket_gapfill
        type: TIMESTAMPTZ
        description: >
          The start time of the time bucket.
---

