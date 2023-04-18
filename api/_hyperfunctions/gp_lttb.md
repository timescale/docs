---
api_name: gp_lttb()
excerpt: Downsample a time series using the Largest Triangle Three Buckets method, while preserving gaps in original data
topics: [hyperfunctions]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
  version:
    experimental: 1.11.0
hyperfunction:
  family: downsampling
  type: function
api_details:
  summary: |
    Downsample your data with the [Largest Triangle Three Buckets algorithm](https://github.com/sveinn-steinarsson/flot-downsample), while preserving gaps in the underlying data.
    This method is a specialization of the [LTTB](/api/latest/hyperfunctions/downsampling#lttb) algorithm.
  signatures:
    - language: sql
      code: |
        gp_lttb(
          ts TIMESTAMPTZ,
          value DOUBLE PRECISION,
          resolution INT
          [, gapsize INTERVAL]
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
    optional:
      - name: gapsize
        type: INTERVAL
        description: Minimum gap size to divide input on
    returns:
      - column: gp_lttb
        type: Timevector
        description: >
          An object representing a series of values occurring at set intervals from a starting time.
          It can be unpacked with `unnest`.
          For more information, see the documentation on [timevectors](/use-timescale/latest/hyperfunctions/function-pipelines/#timevectors).
  examples:
    - description: >
        This example uses a table with raw data generated as a sine wave, and removes a day from the middle of the data.
        You can use gap preserving LTTB to downsample the data while keeping the bounds of the missing region.
      command:
        code: |
          SET TIME ZONE 'UTC';
          CREATE TABLE metrics(date TIMESTAMPTZ, reading DOUBLE PRECISION);
          INSERT INTO metrics
          SELECT
              '2020-1-1 UTC'::timestamptz + make_interval(hours=>foo),
              (5 + 5 * sin(foo / 24.0 * PI()))
              FROM generate_series(1,168) foo;
          DELETE FROM metrics WHERE date BETWEEN '2020-1-4 UTC' AND '2020-1-5 UTC';

          SELECT time, value
          FROM unnest((
              SELECT toolkit_experimental.gp_lttb(date, reading, 8)
              FROM metrics))
      return:
        code: |
          time                   |             value
          -----------------------+-------------------
          2020-01-01 01:00:00+00 | 5.652630961100257
          2020-01-02 12:00:00+00 |                 0
          2020-01-03 23:00:00+00 | 5.652630961100255
          2020-01-05 01:00:00+00 | 5.652630961100259
          2020-01-05 13:00:00+00 | 9.957224306869051
          2020-01-06 12:00:00+00 |                 0
          2020-01-07 10:00:00+00 |  9.82962913144534
          2020-01-08 00:00:00+00 | 5.000000000000004
---

