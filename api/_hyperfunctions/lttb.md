---
api_name: lttb()
excerpt: Downsample a time series using the Largest Triangle Three Buckets method
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 0.2.0
    stable: 1.10.1
hyperfunction:
  family: downsampling
  type: function
api_details:
  summary: >
    Downsample your data with the [Largest Triangle Three Buckets algorithm](https://github.com/sveinn-steinarsson/flot-downsample).
    This algorithm tries to retain visual similarity between the downsampled data and the original dataset.
  signatures:
    - language: sql
      code: |
        lttb(
          ts TIMESTAMPTZ,
          value DOUBLE PRECISION,
          resolution INT
        ) RETURNS Timevector
  parameters:
    required:
      - name: ts
        type: TIMESTAMPTZ
        description: Timestamps for each data point
      - name: value
        type: DOUBLE PRECISION
        description: The value at each timestamp
      - name: resolution
        type: INT
        description: The approximate number of points to return. Determines the horizontal resolution of the resulting graph.
    returns:
      - column: lttb
        type: Timevector
        description: >
          An object representing a series of values occurring at set intervals from a starting time.
          It can be unpacked with `unnest`.
          For more information, see the documentation on [timevectors](/use-timescale/latest/hyperfunctions/function-pipelines/#timevectors).
  examples:
    - description: >
        This example uses a table with raw data generated as a sine wave.
        You can use LTTB to dramatically reduce the number of points while still capturing the peaks and valleys in the data.
      command:
        code: |
          SET TIME ZONE 'UTC';
          CREATE TABLE metrics(date TIMESTAMPTZ, reading DOUBLE PRECISION);
          INSERT INTO metrics
          SELECT
              '2020-1-1 UTC'::timestamptz + make_interval(hours=>foo),
              (5 + 5 * sin(foo / 24.0 * PI()))
              FROM generate_series(1,168) foo;

          SELECT time, value
          FROM unnest((
              SELECT lttb(date, reading, 8)
              FROM metrics))
      return:
        code: |
          time                    |               value 
          ------------------------+---------------------
          2020-01-01 01:00:00+00  |   5.652630961100257
          2020-01-01 13:00:00+00  |   9.957224306869053
          2020-01-02 11:00:00+00  | 0.04277569313094798
          2020-01-03 11:00:00+00  |   9.957224306869051
          2020-01-04 13:00:00+00  | 0.04277569313094709
          2020-01-05 16:00:00+00  |   9.330127018922191
          2020-01-06 20:00:00+00  |  2.4999999999999996
          2020-01-08 00:00:00+00  |   5.000000000000004
---

