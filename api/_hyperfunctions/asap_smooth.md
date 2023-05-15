---
api_name: asap_smooth()
excerpt: Downsample a time series using the ASAP smoothing algorithm
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 0.2.0
    stable: 1.11.0
hyperfunction:
  family: downsampling
  type: function
api_details:
  summary: >
    Downsample your data with the [ASAP smoothing algorithm](https://arxiv.org/pdf/1703.00983.pdf).
    This algorithm preserves the approximate shape and larger trends of the input data, while minimizing the local variance between points.
  signatures:
    - language: sql
      code: |
        asap_smooth(
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
      - column: asap_smooth
        type: Timevector
        description: >
          An object representing a series of values occurring at set intervals from a starting time.
          It can be unpacked with `unnest`.
          For more information, see the documentation on [timevectors](/use-timescale/latest/hyperfunctions/function-pipelines/#timevectors).
  examples:
    - description: >
        This example uses a table called `metrics`, with columns for `date` and `reading`. The columns contain measurements that have been accumulated over a large interval of time.
        This example takes that data and provides a smoothed representation of approximately 10 points, but that still shows any anomalous readings:
      command:
        code: |
          SET TIME ZONE 'UTC';
          CREATE TABLE metrics(date TIMESTAMPTZ, reading DOUBLE PRECISION);
          INSERT INTO metrics
          SELECT
              '2020-1-1 UTC'::timestamptz + make_interval(hours=>foo),
              (5 + 5 * sin(foo / 12.0 * PI()))
              FROM generate_series(1,168) foo;

          SELECT * FROM unnest(
            (SELECT asap_smooth(date, reading, 8)
              FROM metrics)
          );
      return:
        code: |
          time                    |        value
          ------------------------+---------------------
          2020-01-01 01:00:00+00  | 5.3664814565722665
          2020-01-01 21:00:00+00  |  5.949469264090644
          2020-01-02 17:00:00+00  |  5.582987807518377
          2020-01-03 13:00:00+00  |  4.633518543427733
          2020-01-04 09:00:00+00  |  4.050530735909357
          2020-01-05 05:00:00+00  |  4.417012192481623
          2020-01-06 01:00:00+00  |  5.366481456572268
          2020-01-06 21:00:00+00  |  5.949469264090643
---

